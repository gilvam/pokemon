import { Dto } from '@decorators/class.decorator';
import { NamedResourceDto } from './named-resource.dto';

/** A node in the evolution chain (`{ species, evolves_to }`), recursive through `evolvesTo`. */
@Dto()
export class EvolutionLinkDto {
  constructor(
    public species = new NamedResourceDto(),
    public evolvesTo: EvolutionLinkDto[] = [],
  ) {}

  static create(item: Partial<EvolutionLinkDto> = new this()): EvolutionLinkDto {
    return new this(
      NamedResourceDto.create(item.species),
      EvolutionLinkDto.createArray(item.evolvesTo),
    );
  }

  static createArray(items: Partial<EvolutionLinkDto>[] = []): EvolutionLinkDto[] {
    return items.map((item) => EvolutionLinkDto.create(item));
  }
}
