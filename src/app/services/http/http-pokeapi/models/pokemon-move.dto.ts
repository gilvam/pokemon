import { NoNull } from '../../../../_decorators/class.decorator';
import { NamedApiResourceDto } from './named-api-resource.dto';

@NoNull()
export class PokemonMoveDto {
  constructor(public move = new NamedApiResourceDto()) {}

  static create(item: Partial<PokemonMoveDto> = new this()): PokemonMoveDto {
    return new this(NamedApiResourceDto.create(item.move));
  }

  static createArray(items: Partial<PokemonMoveDto>[] = []): PokemonMoveDto[] {
    return (items ?? []).map((item) => PokemonMoveDto.create(item));
  }
}
