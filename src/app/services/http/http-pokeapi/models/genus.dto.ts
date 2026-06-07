import { NoNull } from '../../../../_decorators/class.decorator';
import { NamedApiResourceDto } from './named-api-resource.dto';

@NoNull()
export class GenusDto {
  constructor(
    public genus = '',
    public language = new NamedApiResourceDto(),
  ) {}

  static create(item: Partial<GenusDto> = new this()): GenusDto {
    return new this(item.genus, NamedApiResourceDto.create(item.language));
  }

  static createArray(items: Partial<GenusDto>[] = []): GenusDto[] {
    return (items ?? []).map((item) => GenusDto.create(item));
  }
}
