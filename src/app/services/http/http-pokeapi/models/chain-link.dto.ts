import { NoNull } from '../../../../_decorators/class.decorator';
import { EvolutionDetailDto } from './evolution-detail.dto';
import { NamedApiResourceDto } from './named-api-resource.dto';

@NoNull()
export class ChainLinkDto {
  constructor(
    public is_baby = false,
    public species = new NamedApiResourceDto(),
    public evolution_details: EvolutionDetailDto[] = [],
    public evolves_to: ChainLinkDto[] = [],
  ) {}

  static create(item: Partial<ChainLinkDto> = new this()): ChainLinkDto {
    return new this(
      item.is_baby,
      NamedApiResourceDto.create(item.species),
      EvolutionDetailDto.createArray(item.evolution_details),
      ChainLinkDto.createArray(item.evolves_to),
    );
  }

  static createArray(items: Partial<ChainLinkDto>[] = []): ChainLinkDto[] {
    return (items ?? []).map((item) => ChainLinkDto.create(item));
  }
}
