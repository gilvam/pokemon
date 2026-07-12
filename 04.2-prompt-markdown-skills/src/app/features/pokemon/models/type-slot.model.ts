import { PokemonType } from './pokemon-type.enum';

export class TypeSlot {
  constructor(
    public slot = 0,
    public type = PokemonType.NORMAL,
  ) {}
}
