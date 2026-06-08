import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PokemonListResponseDto } from './models/pokemon-list-response.dto';
import { TypeResponseDto } from './models/type-response.dto';
import { PokemonDto } from './models/pokemon.dto';
import { PokemonSpeciesDto } from './models/pokemon-species.dto';
import { EvolutionChainResponseDto } from './models/evolution-chain-response.dto';

/** In-memory stand-in for {@link HttpPokeapiService} used in tests/dev. */
@Injectable({ providedIn: 'root' })
export class HttpPokeapiMockService {
  getPokemonIndex(): Observable<PokemonListResponseDto> {
    return of(
      PokemonListResponseDto.create({
        count: 2,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
        ],
      }),
    );
  }

  getType(name: string): Observable<TypeResponseDto> {
    return of(
      TypeResponseDto.create({
        id: 10,
        name,
        pokemon: [{ slot: 1, pokemon: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' } }],
      }),
    );
  }

  getPokemon(idOrName: string | number): Observable<PokemonDto> {
    return of(
      PokemonDto.create({
        id: 4,
        name: String(idOrName),
        height: 6,
        weight: 85,
        base_experience: 62,
        types: [{ slot: 1, type: { name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' } }],
      }),
    );
  }

  getSpecies(): Observable<PokemonSpeciesDto> {
    return of(
      PokemonSpeciesDto.create({
        id: 4,
        name: 'charmander',
        capture_rate: 45,
        evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/2/' },
      }),
    );
  }

  getEvolutionChain(id: number): Observable<EvolutionChainResponseDto> {
    return of(
      EvolutionChainResponseDto.create({
        id,
        chain: { species: { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon-species/4/' }, evolves_to: [] },
      }),
    );
  }
}
