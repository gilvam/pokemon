import { NoNull } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';
import { GenusDto } from './genus.dto';
import { FlavorTextDto } from './flavor-text.dto';

/** Raw `GET /pokemon-species/{id}` payload (only the fields the UI consumes). */
interface ISpeciesPayload {
  id: number;
  name: string;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  capture_rate: number;
  base_happiness: number;
  growth_rate: Partial<NamedResourceDto>;
  habitat: Partial<NamedResourceDto> | null;
  egg_groups: Parameters<typeof NamedResourceDto.createArray>[0];
  genera: Parameters<typeof GenusDto.createArray>[0];
  flavor_text_entries: Parameters<typeof FlavorTextDto.createArray>[0];
  evolution_chain: Partial<NamedResourceDto>;
}

/** Species data with rarity flags and evolution-chain link (`GET /pokemon-species/{id}`). */
@NoNull()
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
    public eggGroups: NamedResourceDto[] = [],
    public genera: GenusDto[] = [],
    public flavorTextEntries: FlavorTextDto[] = [],
    public evolutionChain = new NamedResourceDto(),
  ) {}

  static create(item: Partial<ISpeciesPayload> = {}): PokemonSpeciesDto {
    return new this(
      item.id ?? 0,
      item.name ?? '',
      item.is_baby ?? false,
      item.is_legendary ?? false,
      item.is_mythical ?? false,
      item.capture_rate ?? 0,
      item.base_happiness ?? 0,
      NamedResourceDto.create(item.growth_rate),
      NamedResourceDto.create(item.habitat ?? undefined),
      NamedResourceDto.createArray(item.egg_groups),
      GenusDto.createArray(item.genera),
      FlavorTextDto.createArray(item.flavor_text_entries),
      NamedResourceDto.create(item.evolution_chain),
    );
  }
}
