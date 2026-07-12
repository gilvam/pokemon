import { EvolutionChainDto } from './evolution-chain.dto';
import evolutionMock from '../jsons/get-evolution-chain/200-ok.json';

describe('EvolutionChainDto', () => {
  it('retorna todos os defaults sem argumento', () => {
    const dto = EvolutionChainDto.create();

    expect(dto.id).toBe(0);
    expect(dto.chain.species.name).toBe('');
    expect(dto.chain.evolvesTo).toEqual([]);
  });

  it('mapeia a cadeia recursiva completa', () => {
    const dto = EvolutionChainDto.create(evolutionMock as unknown as Partial<EvolutionChainDto>);

    expect(dto.chain.species.name).toBe('pichu');
    expect(dto.chain.evolvesTo.at(0)?.species.name).toBe('pikachu');
    expect(dto.chain.evolvesTo.at(0)?.evolvesTo.at(0)?.species.name).toBe('raichu');
    expect(dto.chain.evolvesTo.at(0)?.evolvesTo.at(0)?.evolvesTo).toEqual([]);
  });
});
