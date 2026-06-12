import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PokemonListResponseDto } from './models/pokemon-list-response.dto';
import { TypeDto } from './models/type.dto';
import { PokemonDto } from './models/pokemon.dto';
import { PokemonSpeciesDto } from './models/pokemon-species.dto';
import { EvolutionChainDto } from './models/evolution-chain.dto';

/** Typed client for the public PokeAPI v2 endpoints used by the Pokédex. */
@Injectable({
  providedIn: 'root',
})
export class HttpPokeapiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  /** Master index of every Pokémon (name + url); id is derived from the url. */
  getIndex(limit = 100000, offset = 0): Observable<PokemonListResponseDto> {
    const params = new HttpParams().set('limit', limit).set('offset', offset);
    return this.http
      .get<PokemonListResponseDto>(`${this.baseUrl}/pokemon`, { params })
      .pipe(map((response) => PokemonListResponseDto.create(response)));
  }

  /** Every Pokémon belonging to a given type — builds the id → types[] index. */
  getType(name: string): Observable<TypeDto> {
    return this.http
      .get<TypeDto>(`${this.baseUrl}/type/${name}`)
      .pipe(map((response) => TypeDto.create(response)));
  }

  getPokemon(id: number): Observable<PokemonDto> {
    return this.http
      .get<PokemonDto>(`${this.baseUrl}/pokemon/${id}`)
      .pipe(map((response) => PokemonDto.create(response)));
  }

  getSpecies(id: number): Observable<PokemonSpeciesDto> {
    return this.http
      .get<PokemonSpeciesDto>(`${this.baseUrl}/pokemon-species/${id}`)
      .pipe(map((response) => PokemonSpeciesDto.create(response)));
  }

  getEvolutionChain(id: number): Observable<EvolutionChainDto> {
    return this.http
      .get<EvolutionChainDto>(`${this.baseUrl}/evolution-chain/${id}`)
      .pipe(map((response) => EvolutionChainDto.create(response)));
  }
}
