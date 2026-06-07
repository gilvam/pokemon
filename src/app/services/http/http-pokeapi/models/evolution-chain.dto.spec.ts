import { EvolutionChainDto } from './evolution-chain.dto';
import { ChainLinkDto } from './chain-link.dto';
import evolutionChainMock from '../mocks/get-evolution-chain/200-ok.json';

describe('EvolutionChainDto', () => {
  it('defaults to an empty chain link', () => {
    const dto = EvolutionChainDto.create();
    expect(dto.id).toBe(0);
    expect(dto.chain).toBeInstanceOf(ChainLinkDto);
    expect(dto.chain.evolves_to).toEqual([]);
  });

  it('maps the recursive evolution structure', () => {
    const dto = EvolutionChainDto.create(evolutionChainMock as unknown as Partial<EvolutionChainDto>);
    expect(dto.chain.species.name).toBe('pichu');
    const pikachu = dto.chain.evolves_to[0];
    expect(pikachu).toBeInstanceOf(ChainLinkDto);
    expect(pikachu.species.name).toBe('pikachu');
    expect(pikachu.evolves_to[0].species.name).toBe('raichu');
  });

  it('defaults deeply nested null fields (min_level, item)', () => {
    const dto = EvolutionChainDto.create(evolutionChainMock as unknown as Partial<EvolutionChainDto>);
    const detail = dto.chain.evolves_to[0].evolution_details[0];
    expect(detail.min_level).toBe(0);
    expect(detail.item.name).toBe('');
    expect(detail.min_happiness).toBe(220);
  });
});
