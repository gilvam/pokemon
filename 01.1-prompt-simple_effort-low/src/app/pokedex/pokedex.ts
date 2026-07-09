import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../pokemon.service';
import { GeolocationService } from '../geolocation.service';
import { PokemonDetail, PokemonListItem } from '../pokemon.model';

@Component({
  selector: 'app-pokedex',
  imports: [FormsModule],
  templateUrl: './pokedex.html',
  styleUrl: './pokedex.scss',
})
export class Pokedex implements OnInit {
  private readonly pokemonService = inject(PokemonService);
  private readonly geolocationService = inject(GeolocationService);

  readonly allPokemon = signal<PokemonListItem[]>([]);
  readonly searchTerm = signal('');
  readonly selectedPokemon = signal<PokemonDetail | null>(null);
  readonly loadingList = signal(false);
  readonly loadingDetail = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly city = signal<string | null>(null);

  readonly filteredPokemon = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.allPokemon().slice(0, 30);
    }
    return this.allPokemon()
      .filter((p) => p.name.includes(term))
      .slice(0, 30);
  });

  ngOnInit(): void {
    this.loadingList.set(true);
    this.pokemonService.list(1350, 0).subscribe({
      next: (response) => {
        this.allPokemon.set(response.results);
        this.loadingList.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar a lista de Pokémon.');
        this.loadingList.set(false);
      },
    });

    this.geolocationService.getCity().then((city) => {
      if (city) {
        this.city.set(city);
      }
    });
  }

  selectPokemon(name: string): void {
    this.errorMessage.set(null);
    this.loadingDetail.set(true);
    this.selectedPokemon.set(null);
    this.pokemonService.getByName(name).subscribe({
      next: (detail) => {
        this.selectedPokemon.set(detail);
        this.loadingDetail.set(false);
      },
      error: () => {
        this.errorMessage.set(`Pokémon "${name}" não encontrado.`);
        this.loadingDetail.set(false);
      },
    });
  }

  onSearchSubmit(): void {
    const term = this.searchTerm().toLowerCase().trim();
    if (term) {
      this.selectPokemon(term);
    }
  }

  artworkUrl(detail: PokemonDetail): string | null {
    return (
      detail.sprites.other?.['official-artwork']?.front_default ??
      detail.sprites.front_default
    );
  }
}
