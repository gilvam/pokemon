import { NoNull } from '../../../../_decorators/class.decorator';

@NoNull()
export class OfficialArtworkDto {
  constructor(
    public front_default = '',
    public front_shiny = '',
  ) {}

  static create(item: Partial<OfficialArtworkDto> = new this()): OfficialArtworkDto {
    return new this(item.front_default, item.front_shiny);
  }
}
