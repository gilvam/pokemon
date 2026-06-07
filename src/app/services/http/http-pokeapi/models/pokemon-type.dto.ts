import { NoNull } from '../../../../_decorators/class.decorator';
import { NamedApiResourceDto } from './named-api-resource.dto';

@NoNull()
export class PokemonTypeDto {
  constructor(
    public slot = 0,
    public type = new NamedApiResourceDto(),
  ) {}

  static create(item: Partial<PokemonTypeDto> = new this()): PokemonTypeDto {
    return new this(item.slot, NamedApiResourceDto.create(item.type));
  }

  static createArray(items: Partial<PokemonTypeDto>[] = []): PokemonTypeDto[] {
    return (items ?? []).map((item) => PokemonTypeDto.create(item));
  }
}
