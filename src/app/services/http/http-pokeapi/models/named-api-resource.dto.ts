import { NoNull } from '../../../../_decorators/class.decorator';

@NoNull()
export class NamedApiResourceDto {
  constructor(
    public name = '',
    public url = '',
  ) {}

  static create(item: Partial<NamedApiResourceDto> = new this()): NamedApiResourceDto {
    return new this(item.name, item.url);
  }

  static createArray(items: Partial<NamedApiResourceDto>[] = []): NamedApiResourceDto[] {
    return (items ?? []).map((item) => NamedApiResourceDto.create(item));
  }
}
