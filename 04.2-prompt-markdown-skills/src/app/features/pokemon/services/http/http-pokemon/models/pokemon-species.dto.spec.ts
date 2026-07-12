import { PokemonSpeciesDto } from './pokemon-species.dto';
import speciesMock from '../jsons/get-species/200-ok.json';

describe('PokemonSpeciesDto', () => {
  it('retorna todos os defaults sem argumento', () => {
    const dto = PokemonSpeciesDto.create();

    expect(dto.id).toBe(0);
    expect(dto.genera).toEqual([]);
    expect(dto.flavorTextEntries).toEqual([]);
    expect(dto.evolutionChain.url).toBe('');
  });

  it('converte para camelCase e mapeia genera/flavor text/evolution chain', () => {
    const dto = PokemonSpeciesDto.create(speciesMock as unknown as Partial<PokemonSpeciesDto>);

    expect(dto.genera.find((g) => g.language.name === 'en')?.genus).toBe('Mouse Pokémon');
    expect(dto.flavorTextEntries.at(0)?.flavorText).toContain('lightning storms');
    expect(dto.evolutionChain.url).toBe('/api/v2/evolution-chain/10/');
  });
});
