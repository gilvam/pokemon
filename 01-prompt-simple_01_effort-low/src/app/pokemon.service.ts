import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PokemonDetail, PokemonListResponse } from './pokemon.model';

const API_BASE = '/api/v2';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private readonly http = inject(HttpClient);

  list(limit = 151, offset = 0): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      `${API_BASE}/pokemon?limit=${limit}&offset=${offset}`,
    );
  }

  getByName(name: string): Observable<PokemonDetail> {
    return this.http.get<PokemonDetail>(
      `${API_BASE}/pokemon/${name.toLowerCase().trim()}`,
    );
  }
}
