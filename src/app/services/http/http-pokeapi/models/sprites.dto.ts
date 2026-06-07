import { NoNull } from '../../../../_decorators/class.decorator';
import { OtherSpritesDto } from './other-sprites.dto';

@NoNull()
export class SpritesDto {
  constructor(
    public front_default = '',
    public back_default = '',
    public front_shiny = '',
    public back_shiny = '',
    public other = new OtherSpritesDto(),
  ) {}

  static create(item: Partial<SpritesDto> = new this()): SpritesDto {
    return new this(
      item.front_default,
      item.back_default,
      item.front_shiny,
      item.back_shiny,
      OtherSpritesDto.create(item.other),
    );
  }
}
