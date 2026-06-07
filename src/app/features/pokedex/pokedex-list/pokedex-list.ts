import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';

import { PokedexStore } from '../../../core/pokedex/pokedex-store.service';
import {
  CaptureTier,
  CAPTURE_TIER_LABELS,
  CAPTURE_TIER_ORDER,
  RarityCategory,
  RARITY_CATEGORY_LABELS,
  RARITY_CATEGORY_ORDER,
} from '../../../core/pokedex/rarity';
import { getTypeLabel } from '../../../shared/type-color';
import { createPtBrPaginatorIntl } from '../../../shared/pt-paginator-intl';
import { PokemonCard } from '../pokemon-card/pokemon-card';
import {
  applyFilters,
  DEFAULT_CRITERIA,
  FilterCriteria,
  needsRarityIndex,
  SortOption,
} from '../pokedex-filter';

interface FilterForm {
  search: FormControl<string>;
  sort: FormControl<SortOption>;
  types: FormControl<string[]>;
  categories: FormControl<RarityCategory[]>;
  tiers: FormControl<CaptureTier[]>;
}

const PAGE_SIZE_DEFAULT = 24;

@Component({
  selector: 'app-pokedex-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatPaginatorModule,
    PokemonCard,
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: createPtBrPaginatorIntl }],
  templateUrl: './pokedex-list.html',
  styleUrl: './pokedex-list.scss',
})
export class PokedexList {
  private readonly store = inject(PokedexStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly status = this.store.status;
  protected readonly rarityMap = this.store.rarityMap;
  protected readonly rarityStatus = this.store.rarityStatus;
  protected readonly rarityProgress = this.store.rarityProgress;

  protected readonly sortOptions: readonly { value: SortOption; label: string }[] = [
    { value: 'number-asc', label: 'Número (crescente)' },
    { value: 'number-desc', label: 'Número (decrescente)' },
    { value: 'name-asc', label: 'Nome (A–Z)' },
    { value: 'name-desc', label: 'Nome (Z–A)' },
  ];
  protected readonly categoryOptions = RARITY_CATEGORY_ORDER.map((value) => ({
    value,
    label: RARITY_CATEGORY_LABELS[value],
  }));
  protected readonly tierOptions = CAPTURE_TIER_ORDER.map((value) => ({
    value,
    label: CAPTURE_TIER_LABELS[value],
  }));

  protected readonly typeOptions = computed(() =>
    [...this.store.typeNames()]
      .map((value) => ({ value, label: getTypeLabel(value) }))
      .sort((a, b) => a.label.localeCompare(b.label)),
  );

  protected readonly form = new FormGroup<FilterForm>({
    search: new FormControl('', { nonNullable: true }),
    sort: new FormControl<SortOption>('number-asc', { nonNullable: true }),
    types: new FormControl<string[]>([], { nonNullable: true }),
    categories: new FormControl<RarityCategory[]>([], { nonNullable: true }),
    tiers: new FormControl<CaptureTier[]>([], { nonNullable: true }),
  });

  // Recomputes when the (debounced) form changes; reads the full raw value.
  private readonly formTick = toSignal(this.form.valueChanges.pipe(debounceTime(200)), {
    initialValue: null,
  });

  protected readonly criteria = computed<FilterCriteria>(() => {
    this.formTick();
    return { ...this.form.getRawValue() };
  });

  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(PAGE_SIZE_DEFAULT);
  protected readonly pageSizeOptions = [12, 24, 48, 96];

  protected readonly filtered = computed(() =>
    applyFilters(this.store.list(), this.criteria(), this.store.rarityMap()),
  );
  protected readonly total = computed(() => this.filtered().length);

  protected readonly pagedItems = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  protected readonly hasActiveFilters = computed(() => {
    const c = this.criteria();
    return (
      c.search !== '' ||
      c.types.length > 0 ||
      c.categories.length > 0 ||
      c.tiers.length > 0 ||
      c.sort !== DEFAULT_CRITERIA.sort
    );
  });

  constructor() {
    this.restoreFromQueryParams();
    this.store.loadIndex();

    // Reset to the first page whenever the filter criteria change.
    let previousKey = JSON.stringify(this.criteria());
    effect(() => {
      const key = JSON.stringify(this.criteria());
      if (key !== previousKey) {
        previousKey = key;
        this.pageIndex.set(0);
      }
    });

    // Lazily build the rarity index only when a rarity filter is in use.
    effect(() => {
      if (needsRarityIndex(this.criteria())) {
        this.store.ensureRarityIndex();
      }
    });

    // Keep the URL in sync for deep-linking / restoring on back navigation.
    effect(() => {
      const c = this.criteria();
      const page = this.pageIndex();
      const size = this.pageSize();
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.toQueryParams(c, page, size),
        replaceUrl: true,
      });
    });

    // Surface load failures (re-using the store's retry).
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe();
  }

  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected clearFilters(): void {
    this.form.reset({
      search: '',
      sort: 'number-asc',
      types: [],
      categories: [],
      tiers: [],
    });
  }

  protected retry(): void {
    this.store.retry();
  }

  private toQueryParams(
    c: FilterCriteria,
    page: number,
    size: number,
  ): Record<string, string | null> {
    return {
      q: c.search || null,
      sort: c.sort === DEFAULT_CRITERIA.sort ? null : c.sort,
      types: c.types.length ? c.types.join(',') : null,
      cat: c.categories.length ? c.categories.join(',') : null,
      tier: c.tiers.length ? c.tiers.join(',') : null,
      page: page > 0 ? String(page) : null,
      size: size === PAGE_SIZE_DEFAULT ? null : String(size),
    };
  }

  private restoreFromQueryParams(): void {
    const params = this.route.snapshot.queryParamMap;
    const split = (key: string) =>
      params.get(key)?.split(',').filter(Boolean) ?? [];

    this.form.setValue({
      search: params.get('q') ?? '',
      sort: (params.get('sort') as SortOption) ?? 'number-asc',
      types: split('types'),
      categories: split('cat') as RarityCategory[],
      tiers: split('tier') as CaptureTier[],
    });
    this.pageIndex.set(Number(params.get('page')) || 0);
    this.pageSize.set(Number(params.get('size')) || PAGE_SIZE_DEFAULT);
  }
}
