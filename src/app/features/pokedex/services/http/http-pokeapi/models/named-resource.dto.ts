import { NoNull } from '@decorators/class.decorator';

/** A `{ name, url }` reference, the most common shape in the PokeAPI. */
@NoNull()
export class NamedResourceDto {
  constructor(
    public name = '',
    public url = '',
  ) {}

  static create(item: Partial<NamedResourceDto> = new this()): NamedResourceDto {
    return new this(item.name, item.url);
  }

  static createArray(items: Partial<NamedResourceDto>[] = []): NamedResourceDto[] {
    return (items ?? []).map((item) => NamedResourceDto.create(item));
  }
}
