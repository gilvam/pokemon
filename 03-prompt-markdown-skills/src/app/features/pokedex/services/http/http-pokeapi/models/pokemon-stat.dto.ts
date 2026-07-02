import { Dto } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** A single base stat entry (`{ base_stat, effort, stat }`). */
@Dto()
export class PokemonStatDto {
  constructor(
    public baseStat = 0,
    public effort = 0,
    public stat = new NamedResourceDto(),
  ) {}

  static create(item: Partial<PokemonStatDto> = new this()): PokemonStatDto {
    return new this(item.baseStat, item.effort, NamedResourceDto.create(item.stat));
  }

  static createArray(items: Partial<PokemonStatDto>[] = []): PokemonStatDto[] {
    return items.map((item) => PokemonStatDto.create(item));
  }
}
