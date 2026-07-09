import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonListItem } from '../models/pokemon.models';
import { PokemonApiService } from '../services/pokemon-api.service';
import { matchesQuery, normalizeQuery } from '../utils/pokemon.utils';
import { PokemonCard } from './pokemon-card/pokemon-card';

const PAGE_SIZE = 48;

@Component({
  selector: 'app-pokemon-list',
  imports: [PokemonCard],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonList {
  private readonly api = inject(PokemonApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly sentinel = viewChild<ElementRef<HTMLElement>>('sentinel');

  protected readonly searchTerm = signal(this.route.snapshot.queryParamMap.get('q') ?? '');
  private readonly visibleCount = signal(PAGE_SIZE);

  protected readonly allPokemon = toSignal(this.api.getAllPokemon(), {
    initialValue: [] as PokemonListItem[],
  });
  protected readonly loading = computed(() => this.allPokemon().length === 0);

  protected readonly filtered = computed(() => {
    const query = normalizeQuery(this.searchTerm());
    const all = this.allPokemon();
    return query ? all.filter((item) => matchesQuery(item, query)) : all;
  });

  protected readonly visible = computed(() => this.filtered().slice(0, this.visibleCount()));
  protected readonly hasMore = computed(() => this.visibleCount() < this.filtered().length);
  protected readonly resultCount = computed(() => this.filtered().length);

  constructor() {
    afterNextRender(() => {
      const element = this.sentinel()?.nativeElement;
      if (!element) {
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            this.loadMore();
          }
        },
        { rootMargin: '480px' },
      );
      observer.observe(element);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.visibleCount.set(PAGE_SIZE);
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: value || null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  protected loadMore(): void {
    if (!this.hasMore()) {
      return;
    }
    this.visibleCount.update((count) => count + PAGE_SIZE);
  }
}
