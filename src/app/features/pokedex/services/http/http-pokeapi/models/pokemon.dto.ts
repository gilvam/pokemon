import { NoNull } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';
import { PokemonTypeSlotDto } from './pokemon-type-slot.dto';
import { PokemonStatDto } from './pokemon-stat.dto';
import { PokemonAbilityDto } from './pokemon-ability.dto';
import { PokemonMoveDto } from './pokemon-move.dto';
import { PokemonSpritesDto } from './pokemon-sprites.dto';
import { PokemonCriesDto } from './pokemon-cries.dto';

/** Raw `GET /pokemon/{id}` payload (only the fields the UI consumes). */
interface IPokemonPayload {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: Parameters<typeof PokemonTypeSlotDto.createArray>[0];
  stats: Parameters<typeof PokemonStatDto.createArray>[0];
  abilities: Parameters<typeof PokemonAbilityDto.createArray>[0];
  moves: Parameters<typeof PokemonMoveDto.createArray>[0];
  sprites: Parameters<typeof PokemonSpritesDto.create>[0];
  cries: Partial<PokemonCriesDto>;
  species: Partial<NamedResourceDto>;
}

/** A full Pokémon (`GET /pokemon/{id}`). */
@NoNull()
export class PokemonDto {
  constructor(
    public id = 0,
    public name = '',
    public height = 0,
    public weight = 0,
    public baseExperience = 0,
    public types: PokemonTypeSlotDto[] = [],
    public stats: PokemonStatDto[] = [],
    public abilities: PokemonAbilityDto[] = [],
    public moves: PokemonMoveDto[] = [],
    public sprites = new PokemonSpritesDto(),
    public cries = new PokemonCriesDto(),
    public species = new NamedResourceDto(),
  ) {}

  static create(item: Partial<IPokemonPayload> = {}): PokemonDto {
    return new this(
      item.id ?? 0,
      item.name ?? '',
      item.height ?? 0,
      item.weight ?? 0,
      item.base_experience ?? 0,
      PokemonTypeSlotDto.createArray(item.types),
      PokemonStatDto.createArray(item.stats),
      PokemonAbilityDto.createArray(item.abilities),
      PokemonMoveDto.createArray(item.moves),
      PokemonSpritesDto.create(item.sprites),
      PokemonCriesDto.create(item.cries),
      NamedResourceDto.create(item.species),
    );
  }
}
