import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Pokemon, PokemonListItem } from './models/pokemon.model';
import { PokemonService } from './services/pokemon.service';

const PAGE_SIZE = 20;

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly pokemonService = inject(PokemonService);

  protected readonly searchTerm = signal('');
  protected readonly pokemonList = signal<PokemonListItem[]>([]);
  protected readonly totalCount = signal(0);
  protected readonly offset = signal(0);
  protected readonly loadingList = signal(false);
  protected readonly listError = signal<string | null>(null);

  protected readonly selectedPokemon = signal<Pokemon | null>(null);
  protected readonly loadingDetail = signal(false);
  protected readonly detailError = signal<string | null>(null);

  constructor() {
    this.loadList();
  }

  protected loadList(): void {
    this.loadingList.set(true);
    this.listError.set(null);
    this.pokemonService.getPokemonList(PAGE_SIZE, this.offset()).subscribe({
      next: (response) => {
        this.pokemonList.set(response.results);
        this.totalCount.set(response.count);
        this.loadingList.set(false);
      },
      error: () => {
        this.listError.set('Não foi possível carregar a lista de Pokémon.');
        this.loadingList.set(false);
      },
    });
  }

  protected nextPage(): void {
    if (this.offset() + PAGE_SIZE >= this.totalCount()) return;
    this.offset.update((value) => value + PAGE_SIZE);
    this.loadList();
  }

  protected previousPage(): void {
    if (this.offset() === 0) return;
    this.offset.update((value) => Math.max(0, value - PAGE_SIZE));
    this.loadList();
  }

  protected search(): void {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return;
    this.selectPokemon(term);
  }

  protected selectPokemon(nameOrId: string | number): void {
    this.loadingDetail.set(true);
    this.detailError.set(null);
    this.selectedPokemon.set(null);
    this.pokemonService.getPokemon(nameOrId).subscribe({
      next: (pokemon) => {
        this.selectedPokemon.set(pokemon);
        this.loadingDetail.set(false);
      },
      error: () => {
        this.detailError.set(`Pokémon "${nameOrId}" não encontrado.`);
        this.loadingDetail.set(false);
      },
    });
  }

  protected closeDetail(): void {
    this.selectedPokemon.set(null);
    this.detailError.set(null);
  }

  protected spriteUrl(pokemon: Pokemon): string | null {
    return (
      pokemon.sprites.other?.['official-artwork']?.front_default ??
      pokemon.sprites.front_default
    );
  }
}
