import { NoNull } from '../../../../_decorators/class.decorator';
import { NamedApiResourceDto } from './named-api-resource.dto';

@NoNull()
export class EvolutionDetailDto {
  constructor(
    public min_level = 0,
    public min_happiness = 0,
    public trigger = new NamedApiResourceDto(),
    public item = new NamedApiResourceDto(),
  ) {}

  static create(value: Partial<EvolutionDetailDto> = new this()): EvolutionDetailDto {
    return new this(
      value.min_level,
      value.min_happiness,
      NamedApiResourceDto.create(value.trigger),
      NamedApiResourceDto.create(value.item),
    );
  }

  static createArray(values: Partial<EvolutionDetailDto>[] = []): EvolutionDetailDto[] {
    return (values ?? []).map((value) => EvolutionDetailDto.create(value));
  }
}
