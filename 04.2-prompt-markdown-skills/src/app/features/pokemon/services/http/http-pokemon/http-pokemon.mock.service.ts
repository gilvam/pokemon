import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { HttpPokemonService } from './http-pokemon.service';
import { PokemonListResponseDto } from './models/pokemon-list-response.dto';
import { TypeDto } from './models/type.dto';
import { PokemonDto } from './models/pokemon.dto';
import { PokemonSpeciesDto } from './models/pokemon-species.dto';
import { EvolutionChainDto } from './models/evolution-chain.dto';
import getIndexMock from './jsons/get-index/200-ok.json';
import getTypeMock from './jsons/get-type/200-ok.json';
import getPokemonMock from './jsons/get-pokemon/200-ok.json';
import getSpeciesMock from './jsons/get-species/200-ok.json';
import getEvolutionChainMock from './jsons/get-evolution-chain/200-ok.json';

/** Drop-in replacement for {@link HttpPokemonService} that serves the `jsons/` fixtures. */
@Injectable({
  providedIn: 'root',
})
export class HttpPokemonMockService extends HttpPokemonService {
  override getIndex(): Observable<PokemonListResponseDto> {
    return of(getIndexMock as unknown as PokemonListResponseDto).pipe(
      map((response) => PokemonListResponseDto.create(response)),
    );
  }

  override getType(): Observable<TypeDto> {
    return of(getTypeMock as unknown as TypeDto).pipe(map((response) => TypeDto.create(response)));
  }

  override getPokemon(): Observable<PokemonDto> {
    return of(getPokemonMock as unknown as PokemonDto).pipe(
      map((response) => PokemonDto.create(response)),
    );
  }

  override getSpecies(): Observable<PokemonSpeciesDto> {
    return of(getSpeciesMock as unknown as PokemonSpeciesDto).pipe(
      map((response) => PokemonSpeciesDto.create(response)),
    );
  }

  override getEvolutionChain(): Observable<EvolutionChainDto> {
    return of(getEvolutionChainMock as unknown as EvolutionChainDto).pipe(
      map((response) => EvolutionChainDto.create(response)),
    );
  }
}
