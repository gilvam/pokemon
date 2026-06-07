import { NoNull } from '../../../../_decorators/class.decorator';
import { NamedApiResourceDto } from './named-api-resource.dto';

@NoNull()
export class TypePokemonDto {
  constructor(
    public slot = 0,
    public pokemon = new NamedApiResourceDto(),
  ) {}

  static create(item: Partial<TypePokemonDto> = new this()): TypePokemonDto {
    return new this(item.slot, NamedApiResourceDto.create(item.pokemon));
  }

  static createArray(items: Partial<TypePokemonDto>[] = []): TypePokemonDto[] {
    return (items ?? []).map((item) => TypePokemonDto.create(item));
  }
}
