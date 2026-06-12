import { Dto } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** Response of `/pokemon?limit=...&offset=...` — the master index of names + urls. */
@Dto()
export class PokemonListResponseDto {
  constructor(
    public count = 0,
    public next = '',
    public previous = '',
    public results: NamedResourceDto[] = [],
  ) {}

  static create(item: Partial<PokemonListResponseDto> = new this()): PokemonListResponseDto {
    return new this(
      item.count,
      item.next,
      item.previous,
      NamedResourceDto.createArray(item.results),
    );
  }
}
