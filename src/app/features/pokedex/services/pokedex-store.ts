import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, forkJoin, from } from 'rxjs';
import { bufferCount, catchError, finalize, map, mergeMap } from 'rxjs/operators';

import { HttpPokeapiService } from './http/http-pokeapi/http-pokeapi.service';
import { PokedexCache } from './pokedex-cache';
import { PokemonSummary } from '../models/pokemon-summary.model';
import { PokemonRarity } from '../models/pokemon-rarity.model';
import { PokemonType, POKEMON_TYPES } from '../models/pokemon-type.enum';
import { RarityCategory } from '../models/rarity-category.enum';
import { RarityTier } from '../models/rarity-tier.enum';
import { SortOption } from '../models/sort-option.enum';
import { extractIdFromUrl } from '../utils/pokemon-id';
import { resolveRarity } from '../utils/rarity';
import { filterAndSort, IPokemonFilterCriteria } from '../utils/filter-sort';

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

interface IIndexEntry {
  id: number;
  name: string;
}

interface IRaritySnapshot {
  category: RarityCategory;
  tier: RarityTier;
  captureRate: number;
}

const RARITY_CONCURRENCY = 10;
const RARITY_BATCH = 50;
const DEFAULT_PAGE_SIZE = 24;
const INDEX_KEY = 'index';
const TYPE_MAP_KEY = 'type-map';
const RARITY_MAP_KEY = 'rarity-map';

/**
 * Singleton state for the Pokédex list: loads the name + type indices once,
 * exposes signal-based filters/sort/pagination, and fills the rarity index
 * lazily (concurrency-limited) with progress.
 */
@Injectable({ providedIn: 'root' })
export class PokedexStore {
  private readonly api = inject(HttpPokeapiService);
  private readonly cache = inject(PokedexCache);
  private readonly destroyRef = inject(DestroyRef);

  private readonly index = signal<readonly IIndexEntry[]>([]);
  private readonly typeMap = signal<ReadonlyMap<number, PokemonType[]>>(new Map());
  private readonly rarityMap = signal<ReadonlyMap<number, PokemonRarity>>(new Map());

  readonly status = signal<LoadStatus>('idle');
  readonly errorMessage = signal<string | null>(null);
  readonly rarityStatus = signal<LoadStatus>('idle');
  readonly rarityLoaded = signal(0);

  readonly search = signal('');
  readonly selectedTypes = signal<readonly PokemonType[]>([]);
  readonly selectedCategories = signal<readonly RarityCategory[]>([]);
  readonly selectedTiers = signal<readonly RarityTier[]>([]);
  readonly sort = signal<SortOption>(SortOption.NumberAsc);
  readonly pageIndex = signal(0);
  readonly pageSize = signal(DEFAULT_PAGE_SIZE);

  readonly rarityTotal = computed(() => this.index().length);

  private readonly allPokemon = computed<PokemonSummary[]>(() => {
    const types = this.typeMap();
    const rarities = this.rarityMap();
    return this.index().map(
      (entry) => new PokemonSummary(entry.id, entry.name, types.get(entry.id) ?? [], rarities.get(entry.id)),
    );
  });

  private readonly criteria = computed<IPokemonFilterCriteria>(() => ({
    search: this.search(),
    types: this.selectedTypes(),
    categories: this.selectedCategories(),
    tiers: this.selectedTiers(),
  }));

  readonly filtered = computed(() =>
    filterAndSort({ list: this.allPokemon(), criteria: this.criteria(), sort: this.sort() }),
  );

  readonly total = computed(() => this.filtered().length);

  readonly pagePokemon = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  readonly rarityFilterActive = computed(
    () => this.selectedCategories().length > 0 || this.selectedTiers().length > 0,
  );

  loadIndex(): void {
    if ('loading' === this.status() || 'ready' === this.status()) {
      return;
    }
    this.status.set('loading');
    this.errorMessage.set(null);

    if (this.restoreIndexFromCache()) {
      return;
    }

    const types$ = POKEMON_TYPES.map((type) =>
      this.api.getType(type).pipe(map((response) => ({ type, response }))),
    );

    forkJoin({ index: this.api.getPokemonIndex(), types: forkJoin(types$) })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ index, types }) => {
          const entries = index.results.map((result) => ({
            id: extractIdFromUrl(result.url),
            name: result.name,
          }));
          const typeMap = new Map<number, PokemonType[]>();
          types.forEach(({ type, response }) => {
            response.pokemon.forEach((entry) => {
              const id = extractIdFromUrl(entry.pokemon.url);
              const current = typeMap.get(id) ?? [];
              current.push(type);
              typeMap.set(id, current);
            });
          });

          this.index.set(entries);
          this.typeMap.set(typeMap);
          this.cache.write(INDEX_KEY, entries);
          this.cache.write(TYPE_MAP_KEY, [...typeMap.entries()]);
          this.status.set('ready');
        },
        error: () => {
          this.status.set('error');
          this.errorMessage.set('Não foi possível carregar a Pokédex. Tente novamente.');
        },
      });
  }

  retry(): void {
    this.status.set('idle');
    this.loadIndex();
  }

  ensureRarityIndex(): void {
    if ('loading' === this.rarityStatus() || 'ready' === this.rarityStatus()) {
      return;
    }
    const entries = this.index();
    if (0 === entries.length) {
      return;
    }
    if (this.restoreRarityFromCache(entries.length)) {
      return;
    }

    this.rarityStatus.set('loading');
    this.rarityLoaded.set(0);
    const accumulator = new Map<number, PokemonRarity>();

    from(entries)
      .pipe(
        mergeMap(
          (entry) =>
            this.api.getSpecies(entry.id).pipe(
              map((species) => ({
                id: entry.id,
                rarity: resolveRarity({
                  isBaby: species.isBaby,
                  isLegendary: species.isLegendary,
                  isMythical: species.isMythical,
                  captureRate: species.captureRate,
                }),
              })),
              catchError(() => EMPTY),
            ),
          RARITY_CONCURRENCY,
        ),
        bufferCount(RARITY_BATCH),
        finalize(() => {
          this.rarityStatus.set('ready');
          this.cache.write(RARITY_MAP_KEY, this.serializeRarity(accumulator));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((batch) => {
        batch.forEach(({ id, rarity }) => accumulator.set(id, rarity));
        this.rarityMap.set(new Map(accumulator));
        this.rarityLoaded.set(accumulator.size);
      });
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.pageIndex.set(0);
  }

  setSelectedTypes(types: readonly PokemonType[]): void {
    this.selectedTypes.set([...types]);
    this.pageIndex.set(0);
  }

  setSelectedCategories(categories: readonly RarityCategory[]): void {
    this.selectedCategories.set([...categories]);
    this.pageIndex.set(0);
    if (categories.length > 0) {
      this.ensureRarityIndex();
    }
  }

  setSelectedTiers(tiers: readonly RarityTier[]): void {
    this.selectedTiers.set([...tiers]);
    this.pageIndex.set(0);
    if (tiers.length > 0) {
      this.ensureRarityIndex();
    }
  }

  setSort(sort: SortOption): void {
    this.sort.set(sort);
    this.pageIndex.set(0);
  }

  setPage(pageIndex: number, pageSize: number): void {
    this.pageIndex.set(pageIndex);
    this.pageSize.set(pageSize);
  }

  clearFilters(): void {
    this.search.set('');
    this.selectedTypes.set([]);
    this.selectedCategories.set([]);
    this.selectedTiers.set([]);
    this.sort.set(SortOption.NumberAsc);
    this.pageIndex.set(0);
  }

  private restoreIndexFromCache(): boolean {
    const cachedIndex = this.cache.read<IIndexEntry[]>(INDEX_KEY);
    const cachedTypes = this.cache.read<[number, PokemonType[]][]>(TYPE_MAP_KEY);
    if (!cachedIndex || !cachedTypes) {
      return false;
    }
    this.index.set(cachedIndex);
    this.typeMap.set(new Map(cachedTypes));
    this.status.set('ready');
    return true;
  }

  private restoreRarityFromCache(expectedSize: number): boolean {
    const cached = this.cache.read<[number, IRaritySnapshot][]>(RARITY_MAP_KEY);
    if (!cached || cached.length < expectedSize) {
      return false;
    }
    const map = new Map<number, PokemonRarity>();
    cached.forEach(([id, snapshot]) => {
      map.set(id, new PokemonRarity(snapshot.category, snapshot.tier, snapshot.captureRate));
    });
    this.rarityMap.set(map);
    this.rarityLoaded.set(map.size);
    this.rarityStatus.set('ready');
    return true;
  }

  private serializeRarity(map: ReadonlyMap<number, PokemonRarity>): [number, IRaritySnapshot][] {
    return [...map.entries()].map(([id, rarity]) => [
      id,
      { category: rarity.category, tier: rarity.tier, captureRate: rarity.captureRate },
    ]);
  }
}
