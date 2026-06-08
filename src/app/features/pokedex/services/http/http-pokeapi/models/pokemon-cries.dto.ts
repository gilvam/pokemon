import { NoNull } from '@decorators/class.decorator';

/** Cry audio URLs for a Pokémon (`GET /pokemon/{id}` → `cries`). */
@NoNull()
export class PokemonCriesDto {
  constructor(
    public latest = '',
    public legacy = '',
  ) {}

  static create(item: Partial<PokemonCriesDto> = new this()): PokemonCriesDto {
    return new this(item.latest, item.legacy);
  }
}
