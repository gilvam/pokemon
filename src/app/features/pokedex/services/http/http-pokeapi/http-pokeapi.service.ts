import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { POKEAPI_BASE_URL } from './pokeapi-base-url.token';
import { PokemonListResponseDto } from './models/pokemon-list-response.dto';
import { TypeResponseDto } from './models/type-response.dto';
import { PokemonDto } from './models/pokemon.dto';
import { PokemonSpeciesDto } from './models/pokemon-species.dto';
import { EvolutionChainResponseDto } from './models/evolution-chain-response.dto';

/** Full Pokémon name index is fetched in one request with a very high limit. */
const FULL_INDEX_LIMIT = 100000;

@Injectable({ providedIn: 'root' })
export class HttpPokeapiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(POKEAPI_BASE_URL);

  getPokemonIndex(): Observable<PokemonListResponseDto> {
    const params = new HttpParams().set('limit', FULL_INDEX_LIMIT).set('offset', 0);
    return this.http
      .get<PokemonListResponseDto>(`${this.baseUrl}/pokemon`, { params })
      .pipe(map((response) => PokemonListResponseDto.create(response)));
  }

  getType(name: string): Observable<TypeResponseDto> {
    return this.http
      .get<TypeResponseDto>(`${this.baseUrl}/type/${name}`)
      .pipe(map((response) => TypeResponseDto.create(response)));
  }

  getPokemon(idOrName: string | number): Observable<PokemonDto> {
    return this.http
      .get<Parameters<typeof PokemonDto.create>[0]>(`${this.baseUrl}/pokemon/${idOrName}`)
      .pipe(map((response) => PokemonDto.create(response)));
  }

  getSpecies(idOrName: string | number): Observable<PokemonSpeciesDto> {
    return this.http
      .get<Parameters<typeof PokemonSpeciesDto.create>[0]>(`${this.baseUrl}/pokemon-species/${idOrName}`)
      .pipe(map((response) => PokemonSpeciesDto.create(response)));
  }

  getEvolutionChain(id: number): Observable<EvolutionChainResponseDto> {
    return this.http
      .get<Parameters<typeof EvolutionChainResponseDto.create>[0]>(`${this.baseUrl}/evolution-chain/${id}`)
      .pipe(map((response) => EvolutionChainResponseDto.create(response)));
  }
}
