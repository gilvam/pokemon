import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpPokeapiService } from './http-pokeapi.service';
import { EvolutionChainDto } from './models/evolution-chain.dto';
import { NamedApiResourceListDto } from './models/named-api-resource-list.dto';
import { PokemonDto } from './models/pokemon.dto';
import { PokemonSpeciesDto } from './models/pokemon-species.dto';
import { TypeResponseDto } from './models/type-response.dto';

import pokemonMock from './mocks/get-pokemon/200-ok.json';
import pokemonListMock from './mocks/get-pokemon-list/200-ok.json';
import typeListMock from './mocks/get-type-list/200-ok.json';
import typeMock from './mocks/get-type/200-ok.json';
import speciesMock from './mocks/get-species/200-ok.json';
import speciesListMock from './mocks/get-species-list/200-ok.json';
import evolutionChainMock from './mocks/get-evolution-chain/200-ok.json';

/** Casts a raw JSON fixture to a DTO-partial for the factory (the API may send `null`s). */
function asPartial<T>(fixture: unknown): Partial<T> {
  return fixture as Partial<T>;
}

/** Drop-in mock of {@link HttpPokeapiService} for demos and component tests. */
@Injectable({ providedIn: 'root' })
export class HttpPokeapiMockService extends HttpPokeapiService {
  override getPokemonList(): Observable<NamedApiResourceListDto> {
    return of(NamedApiResourceListDto.create(asPartial(pokemonListMock)));
  }

  override getTypeList(): Observable<NamedApiResourceListDto> {
    return of(NamedApiResourceListDto.create(asPartial(typeListMock)));
  }

  override getType(_name: string): Observable<TypeResponseDto> {
    return of(TypeResponseDto.create(asPartial(typeMock)));
  }

  override getSpeciesList(): Observable<NamedApiResourceListDto> {
    return of(NamedApiResourceListDto.create(asPartial(speciesListMock)));
  }

  override getPokemon(_idOrName: number | string): Observable<PokemonDto> {
    return of(PokemonDto.create(asPartial(pokemonMock)));
  }

  override getSpecies(_idOrName: number | string): Observable<PokemonSpeciesDto> {
    return of(PokemonSpeciesDto.create(asPartial(speciesMock)));
  }

  override getEvolutionChainByUrl(_url: string): Observable<EvolutionChainDto> {
    return of(EvolutionChainDto.create(asPartial(evolutionChainMock)));
  }
}
