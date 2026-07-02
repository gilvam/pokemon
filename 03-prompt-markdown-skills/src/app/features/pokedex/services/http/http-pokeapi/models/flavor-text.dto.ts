import { Dto } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** A localized Pokédex flavor-text entry (`{ flavor_text, language, version }`). */
@Dto()
export class FlavorTextDto {
  constructor(
    public flavorText = '',
    public language = new NamedResourceDto(),
    public version = new NamedResourceDto(),
  ) {}

  static create(item: Partial<FlavorTextDto> = new this()): FlavorTextDto {
    return new this(
      item.flavorText,
      NamedResourceDto.create(item.language),
      NamedResourceDto.create(item.version),
    );
  }

  static createArray(items: Partial<FlavorTextDto>[] = []): FlavorTextDto[] {
    return items.map((item) => FlavorTextDto.create(item));
  }
}
