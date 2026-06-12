import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, forkJoin, from, map, mergeMap, of } from 'rxjs';
import { HttpPokeapiService } from './http/http-pokeapi/http-pokeapi.service';
import { PokedexCacheService } from './pokedex-cache.service';
import { PokemonListResponseDto } from './http/http-pokeapi/models/pokemon-list-response.dto';
import { TypeDto } from './http/http-pokeapi/models/type.dto';
import { PokemonSpeciesDto } from './http/http-pokeapi/models/pokemon-species.dto';
import { PokemonSummary } from '../models/pokemon-summary.model';
import { PokemonType } from '../models/pokemon-type.enum';
import { Rarity } from '../models/rarity.model';
import { RarityCategory } from '../models/rarity-category.enum';
import { RarityTier } from '../models/rarity-tier.enum';
import { SortOption } from '../models/sort-option.enum';
import { LoadStatus } from '../models/load-status.enum';
import { ResourceId } from '../models/resource-id.model';
import { TypePalette } from '../models/type-palette.model';
import { PokemonFilter } from '../models/pokemon-filter.model';
import { PokemonFilterCriteria } from '../models/pokemon-filter-criteria.model';

/**
 * Single source of truth for the Pokédex list: builds the index (1 request) and the
 * id → types map (18 parallel requests), keeps filter/pagination state in signals, and
 * lazily fills the rarity index with bounded concurrency, progress and a versioned cache.
 */
@Injectable({
  providedIn: 'root',
})
export class PokedexStore {
  private static readonly summariesKey = 'summaries';
  private static readonly rarityKey = 'rarity';
  private static readonly rarityConcurrency = 10;
  private static readonly rarityFlushEvery = 50;
  private static readonly defaultPageSize = 24;

  private readonly api = inject(HttpPokeapiService);
  private readonly cache = inject(PokedexCacheService);

  private readonly _summaries = signal<PokemonSummary[]>([]);
  private readonly _status = signal<LoadStatus>(LoadStatus.IDLE);
  readonly status = this._status.asReadonly();

  private readonly _rarityById = signal<Map<number, Rarity>>(new Map());
  private readonly _rarityLoadedCount = signal(0);
  private readonly _rarityTotalCount = signal(0);
  private readonly _rarityLoading = signal(false);
  readonly rarityLoading = this._rarityLoading.asReadonly();
  readonly rarityLoadedCount = this._rarityLoadedCount.asReadonly();
  readonly rarityTotalCount = this._rarityTotalCount.asReadonly();
  readonly rarityProgress = computed(() => {
    const total = this._rarityTotalCount();
    return total === 0 ? 0 : Math.round((this._rarityLoadedCount() / total) * 100);
  });

  // Filter state — writable so the list page can sync it with the URL query params.
  readonly search = signal('');
  readonly sort = signal<SortOption>(SortOption.NUMBER_ASC);
  readonly selectedTypes = signal<PokemonType[]>([]);
  readonly rarityCategories = signal<RarityCategory[]>([]);
  readonly rarityTiers = signal<RarityTier[]>([]);

  readonly pageIndex = signal(0);
  readonly pageSize = signal(PokedexStore.defaultPageSize);

  private readonly criteria = computed(
    () =>
      new PokemonFilterCriteria(
        this.search(),
        this.sort(),
        this.selectedTypes(),
        this.rarityCategories(),
        this.rarityTiers(),
      ),
  );

  readonly filtered = computed(() =>
    PokemonFilter.apply(this._summaries(), this.criteria(), this._rarityById()),
  );
  readonly total = computed(() => this.filtered().length);
  readonly hasData = computed(() => this._summaries().length > 0);
  readonly pageItems = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  rarityOf(id: number): Rarity | undefined {
    return this._rarityById().get(id);
  }

  loadIndex(): void {
    if (this._status() === LoadStatus.LOADING || this._summaries().length > 0) {
      return;
    }
    const cached = this.cache.get<PokemonSummary[]>(PokedexStore.summariesKey);
    if (cached && cached.length > 0) {
      this._summaries.set(cached.map((item) => new PokemonSummary(item.id, item.name, item.types)));
      this._status.set(LoadStatus.READY);
      this.hydrateRarityFromCache();
      return;
    }

    this._status.set(LoadStatus.LOADING);
    forkJoin({
      index: this.api.getIndex(),
      types: forkJoin(TypePalette.all().map((type) => this.api.getType(type))),
    }).subscribe({
      next: ({ index, types }) => {
        const summaries = this.buildSummaries(index, types);
        this._summaries.set(summaries);
        this.cache.set(PokedexStore.summariesKey, summaries);
        this._status.set(LoadStatus.READY);
        this.hydrateRarityFromCache();
      },
      error: () => {
        this._status.set(LoadStatus.ERROR);
      },
    });
  }

  retryIndex(): void {
    this._status.set(LoadStatus.IDLE);
    this.loadIndex();
  }

  /** Lazily builds the rarity index (one `pokemon-species` request per Pokémon). */
  loadRarity(): void {
    if (this._rarityLoading()) {
      return;
    }
    const summaries = this._summaries();
    if (summaries.length === 0) {
      return;
    }
    this.hydrateRarityFromCache();

    const working = new Map(this._rarityById());
    const missing = summaries.map((summary) => summary.id).filter((id) => !working.has(id));
    this._rarityTotalCount.set(summaries.length);
    this._rarityLoadedCount.set(summaries.length - missing.length);
    if (missing.length === 0) {
      return;
    }

    this._rarityLoading.set(true);
    let sinceFlush = 0;
    from(missing)
      .pipe(
        mergeMap(
          (id) =>
            this.api.getSpecies(id).pipe(
              map((species) => ({ id, rarity: this.rarityFromSpecies(species) })),
              catchError(() => of({ id, rarity: null as Rarity | null })),
            ),
          PokedexStore.rarityConcurrency,
        ),
        finalize(() => {
          this._rarityById.set(new Map(working));
          this.persistRarity(working);
          this._rarityLoading.set(false);
        }),
      )
      .subscribe(({ id, rarity }) => {
        if (rarity) {
          working.set(id, rarity);
        }
        this._rarityLoadedCount.update((count) => count + 1);
        sinceFlush += 1;
        if (sinceFlush >= PokedexStore.rarityFlushEvery) {
          sinceFlush = 0;
          this._rarityById.set(new Map(working));
        }
      });
  }

  resetFilters(): void {
    this.search.set('');
    this.sort.set(SortOption.NUMBER_ASC);
    this.selectedTypes.set([]);
    this.rarityCategories.set([]);
    this.rarityTiers.set([]);
    this.pageIndex.set(0);
  }

  private buildSummaries(index: PokemonListResponseDto, types: TypeDto[]): PokemonSummary[] {
    const slotsById = new Map<number, { slot: number; type: PokemonType }[]>();
    types.forEach((typeDto) => {
      const type = typeDto.name as PokemonType;
      typeDto.pokemon.forEach((entry) => {
        const id = ResourceId.fromUrl(entry.pokemon.url);
        if (id <= 0) {
          return;
        }
        const list = slotsById.get(id) ?? [];
        list.push({ slot: entry.slot, type });
        slotsById.set(id, list);
      });
    });

    return index.results
      .map((resource) => {
        const id = ResourceId.fromUrl(resource.url);
        const slots = slotsById.get(id) ?? [];
        const sortedTypes = [...slots]
          .sort((left, right) => left.slot - right.slot)
          .map((slot) => slot.type);
        return new PokemonSummary(id, resource.name, sortedTypes);
      })
      .filter((summary) => summary.id > 0);
  }

  private rarityFromSpecies(species: PokemonSpeciesDto): Rarity {
    return Rarity.fromSpecies(
      {
        isBaby: species.isBaby,
        isLegendary: species.isLegendary,
        isMythical: species.isMythical,
      },
      species.captureRate,
    );
  }

  private hydrateRarityFromCache(): void {
    if (this._rarityById().size > 0) {
      return;
    }
    const cached = this.cache.get<{ id: number; category: RarityCategory; tier: RarityTier }[]>(
      PokedexStore.rarityKey,
    );
    if (!cached || cached.length === 0) {
      return;
    }
    const restored = new Map<number, Rarity>();
    cached.forEach((item) => restored.set(item.id, new Rarity(item.category, item.tier)));
    this._rarityById.set(restored);
  }

  private persistRarity(working: Map<number, Rarity>): void {
    const snapshot = [...working.entries()].map(([id, rarity]) => ({
      id,
      category: rarity.category,
      tier: rarity.tier,
    }));
    this.cache.set(PokedexStore.rarityKey, snapshot);
  }
}
