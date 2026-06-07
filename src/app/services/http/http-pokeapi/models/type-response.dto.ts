import { NoNull } from '../../../../_decorators/class.decorator';
import { TypePokemonDto } from './type-pokemon.dto';

@NoNull()
export class TypeResponseDto {
  constructor(
    public id = 0,
    public name = '',
    public pokemon: TypePokemonDto[] = [],
  ) {}

  static create(item: Partial<TypeResponseDto> = new this()): TypeResponseDto {
    return new this(item.id, item.name, TypePokemonDto.createArray(item.pokemon));
  }
}
