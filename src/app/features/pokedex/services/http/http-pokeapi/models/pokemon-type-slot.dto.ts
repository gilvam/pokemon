import { Dto } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** A Pokémon's type at a given slot (`{ slot, type }`). */
@Dto()
export class PokemonTypeSlotDto {
  constructor(
    public slot = 0,
    public type = new NamedResourceDto(),
  ) {}

  static create(item: Partial<PokemonTypeSlotDto> = new this()): PokemonTypeSlotDto {
    return new this(item.slot, NamedResourceDto.create(item.type));
  }

  static createArray(items: Partial<PokemonTypeSlotDto>[] = []): PokemonTypeSlotDto[] {
    return items.map((item) => PokemonTypeSlotDto.create(item));
  }
}
