import { ChangeDetectionStrategy, Component, computed, debounced, effect, inject, OnInit, signal } from '@angular/core';
import { PokemonIndexStore } from '../../services/pokemon-index.store';
import { PokemonIndexStatus } from '../../models/pokemon-index-status.enum';
import { PokemonCard } from '../../components/pokemon-card/pokemon-card';
import { PokemonSearch } from '../../components/pokemon-search/pokemon-search';
import { Pagination } from '../../components/pagination/pagination';

const PAGE_SIZE = 48;
const DEBOUNCE_MS = 200;

/** Pokédex list: loads the index once, filters/paginates entirely on the client. */
@Component({
  selector: 'app-pokemon-list',
  imports: [PokemonCard, PokemonSearch, Pagination],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonList implements OnInit {
  private readonly store = inject(PokemonIndexStore);

  protected readonly Status = PokemonIndexStatus;
  protected readonly status = this.store.status;

  protected readonly searchTerm = signal('');
  private readonly debouncedTerm = debounced(this.searchTerm, DEBOUNCE_MS);

  protected readonly page = signal(0);

  protected readonly filterText = computed(() =>
    this.debouncedTerm.hasValue() ? this.debouncedTerm.value().trim().toLowerCase() : '',
  );

  protected readonly filtered = computed(() => {
    const term = this.filterText();
    const all = this.store.summaries();
    return term ? all.filter((summary) => summary.name.toLowerCase().includes(term)) : all;
  });

  protected readonly totalPages = computed(() =>
    Math.max(Math.ceil(this.filtered().length / PAGE_SIZE), 1),
  );

  protected readonly pageItems = computed(() => {
    const start = this.page() * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  protected readonly isEmpty = computed(
    () => this.status() === PokemonIndexStatus.READY && this.filtered().length === 0,
  );

  constructor() {
    effect(() => {
      this.filterText();
      this.page.set(0);
    });
  }

  ngOnInit(): void {
    this.store.loadIndex();
  }

  protected onPageChange(page: number): void {
    this.page.set(page);
  }

  protected retry(): void {
    this.store.retry();
  }
}
