import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NonNullableFormBuilder } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime } from 'rxjs';
import { PokedexStore } from '../../services/pokedex-store.service';
import { LoadStatus } from '../../models/load-status.enum';
import { SortOption } from '../../models/sort-option.enum';
import { PokemonType } from '../../models/pokemon-type.enum';
import { RarityCategory } from '../../models/rarity-category.enum';
import { RarityTier } from '../../models/rarity-tier.enum';
import { Rarity } from '../../models/rarity.model';
import { TypePalette } from '../../models/type-palette.model';
import { PokemonCard } from '../../components/pokemon-card/pokemon-card';
import { PokemonFilters } from '../../components/pokemon-filters/pokemon-filters';
import { PokemonFilterForm } from '../../components/pokemon-filters/pokemon-filter-form.type';

/** Smart Pokédex list: filters, grid of cards, pagination and URL-synced state. */
@Component({
  selector: 'app-pokedex-list',
  imports: [
    PokemonFilters,
    PokemonCard,
    MatProgressBarModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './pokedex-list.html',
  styleUrl: './pokedex-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokedexList implements OnInit {
  private readonly store = inject(PokedexStore);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  private readonly sortValues: SortOption[] = Object.values(SortOption);
  private readonly typeValues: PokemonType[] = TypePalette.all();
  private readonly categoryValues: RarityCategory[] = Object.values(RarityCategory);
  private readonly tierValues: RarityTier[] = Object.values(RarityTier);

  protected readonly form: PokemonFilterForm = this.fb.group({
    search: this.fb.control(''),
    sort: this.fb.control<SortOption>(SortOption.NUMBER_ASC),
    types: this.fb.control<PokemonType[]>([]),
    categories: this.fb.control<RarityCategory[]>([]),
    tiers: this.fb.control<RarityTier[]>([]),
  });

  protected readonly pageSizeOptions = [12, 24, 48, 96];

  protected readonly total = this.store.total;
  protected readonly pageItems = this.store.pageItems;
  protected readonly pageSize = this.store.pageSize;
  protected readonly pageIndex = this.store.pageIndex;
  protected readonly rarityLoading = this.store.rarityLoading;
  protected readonly rarityProgress = this.store.rarityProgress;

  protected readonly isLoading = computed(() => this.store.status() === LoadStatus.LOADING);
  protected readonly isError = computed(() => this.store.status() === LoadStatus.ERROR);
  protected readonly isReady = computed(() => this.store.status() === LoadStatus.READY);
  protected readonly isEmpty = computed(() => this.isReady() && this.store.total() === 0);

  constructor() {
    this.form.valueChanges
      .pipe(debounceTime(200), takeUntilDestroyed())
      .subscribe(() => this.applyForm());

    effect(() => {
      const rarityActive =
        this.store.rarityCategories().length > 0 || this.store.rarityTiers().length > 0;
      if (this.store.status() === LoadStatus.READY && rarityActive && !this.store.rarityLoading()) {
        this.store.loadRarity();
      }
    });

    effect(() => {
      if (this.store.status() === LoadStatus.ERROR) {
        this.snackBar.open('Não foi possível carregar a Pokédex.', 'Fechar', { duration: 6000 });
      }
    });
  }

  ngOnInit(): void {
    this.restoreFromQueryParams();
    this.store.loadIndex();
  }

  protected rarityOf(id: number): Rarity | undefined {
    return this.store.rarityOf(id);
  }

  protected onPage(event: PageEvent): void {
    this.store.pageIndex.set(event.pageIndex);
    this.store.pageSize.set(event.pageSize);
    this.syncQueryParams();
  }

  protected onClear(): void {
    this.form.reset({
      search: '',
      sort: SortOption.NUMBER_ASC,
      types: [],
      categories: [],
      tiers: [],
    });
  }

  protected onRetry(): void {
    this.store.retryIndex();
  }

  private applyForm(): void {
    const value = this.form.getRawValue();
    this.store.search.set(value.search);
    this.store.sort.set(value.sort);
    this.store.selectedTypes.set(value.types);
    this.store.rarityCategories.set(value.categories);
    this.store.rarityTiers.set(value.tiers);
    this.store.pageIndex.set(0);
    if (value.categories.length > 0 || value.tiers.length > 0) {
      this.store.loadRarity();
    }
    this.syncQueryParams();
  }

  private restoreFromQueryParams(): void {
    const params = this.route.snapshot.queryParamMap;
    const search = params.get('q') ?? '';
    const sort = this.parseSort(params.get('sort'));
    const types = this.parseEnumList(params.get('types'), this.typeValues);
    const categories = this.parseEnumList(params.get('cat'), this.categoryValues);
    const tiers = this.parseEnumList(params.get('tier'), this.tierValues);
    const page = Number(params.get('page')) || 0;
    const size = Number(params.get('size')) || this.store.pageSize();

    this.form.setValue({ search, sort, types, categories, tiers }, { emitEvent: false });
    this.store.search.set(search);
    this.store.sort.set(sort);
    this.store.selectedTypes.set(types);
    this.store.rarityCategories.set(categories);
    this.store.rarityTiers.set(tiers);
    this.store.pageIndex.set(page);
    this.store.pageSize.set(size);
  }

  private syncQueryParams(): void {
    const queryParams = {
      q: this.store.search() || null,
      sort: this.store.sort(),
      types: this.listParam(this.store.selectedTypes()),
      cat: this.listParam(this.store.rarityCategories()),
      tier: this.listParam(this.store.rarityTiers()),
      page: this.store.pageIndex() || null,
      size: this.store.pageSize(),
    };
    void this.router.navigate([], { relativeTo: this.route, queryParams, replaceUrl: true });
  }

  private listParam(values: string[]): string | null {
    return values.length > 0 ? values.join(',') : null;
  }

  private parseSort(value: string | null): SortOption {
    return this.sortValues.find((option) => option === value) ?? SortOption.NUMBER_ASC;
  }

  private parseEnumList<T extends string>(value: string | null, allowed: T[]): T[] {
    if (!value) {
      return [];
    }
    const allowedValues: string[] = allowed;
    return value.split(',').filter((item): item is T => allowedValues.includes(item));
  }
}
