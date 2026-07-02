import { Dto } from '@decorators/class.decorator';

/** Pokémon cry audio URLs. */
@Dto()
export class PokemonCriesDto {
  constructor(
    public latest = '',
    public legacy = '',
  ) {}

  static create(item: Partial<PokemonCriesDto> = new this()): PokemonCriesDto {
    return new this(item.latest, item.legacy);
  }
}
