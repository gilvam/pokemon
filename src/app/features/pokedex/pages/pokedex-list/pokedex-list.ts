import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatPaginatorModule, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PokedexStore } from '../../services/pokedex-store';
import { PokemonFilters } from '../../components/pokemon-filters/pokemon-filters';
import { PokemonCard } from '../../components/pokemon-card/pokemon-card';
import { PokedexFilterForm } from '../../components/pokemon-filters/pokedex-filter-form';
import { PokemonType, POKEMON_TYPES } from '../../models/pokemon-type.enum';
import { RarityCategory, RARITY_CATEGORIES } from '../../models/rarity-category.enum';
import { RarityTier, RARITY_TIERS } from '../../models/rarity-tier.enum';
import { SortOption } from '../../models/sort-option.enum';
import { createPokedexPaginatorIntl } from '../../utils/pokedex-paginator-intl';

const FILTER_DEBOUNCE_MS = 250;
const PAGE_SIZE_OPTIONS = [24, 48, 96];

@Component({
  selector: 'app-pokedex-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PokemonFilters,
    PokemonCard,
    MatPaginatorModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: createPokedexPaginatorIntl }],
  templateUrl: './pokedex-list.html',
  styleUrl: './pokedex-list.scss',
})
export class PokedexList implements OnInit {
  protected readonly store = inject(PokedexStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly pageSizeOptions = PAGE_SIZE_OPTIONS;

  protected readonly form: PokedexFilterForm = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    sort: new FormControl<SortOption>(SortOption.NumberAsc, { nonNullable: true }),
    types: new FormControl<PokemonType[]>([], { nonNullable: true }),
    categories: new FormControl<RarityCategory[]>([], { nonNullable: true }),
    tiers: new FormControl<RarityTier[]>([], { nonNullable: true }),
  });

  ngOnInit(): void {
    this.store.loadIndex();
    this.restoreFromQueryParams();

    this.form.valueChanges
      .pipe(
        debounceTime(FILTER_DEBOUNCE_MS),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.onFiltersChanged());
  }

  protected onClearFilters(): void {
    this.form.reset({
      search: '',
      sort: SortOption.NumberAsc,
      types: [],
      categories: [],
      tiers: [],
    });
  }

  protected onPage(event: PageEvent): void {
    this.store.setPage(event.pageIndex, event.pageSize);
    this.syncQueryParams();
  }

  private onFiltersChanged(): void {
    this.applyFormToStore();
    this.syncQueryParams();
  }

  private applyFormToStore(): void {
    const value = this.form.getRawValue();
    this.store.setSearch(value.search);
    this.store.setSort(value.sort);
    this.store.setSelectedTypes(value.types);
    this.store.setSelectedCategories(value.categories);
    this.store.setSelectedTiers(value.tiers);
  }

  private restoreFromQueryParams(): void {
    const params = this.route.snapshot.queryParamMap;
    const sort = this.parseEnum(params.get('sort'), Object.values(SortOption), SortOption.NumberAsc);

    this.form.setValue(
      {
        search: params.get('q') ?? '',
        sort,
        types: this.parseEnumList(params.get('types'), POKEMON_TYPES),
        categories: this.parseEnumList(params.get('cat'), RARITY_CATEGORIES),
        tiers: this.parseEnumList(params.get('tier'), RARITY_TIERS),
      },
      { emitEvent: false },
    );

    this.applyFormToStore();
    const page = Number.parseInt(params.get('page') ?? '0', 10);
    const size = Number.parseInt(params.get('size') ?? String(this.store.pageSize()), 10);
    this.store.setPage(Number.isNaN(page) ? 0 : page, Number.isNaN(size) ? this.store.pageSize() : size);
  }

  private syncQueryParams(): void {
    const value = this.form.getRawValue();
    const queryParams: Params = {
      q: value.search || null,
      sort: SortOption.NumberAsc === value.sort ? null : value.sort,
      types: value.types.length ? value.types.join(',') : null,
      cat: value.categories.length ? value.categories.join(',') : null,
      tier: value.tiers.length ? value.tiers.join(',') : null,
      page: this.store.pageIndex() || null,
      size: this.store.pageSize() === PAGE_SIZE_OPTIONS[0] ? null : this.store.pageSize(),
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true,
    });
  }

  private parseEnum<T extends string>(raw: string | null, allowed: T[], fallback: T): T {
    return allowed.includes(raw as T) ? (raw as T) : fallback;
  }

  private parseEnumList<T extends string>(raw: string | null, allowed: readonly T[]): T[] {
    if (!raw) {
      return [];
    }
    return raw.split(',').filter((value): value is T => allowed.includes(value as T));
  }
}
