import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, EMPTY, forkJoin, from, map, mergeMap } from 'rxjs';

import { HttpPokeapiService } from '../../services/http/http-pokeapi/http-pokeapi.service';
import { NamedApiResourceListDto } from '../../services/http/http-pokeapi/models/named-api-resource-list.dto';
import { PokemonCacheService } from './pokemon-cache.service';
import { deriveRarity, RarityInfo } from './rarity';
import { idFromResourceUrl } from './sprites';

export interface PokemonIndexEntry {
  readonly id: number;
  readonly name: string;
}

export interface PokemonListItem {
  readonly id: number;
  readonly name: string;
  readonly types: readonly string[];
}

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';
type RarityStatus = 'idle' | 'building' | 'ready' | 'error';

const CACHE_KEYS = {
  index: 'index',
  typeNames: 'type-names',
  typeMap: 'type-map',
  rarityMap: 'rarity-map',
  rarityComplete: 'rarity-complete',
} as const;

/** Types with no real Pokémon membership. */
const NON_REAL_TYPES = new Set(['unknown', 'shadow']);

/** How many species requests to keep in flight while building the rarity index. */
const RARITY_CONCURRENCY = 8;

function toIndexEntries(list: NamedApiResourceListDto): PokemonIndexEntry[] {
  return list.results
    .map((entry) => ({ id: idFromResourceUrl(entry.url), name: entry.name }))
    .filter((entry) => Number.isFinite(entry.id))
    .sort((a, b) => a.id - b.id);
}

/**
 * Central state for the Pokédex. Loads the cheap index + type map up front
 * (~19 requests) and builds the expensive species-based rarity index lazily,
 * persisting everything via {@link PokemonCacheService}.
 */
@Injectable({ providedIn: 'root' })
export class PokedexStore {
  private readonly api = inject(HttpPokeapiService);
  private readonly cache = inject(PokemonCacheService);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly index = signal<readonly PokemonIndexEntry[]>([]);
  private readonly typeMap = signal<ReadonlyMap<number, readonly string[]>>(new Map());

  readonly typeNames = signal<readonly string[]>([]);
  readonly status = signal<LoadStatus>('idle');

  readonly rarityMap = signal<ReadonlyMap<number, RarityInfo>>(new Map());
  readonly rarityStatus = signal<RarityStatus>('idle');
  readonly rarityProgress = signal<{ loaded: number; total: number }>({ loaded: 0, total: 0 });

  /** Combined list used by the UI: index entries enriched with their types. */
  readonly list = computed<PokemonListItem[]>(() => {
    const types = this.typeMap();
    return this.index().map((entry) => ({
      id: entry.id,
      name: entry.name,
      types: types.get(entry.id) ?? [],
    }));
  });

  /** Loads the index + type map. Safe to call repeatedly; runs at most once. */
  loadIndex(): void {
    if (!this.isBrowser || this.status() === 'loading' || this.status() === 'ready') {
      return;
    }
    if (this.hydrateIndexFromCache()) {
      return;
    }

    this.status.set('loading');
    forkJoin({
      pokemonList: this.api.getPokemonList(),
      typeList: this.api.getTypeList(),
    })
      .pipe(
        mergeMap(({ pokemonList, typeList }) => {
          const index = toIndexEntries(pokemonList);
          const typeNames = typeList.results
            .map((entry) => entry.name)
            .filter((name) => !NON_REAL_TYPES.has(name));
          return forkJoin(
            typeNames.map((name) =>
              this.api.getType(name).pipe(
                map((type) => ({
                  name,
                  ids: type.pokemon
                    .map((member) => idFromResourceUrl(member.pokemon.url))
                    .filter((id) => Number.isFinite(id)),
                })),
              ),
            ),
          ).pipe(map((typeMembership) => ({ index, typeNames, typeMembership })));
        }),
      )
      .subscribe({
        next: ({ index, typeNames, typeMembership }) => {
          const typeMap = new Map<number, string[]>();
          for (const { name, ids } of typeMembership) {
            for (const id of ids) {
              const existing = typeMap.get(id);
              if (existing) existing.push(name);
              else typeMap.set(id, [name]);
            }
          }
          this.index.set(index);
          this.typeNames.set(typeNames);
          this.typeMap.set(typeMap);
          this.status.set('ready');

          this.cache.set(CACHE_KEYS.index, index, true);
          this.cache.set(CACHE_KEYS.typeNames, typeNames, true);
          this.cache.set(CACHE_KEYS.typeMap, [...typeMap.entries()], true);
        },
        error: () => this.status.set('error'),
      });
  }

  /** Starts (once) the lazy build of the species-based rarity index. */
  ensureRarityIndex(): void {
    if (!this.isBrowser || this.rarityStatus() === 'building' || this.rarityStatus() === 'ready') {
      return;
    }
    if (this.hydrateRarityFromCache()) {
      return;
    }

    this.rarityStatus.set('building');
    this.api
      .getSpeciesList()
      .pipe(
        mergeMap((speciesList) => {
          const entries = toIndexEntries(speciesList);
          this.rarityProgress.set({ loaded: 0, total: entries.length });
          return from(entries).pipe(
            mergeMap(
              (entry) =>
                this.api.getSpecies(entry.id).pipe(
                  map((species) => ({ id: entry.id, rarity: deriveRarity(species) })),
                  catchError(() => EMPTY),
                ),
              RARITY_CONCURRENCY,
            ),
          );
        }),
      )
      .subscribe({
        next: ({ id, rarity }) => {
          const next = new Map(this.rarityMap());
          next.set(id, rarity);
          this.rarityMap.set(next);
          this.rarityProgress.update((p) => ({ ...p, loaded: p.loaded + 1 }));
        },
        error: () => this.rarityStatus.set('error'),
        complete: () => {
          this.rarityStatus.set('ready');
          this.cache.set(CACHE_KEYS.rarityMap, [...this.rarityMap().entries()], true);
          this.cache.set(CACHE_KEYS.rarityComplete, true, true);
        },
      });
  }

  retry(): void {
    this.status.set('idle');
    this.loadIndex();
  }

  private hydrateIndexFromCache(): boolean {
    const index = this.cache.get<PokemonIndexEntry[]>(CACHE_KEYS.index);
    const typeNames = this.cache.get<string[]>(CACHE_KEYS.typeNames);
    const typeMapEntries = this.cache.get<[number, string[]][]>(CACHE_KEYS.typeMap);
    if (!index || !typeNames || !typeMapEntries) {
      return false;
    }
    this.index.set(index);
    this.typeNames.set(typeNames);
    this.typeMap.set(new Map(typeMapEntries));
    this.status.set('ready');
    return true;
  }

  private hydrateRarityFromCache(): boolean {
    const complete = this.cache.get<boolean>(CACHE_KEYS.rarityComplete);
    const entries = this.cache.get<[number, RarityInfo][]>(CACHE_KEYS.rarityMap);
    if (!complete || !entries) {
      return false;
    }
    this.rarityMap.set(new Map(entries));
    this.rarityProgress.set({ loaded: entries.length, total: entries.length });
    this.rarityStatus.set('ready');
    return true;
  }
}
