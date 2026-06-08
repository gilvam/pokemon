import { NoNull } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** One `{ slot, type }` entry of a Pokémon's `types` array. */
@NoNull()
export class PokemonTypeSlotDto {
  constructor(
    public slot = 0,
    public type = new NamedResourceDto(),
  ) {}

  static create(item: Partial<PokemonTypeSlotDto> = new this()): PokemonTypeSlotDto {
    return new this(item.slot, NamedResourceDto.create(item.type));
  }

  static createArray(items: Partial<PokemonTypeSlotDto>[] = []): PokemonTypeSlotDto[] {
    return (items ?? []).map((item) => PokemonTypeSlotDto.create(item));
  }
}
