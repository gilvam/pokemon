import { NoNull } from '@decorators/class.decorator';
import { TypePokemonDto } from './type-pokemon.dto';

/** Response of `GET /type/{name}` — all Pokémon that have this type. */
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
