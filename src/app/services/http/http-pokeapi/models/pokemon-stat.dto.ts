import { NoNull } from '../../../../_decorators/class.decorator';
import { NamedApiResourceDto } from './named-api-resource.dto';

@NoNull()
export class PokemonStatDto {
  constructor(
    public base_stat = 0,
    public effort = 0,
    public stat = new NamedApiResourceDto(),
  ) {}

  static create(item: Partial<PokemonStatDto> = new this()): PokemonStatDto {
    return new this(item.base_stat, item.effort, NamedApiResourceDto.create(item.stat));
  }

  static createArray(items: Partial<PokemonStatDto>[] = []): PokemonStatDto[] {
    return (items ?? []).map((item) => PokemonStatDto.create(item));
  }
}
