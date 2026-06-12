import { EvolutionChainDto } from './evolution-chain.dto';
import chainMock from '../jsons/get-evolution-chain/200-ok.json';

describe('EvolutionChainDto', () => {
  it('returns an empty root link with no argument', () => {
    const dto = EvolutionChainDto.create();

    expect(dto.id).toBe(0);
    expect(dto.chain.species.name).toBe('');
    expect(dto.chain.evolvesTo).toEqual([]);
  });

  it('maps the recursive, camelCased chain', () => {
    const dto = EvolutionChainDto.create(chainMock as unknown as Partial<EvolutionChainDto>);

    expect(dto.id).toBe(10);
    expect(dto.chain.species.name).toBe('pichu');
    expect(dto.chain.evolvesTo.at(0)?.species.name).toBe('pikachu');
    expect(dto.chain.evolvesTo.at(0)?.evolvesTo.at(0)?.species.name).toBe('raichu');
  });
});
