import { Dto } from '@decorators/class.decorator';
import { GenusDto } from './genus.dto';
import { FlavorTextDto } from './flavor-text.dto';
import { EvolutionChainRefDto } from './evolution-chain-ref.dto';

/** Response of `/pokemon-species/{id}` — genus, flavor text and the evolution link. */
@Dto({ keyCamelCase: true })
export class PokemonSpeciesDto {
  constructor(
    public id = 0,
    public name = '',
    public genera: GenusDto[] = [],
    public flavorTextEntries: FlavorTextDto[] = [],
    public evolutionChain = new EvolutionChainRefDto(),
  ) {}

  static create(item: Partial<PokemonSpeciesDto> = new this()): PokemonSpeciesDto {
    return new this(
      item.id,
      item.name,
      GenusDto.createArray(item.genera),
      FlavorTextDto.createArray(item.flavorTextEntries),
      EvolutionChainRefDto.create(item.evolutionChain),
    );
  }
}
