import { NoNull } from '../../../../_decorators/class.decorator';
import { NamedApiResourceDto } from './named-api-resource.dto';

@NoNull()
export class FlavorTextEntryDto {
  constructor(
    public flavor_text = '',
    public language = new NamedApiResourceDto(),
    public version = new NamedApiResourceDto(),
  ) {}

  static create(item: Partial<FlavorTextEntryDto> = new this()): FlavorTextEntryDto {
    return new this(
      item.flavor_text,
      NamedApiResourceDto.create(item.language),
      NamedApiResourceDto.create(item.version),
    );
  }

  static createArray(items: Partial<FlavorTextEntryDto>[] = []): FlavorTextEntryDto[] {
    return (items ?? []).map((item) => FlavorTextEntryDto.create(item));
  }
}
