import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { PokemonListResponseDto } from './models/pokemon-list-response.dto';
import { TypeDto } from './models/type.dto';
import { PokemonDto } from './models/pokemon.dto';
import { PokemonSpeciesDto } from './models/pokemon-species.dto';
import { EvolutionChainDto } from './models/evolution-chain.dto';

/** Typed client for the local PokeAPI v2 mirror used by the Pokédex. */
@Injectable({
  providedIn: 'root',
})
export class HttpPokemonService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.pokeapiBaseUrl;

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
      .get<PokemonDto>(this.buildPokemonUrl(id))
      .pipe(map((response) => PokemonDto.create(response)));
  }

  getSpecies(id: number): Observable<PokemonSpeciesDto> {
    return this.http
      .get<PokemonSpeciesDto>(this.buildSpeciesUrl(id))
      .pipe(map((response) => PokemonSpeciesDto.create(response)));
  }

  getEvolutionChain(id: number): Observable<EvolutionChainDto> {
    return this.http
      .get<EvolutionChainDto>(this.buildEvolutionChainUrl(id))
      .pipe(map((response) => EvolutionChainDto.create(response)));
  }

  /** URL builders reused by `httpResource()` in the detail page (needs a URL, not an Observable). */
  buildPokemonUrl(id: number): string {
    return `${this.baseUrl}/pokemon/${id}`;
  }

  buildSpeciesUrl(id: number): string {
    return `${this.baseUrl}/pokemon-species/${id}`;
  }

  buildEvolutionChainUrl(id: number): string {
    return `${this.baseUrl}/evolution-chain/${id}`;
  }
}
