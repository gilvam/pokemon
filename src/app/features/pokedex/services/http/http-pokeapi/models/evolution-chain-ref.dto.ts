import { Dto } from '@decorators/class.decorator';

/** A reference to the species' evolution chain (`{ url }`). */
@Dto()
export class EvolutionChainRefDto {
  constructor(public url = '') {}

  static create(item: Partial<EvolutionChainRefDto> = new this()): EvolutionChainRefDto {
    return new this(item.url);
  }
}
