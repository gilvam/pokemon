import { NoNull } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** Raw `{ base_stat, effort, stat }` payload as returned by the PokeAPI. */
interface IPokemonStatPayload {
  base_stat: number;
  effort: number;
  stat: Partial<NamedResourceDto>;
}

/** One base-stat entry of a Pokémon (`GET /pokemon/{id}` → `stats[]`). */
@NoNull()
export class PokemonStatDto {
  constructor(
    public baseStat = 0,
    public effort = 0,
    public stat = new NamedResourceDto(),
  ) {}

  static create(item: Partial<IPokemonStatPayload> = {}): PokemonStatDto {
    return new this(item.base_stat ?? 0, item.effort ?? 0, NamedResourceDto.create(item.stat));
  }

  static createArray(items: Partial<IPokemonStatPayload>[] = []): PokemonStatDto[] {
    return (items ?? []).map((item) => PokemonStatDto.create(item));
  }
}
