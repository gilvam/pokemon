import { NoNull } from '../../../../_decorators/class.decorator';

@NoNull()
export class EvolutionChainRefDto {
  constructor(public url = '') {}

  static create(item: Partial<EvolutionChainRefDto> = new this()): EvolutionChainRefDto {
    return new this(item.url);
  }
}
