import { Dto } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** A localized species genus (e.g. "Seed Pokémon"). */
@Dto()
export class GenusDto {
  constructor(
    public genus = '',
    public language = new NamedResourceDto(),
  ) {}

  static create(item: Partial<GenusDto> = new this()): GenusDto {
    return new this(item.genus, NamedResourceDto.create(item.language));
  }

  static createArray(items: Partial<GenusDto>[] = []): GenusDto[] {
    return items.map((item) => GenusDto.create(item));
  }
}
