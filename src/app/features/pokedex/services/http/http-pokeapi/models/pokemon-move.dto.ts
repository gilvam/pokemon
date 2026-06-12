import { Dto } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** A learnable move reference (`{ move }`). */
@Dto()
export class PokemonMoveDto {
  constructor(public move = new NamedResourceDto()) {}

  static create(item: Partial<PokemonMoveDto> = new this()): PokemonMoveDto {
    return new this(NamedResourceDto.create(item.move));
  }

  static createArray(items: Partial<PokemonMoveDto>[] = []): PokemonMoveDto[] {
    return items.map((item) => PokemonMoveDto.create(item));
  }
}
