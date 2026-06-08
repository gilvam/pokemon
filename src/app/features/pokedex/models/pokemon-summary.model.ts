import { PokemonType } from './pokemon-type.enum';
import { PokemonRarity } from './pokemon-rarity.model';

/**
 * Lightweight Pokémon entry used by the list/grid. Built client-side from the
 * name index plus the per-type index; `rarity` is filled in lazily once the
 * rarity index has loaded that id.
 */
export class PokemonSummary {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly types: readonly PokemonType[],
    public readonly rarity?: PokemonRarity,
  ) {}
}
