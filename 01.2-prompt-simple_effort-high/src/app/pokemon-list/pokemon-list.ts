import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonApiService } from '../services/pokemon-api.service';
import { PokemonCard } from './pokemon-card/pokemon-card';

const PAGE_SIZE = 40;

@Component({
  selector: 'app-pokemon-list',
  imports: [FormsModule, PokemonCard],
  templateUrl: './pokemon-list.html',
  styleUrl: './pokemon-list.scss'
})
export class PokemonList {
  private readonly api = inject(PokemonApiService);

  protected readonly search = signal('');
  protected readonly visibleCount = signal(PAGE_SIZE);

  private readonly allPokemon = toSignal(this.api.getAllPokemon(), { initialValue: [] });

  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const all = this.allPokemon();
    if (!term) {
      return all;
    }
    return all.filter((pokemon) => pokemon.name.includes(term) || String(pokemon.id) === term);
  });

  protected readonly visible = computed(() => this.filtered().slice(0, this.visibleCount()));

  protected readonly hasMore = computed(() => this.visibleCount() < this.filtered().length);

  protected readonly totalCount = computed(() => this.allPokemon().length);

  protected onSearchChange(): void {
    this.visibleCount.set(PAGE_SIZE);
  }

  protected loadMore(): void {
    this.visibleCount.update((count) => count + PAGE_SIZE);
  }
}
