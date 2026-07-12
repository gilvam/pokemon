import { Dto } from '@decorators/class.decorator';
import { OfficialArtworkDto } from './official-artwork.dto';

/** The `sprites.other` block; we keep the official-artwork variant. */
@Dto()
export class PokemonSpritesOtherDto {
  constructor(public officialArtwork = new OfficialArtworkDto()) {}

  static create(item: Partial<PokemonSpritesOtherDto> = new this()): PokemonSpritesOtherDto {
    return new this(OfficialArtworkDto.create(item.officialArtwork));
  }
}
