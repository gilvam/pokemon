import { Dto } from '@decorators/class.decorator';
import { TypePokemonDto } from './type-pokemon.dto';

/** Response of `/type/{name}` — every Pokémon that has this type. */
@Dto()
export class TypeDto {
  constructor(
    public id = 0,
    public name = '',
    public pokemon: TypePokemonDto[] = [],
  ) {}

  static create(item: Partial<TypeDto> = new this()): TypeDto {
    return new this(item.id, item.name, TypePokemonDto.createArray(item.pokemon));
  }
}
