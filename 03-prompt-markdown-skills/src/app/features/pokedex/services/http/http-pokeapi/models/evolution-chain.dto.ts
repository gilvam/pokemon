import { Dto } from '@decorators/class.decorator';
import { EvolutionLinkDto } from './evolution-link.dto';

/** Response of `/evolution-chain/{id}` — the recursive species tree. */
@Dto({ keyCamelCase: true })
export class EvolutionChainDto {
  constructor(
    public id = 0,
    public chain = new EvolutionLinkDto(),
  ) {}

  static create(item: Partial<EvolutionChainDto> = new this()): EvolutionChainDto {
    return new this(item.id, EvolutionLinkDto.create(item.chain));
  }
}
