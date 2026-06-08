import { NoNull } from '@decorators/class.decorator';
import { EvolutionLinkDto } from './evolution-link.dto';

/** Raw `GET /evolution-chain/{id}` payload (chain uses snake_case `evolves_to`). */
interface IEvolutionChainPayload {
  id: number;
  chain: Parameters<typeof EvolutionLinkDto.create>[0];
}

/** Response of `GET /evolution-chain/{id}`. */
@NoNull()
export class EvolutionChainResponseDto {
  constructor(
    public id = 0,
    public chain = new EvolutionLinkDto(),
  ) {}

  static create(item: Partial<IEvolutionChainPayload> = {}): EvolutionChainResponseDto {
    return new this(item.id ?? 0, EvolutionLinkDto.create(item.chain));
  }
}
