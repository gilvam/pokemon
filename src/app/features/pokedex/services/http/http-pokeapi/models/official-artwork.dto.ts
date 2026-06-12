import { Dto } from '@decorators/class.decorator';

/** The `other.official-artwork` sprite block (keys already camelCased by the root DTO). */
@Dto()
export class OfficialArtworkDto {
  constructor(
    public frontDefault = '',
    public frontShiny = '',
  ) {}

  static create(item: Partial<OfficialArtworkDto> = new this()): OfficialArtworkDto {
    return new this(item.frontDefault, item.frontShiny);
  }
}
