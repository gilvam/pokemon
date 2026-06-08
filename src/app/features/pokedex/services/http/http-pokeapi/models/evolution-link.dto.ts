import { NoNull } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** Raw recursive `{ species, evolves_to }` node of an evolution chain. */
interface IEvolutionLinkPayload {
  species: Partial<NamedResourceDto>;
  evolves_to: IEvolutionLinkPayload[];
}

/** One node of an evolution chain, pointing to the next evolution(s). */
@NoNull()
export class EvolutionLinkDto {
  constructor(
    public species = new NamedResourceDto(),
    public evolvesTo: EvolutionLinkDto[] = [],
  ) {}

  static create(item: Partial<IEvolutionLinkPayload> = {}): EvolutionLinkDto {
    return new this(NamedResourceDto.create(item.species), EvolutionLinkDto.createArray(item.evolves_to));
  }

  static createArray(items: Partial<IEvolutionLinkPayload>[] = []): EvolutionLinkDto[] {
    return (items ?? []).map((item) => EvolutionLinkDto.create(item));
  }
}
