import { NoNull } from '../../../../_decorators/class.decorator';
import { ChainLinkDto } from './chain-link.dto';

@NoNull()
export class EvolutionChainDto {
  constructor(
    public id = 0,
    public chain = new ChainLinkDto(),
  ) {}

  static create(item: Partial<EvolutionChainDto> = new this()): EvolutionChainDto {
    return new this(item.id, ChainLinkDto.create(item.chain));
  }
}
