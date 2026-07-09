import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { Pokemon, PokemonListItem, PokemonListResponse } from '../models/pokemon.models';

@Injectable({ providedIn: 'root' })
export class PokemonApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v2';

  private allPokemon$?: Observable<PokemonListItem[]>;

  getAllPokemon(): Observable<PokemonListItem[]> {
    if (!this.allPokemon$) {
      this.allPokemon$ = this.http
        .get<PokemonListResponse>(`${this.baseUrl}/pokemon`, { params: { limit: 100000 } })
        .pipe(
          map((response) =>
            response.results.map((item) => ({
              id: this.extractIdFromUrl(item.url),
              name: item.name
            }))
          ),
          shareReplay(1)
        );
    }
    return this.allPokemon$;
  }

  getPokemonByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${name.toLowerCase().trim()}`);
  }

  private extractIdFromUrl(url: string): number {
    const match = url.match(/\/(\d+)\/?$/);
    return match ? Number(match[1]) : 0;
  }
}
