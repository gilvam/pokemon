import { NoNull } from '../../../../_decorators/class.decorator';
import { OfficialArtworkDto } from './official-artwork.dto';

@NoNull()
export class OtherSpritesDto {
  constructor(
    public official_artwork = new OfficialArtworkDto(),
    public home = new OfficialArtworkDto(),
  ) {}

  static create(item: Partial<OtherSpritesDto> = new this()): OtherSpritesDto {
    // The API exposes the hyphenated key `official-artwork`, which is not a valid identifier.
    const raw = (item ?? {}) as Record<string, Partial<OfficialArtworkDto>>;
    return new this(
      OfficialArtworkDto.create(raw['official-artwork'] ?? item.official_artwork),
      OfficialArtworkDto.create(item.home),
    );
  }
}
