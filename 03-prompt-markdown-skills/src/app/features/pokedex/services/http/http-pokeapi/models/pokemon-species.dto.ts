import { Dto } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';
import { GenusDto } from './genus.dto';
import { FlavorTextDto } from './flavor-text.dto';
import { EvolutionChainRefDto } from './evolution-chain-ref.dto';

/** Response of `/pokemon-species/{id}` — rarity flags, growth, flavor + evolution link. */
@Dto({ keyCamelCase: true })
export class PokemonSpeciesDto {
  constructor(
    public id = 0,
    public name = '',
    public isBaby = false,
    public isLegendary = false,
    public isMythical = false,
    public captureRate = 0,
    public baseHappiness = 0,
    public growthRate = new NamedResourceDto(),
    public habitat = new NamedResourceDto(),
    public color = new NamedResourceDto(),
    public shape = new NamedResourceDto(),
    public eggGroups: NamedResourceDto[] = [],
    public genera: GenusDto[] = [],
    public flavorTextEntries: FlavorTextDto[] = [],
    public evolutionChain = new EvolutionChainRefDto(),
  ) {}

  static create(item: Partial<PokemonSpeciesDto> = new this()): PokemonSpeciesDto {
    return new this(
      item.id,
      item.name,
      item.isBaby,
      item.isLegendary,
      item.isMythical,
      item.captureRate,
      item.baseHappiness,
      NamedResourceDto.create(item.growthRate),
      NamedResourceDto.create(item.habitat),
      NamedResourceDto.create(item.color),
      NamedResourceDto.create(item.shape),
      NamedResourceDto.createArray(item.eggGroups),
      GenusDto.createArray(item.genera),
      FlavorTextDto.createArray(item.flavorTextEntries),
      EvolutionChainRefDto.create(item.evolutionChain),
    );
  }
}
