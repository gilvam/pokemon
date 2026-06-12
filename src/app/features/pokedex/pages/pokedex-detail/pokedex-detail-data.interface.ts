import { PokemonDto } from '../../services/http/http-pokeapi/models/pokemon.dto';
import { PokemonSpeciesDto } from '../../services/http/http-pokeapi/models/pokemon-species.dto';
import { EvolutionChainDto } from '../../services/http/http-pokeapi/models/evolution-chain.dto';

/** Composed payload backing the detail page (the three endpoints it loads). */
export interface IPokedexDetailData {
  pokemon: PokemonDto;
  species: PokemonSpeciesDto;
  evolution: EvolutionChainDto;
}
