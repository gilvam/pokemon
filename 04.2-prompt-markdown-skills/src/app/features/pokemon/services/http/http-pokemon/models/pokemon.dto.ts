import { Dto } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';
import { PokemonSpritesDto } from './pokemon-sprites.dto';
import { PokemonStatDto } from './pokemon-stat.dto';
import { PokemonTypeSlotDto } from './pokemon-type-slot.dto';
import { PokemonAbilityDto } from './pokemon-ability.dto';
import { PokemonCriesDto } from './pokemon-cries.dto';

/** Response of `/pokemon/{id}` — root DTO, camelCases the snake_case API tree. */
@Dto({ keyCamelCase: true })
export class PokemonDto {
  constructor(
    public id = 0,
    public name = '',
    public height = 0,
    public weight = 0,
    public sprites = new PokemonSpritesDto(),
    public stats: PokemonStatDto[] = [],
    public types: PokemonTypeSlotDto[] = [],
    public abilities: PokemonAbilityDto[] = [],
    public cries = new PokemonCriesDto(),
    public species = new NamedResourceDto(),
  ) {}

  static create(item: Partial<PokemonDto> = new this()): PokemonDto {
    return new this(
      item.id,
      item.name,
      item.height,
      item.weight,
      PokemonSpritesDto.create(item.sprites),
      PokemonStatDto.createArray(item.stats),
      PokemonTypeSlotDto.createArray(item.types),
      PokemonAbilityDto.createArray(item.abilities),
      PokemonCriesDto.create(item.cries),
      NamedResourceDto.create(item.species),
    );
  }
}
