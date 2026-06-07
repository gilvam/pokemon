import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { EvolutionChainDto } from './models/evolution-chain.dto';
import { NamedApiResourceListDto } from './models/named-api-resource-list.dto';
import { PokemonDto } from './models/pokemon.dto';
import { PokemonSpeciesDto } from './models/pokemon-species.dto';
import { TypeResponseDto } from './models/type-response.dto';

const API_BASE = 'https://pokeapi.co/api/v2';
const FULL_LIST_PARAMS = new HttpParams().set('limit', 100000).set('offset', 0);

/**
 * Typed HttpClient wrapper for the PokeAPI v2 endpoints used by the app. Contains only request
 * assembly and explicit DTO mapping — no domain/UI logic (that lives in the Pokédex store).
 */
@Injectable({ providedIn: 'root' })
export class HttpPokeapiService {
  private readonly http = inject(HttpClient);

  getPokemonList(): Observable<NamedApiResourceListDto> {
    return this.http
      .get<NamedApiResourceListDto>(`${API_BASE}/pokemon`, { params: FULL_LIST_PARAMS })
      .pipe(map((response) => NamedApiResourceListDto.create(response)));
  }

  getTypeList(): Observable<NamedApiResourceListDto> {
    return this.http
      .get<NamedApiResourceListDto>(`${API_BASE}/type`, {
        params: new HttpParams().set('limit', 100),
      })
      .pipe(map((response) => NamedApiResourceListDto.create(response)));
  }

  getType(name: string): Observable<TypeResponseDto> {
    return this.http
      .get<TypeResponseDto>(`${API_BASE}/type/${name}`)
      .pipe(map((response) => TypeResponseDto.create(response)));
  }

  getSpeciesList(): Observable<NamedApiResourceListDto> {
    return this.http
      .get<NamedApiResourceListDto>(`${API_BASE}/pokemon-species`, { params: FULL_LIST_PARAMS })
      .pipe(map((response) => NamedApiResourceListDto.create(response)));
  }

  getPokemon(idOrName: number | string): Observable<PokemonDto> {
    return this.http
      .get<PokemonDto>(`${API_BASE}/pokemon/${idOrName}`)
      .pipe(map((response) => PokemonDto.create(response)));
  }

  getSpecies(idOrName: number | string): Observable<PokemonSpeciesDto> {
    return this.http
      .get<PokemonSpeciesDto>(`${API_BASE}/pokemon-species/${idOrName}`)
      .pipe(map((response) => PokemonSpeciesDto.create(response)));
  }

  getEvolutionChainByUrl(url: string): Observable<EvolutionChainDto> {
    return this.http
      .get<EvolutionChainDto>(url)
      .pipe(map((response) => EvolutionChainDto.create(response)));
  }
}
