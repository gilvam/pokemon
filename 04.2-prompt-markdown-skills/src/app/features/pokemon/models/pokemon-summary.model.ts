import { PokemonType } from './pokemon-type.enum';

/** Lightweight Pokémon entry shown in the list (id, name and its types). */
export class PokemonSummary {
  constructor(
    public id = 0,
    public name = '',
    public types: PokemonType[] = [],
  ) {}
}
