import { NoNull } from '../../../../_decorators/class.decorator';
import { CriesDto } from './cries.dto';
import { NamedApiResourceDto } from './named-api-resource.dto';
import { PokemonAbilityDto } from './pokemon-ability.dto';
import { PokemonMoveDto } from './pokemon-move.dto';
import { PokemonStatDto } from './pokemon-stat.dto';
import { PokemonTypeDto } from './pokemon-type.dto';
import { SpritesDto } from './sprites.dto';

@NoNull()
export class PokemonDto {
  constructor(
    public id = 0,
    public name = '',
    public height = 0,
    public weight = 0,
    public base_experience = 0,
    public sprites = new SpritesDto(),
    public types: PokemonTypeDto[] = [],
    public stats: PokemonStatDto[] = [],
    public abilities: PokemonAbilityDto[] = [],
    public moves: PokemonMoveDto[] = [],
    public cries = new CriesDto(),
    public species = new NamedApiResourceDto(),
  ) {}

  static create(item: Partial<PokemonDto> = new this()): PokemonDto {
    return new this(
      item.id,
      item.name,
      item.height,
      item.weight,
      item.base_experience,
      SpritesDto.create(item.sprites),
      PokemonTypeDto.createArray(item.types),
      PokemonStatDto.createArray(item.stats),
      PokemonAbilityDto.createArray(item.abilities),
      PokemonMoveDto.createArray(item.moves),
      CriesDto.create(item.cries),
      NamedApiResourceDto.create(item.species),
    );
  }
}
