import { NoNull } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** Raw `{ flavor_text, language, version }` payload as returned by the PokeAPI. */
interface IFlavorTextPayload {
  flavor_text: string;
  language: Partial<NamedResourceDto>;
  version: Partial<NamedResourceDto>;
}

/** A flavor-text entry (`GET /pokemon-species/{id}` → `flavor_text_entries[]`). */
@NoNull()
export class FlavorTextDto {
  constructor(
    public flavorText = '',
    public language = new NamedResourceDto(),
    public version = new NamedResourceDto(),
  ) {}

  static create(item: Partial<IFlavorTextPayload> = {}): FlavorTextDto {
    return new this(
      item.flavor_text ?? '',
      NamedResourceDto.create(item.language),
      NamedResourceDto.create(item.version),
    );
  }

  static createArray(items: Partial<IFlavorTextPayload>[] = []): FlavorTextDto[] {
    return (items ?? []).map((item) => FlavorTextDto.create(item));
  }
}
