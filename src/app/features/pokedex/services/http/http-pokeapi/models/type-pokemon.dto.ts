import { NoNull } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** One entry of a type's `pokemon` list (`GET /type/{name}`). */
@NoNull()
export class TypePokemonDto {
  constructor(
    public slot = 0,
    public pokemon = new NamedResourceDto(),
  ) {}

  static create(item: Partial<TypePokemonDto> = new this()): TypePokemonDto {
    return new this(item.slot, NamedResourceDto.create(item.pokemon));
  }

  static createArray(items: Partial<TypePokemonDto>[] = []): TypePokemonDto[] {
    return (items ?? []).map((item) => TypePokemonDto.create(item));
  }
}
