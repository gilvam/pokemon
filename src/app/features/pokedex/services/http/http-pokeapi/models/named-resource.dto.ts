import { Dto } from '@decorators/class.decorator';

/** PokeAPI's ubiquitous `{ name, url }` reference to another resource. */
@Dto()
export class NamedResourceDto {
  constructor(
    public name = '',
    public url = '',
  ) {}

  static create(item: Partial<NamedResourceDto> = new this()): NamedResourceDto {
    return new this(item.name, item.url);
  }

  static createArray(items: Partial<NamedResourceDto>[] = []): NamedResourceDto[] {
    return items.map((item) => NamedResourceDto.create(item));
  }
}
