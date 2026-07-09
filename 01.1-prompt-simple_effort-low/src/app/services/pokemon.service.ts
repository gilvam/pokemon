import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Pokemon, PokemonListResponse } from '../models/pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v2';

  getPokemonList(limit = 20, offset = 0): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon`, {
      params: { limit, offset },
    });
  }

  getPokemon(nameOrId: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${nameOrId}`);
  }
}
