import { Dto } from '@decorators/class.decorator';
import { PokemonSpritesOtherDto } from './pokemon-sprites-other.dto';

/** A Pokémon's sprite URLs (default/shiny, front/back) plus the `other` artwork block. */
@Dto()
export class PokemonSpritesDto {
  constructor(
    public frontDefault = '',
    public backDefault = '',
    public frontShiny = '',
    public backShiny = '',
    public other = new PokemonSpritesOtherDto(),
  ) {}

  static create(item: Partial<PokemonSpritesDto> = new this()): PokemonSpritesDto {
    return new this(
      item.frontDefault,
      item.backDefault,
      item.frontShiny,
      item.backShiny,
      PokemonSpritesOtherDto.create(item.other),
    );
  }
}
