import { NoNull } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** Response of `GET /pokemon?limit=&offset=` — the global name index. */
@NoNull()
export class PokemonListResponseDto {
  constructor(
    public count = 0,
    public results: NamedResourceDto[] = [],
  ) {}

  static create(item: Partial<PokemonListResponseDto> = new this()): PokemonListResponseDto {
    return new this(item.count, NamedResourceDto.createArray(item.results));
  }
}
