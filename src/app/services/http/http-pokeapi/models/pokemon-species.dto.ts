import { NoNull } from '../../../../_decorators/class.decorator';
import { EvolutionChainRefDto } from './evolution-chain-ref.dto';
import { FlavorTextEntryDto } from './flavor-text-entry.dto';
import { GenusDto } from './genus.dto';
import { NamedApiResourceDto } from './named-api-resource.dto';

@NoNull()
export class PokemonSpeciesDto {
  constructor(
    public id = 0,
    public name = '',
    public is_baby = false,
    public is_legendary = false,
    public is_mythical = false,
    public capture_rate = 0,
    public base_happiness = 0,
    public hatch_counter = 0,
    public growth_rate = new NamedApiResourceDto(),
    public habitat = new NamedApiResourceDto(),
    public egg_groups: NamedApiResourceDto[] = [],
    public genera: GenusDto[] = [],
    public flavor_text_entries: FlavorTextEntryDto[] = [],
    public evolution_chain = new EvolutionChainRefDto(),
    public evolves_from_species = new NamedApiResourceDto(),
  ) {}

  static create(item: Partial<PokemonSpeciesDto> = new this()): PokemonSpeciesDto {
    return new this(
      item.id,
      item.name,
      item.is_baby,
      item.is_legendary,
      item.is_mythical,
      item.capture_rate,
      item.base_happiness,
      item.hatch_counter,
      NamedApiResourceDto.create(item.growth_rate),
      NamedApiResourceDto.create(item.habitat),
      NamedApiResourceDto.createArray(item.egg_groups),
      GenusDto.createArray(item.genera),
      FlavorTextEntryDto.createArray(item.flavor_text_entries),
      EvolutionChainRefDto.create(item.evolution_chain),
      NamedApiResourceDto.create(item.evolves_from_species),
    );
  }
}
