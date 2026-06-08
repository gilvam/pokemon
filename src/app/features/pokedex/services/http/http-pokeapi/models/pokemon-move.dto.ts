import { NoNull } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** Raw `{ move }` payload as returned by the PokeAPI. */
interface IPokemonMovePayload {
  move: Partial<NamedResourceDto>;
}

/** One move entry of a Pokémon (`GET /pokemon/{id}` → `moves[]`). */
@NoNull()
export class PokemonMoveDto {
  constructor(public move = new NamedResourceDto()) {}

  static create(item: Partial<IPokemonMovePayload> = {}): PokemonMoveDto {
    return new this(NamedResourceDto.create(item.move));
  }

  static createArray(items: Partial<IPokemonMovePayload>[] = []): PokemonMoveDto[] {
    return (items ?? []).map((item) => PokemonMoveDto.create(item));
  }
}
