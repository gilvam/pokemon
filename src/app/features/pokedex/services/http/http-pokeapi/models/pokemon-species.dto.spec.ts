import { PokemonSpeciesDto } from './pokemon-species.dto';
import speciesMock from '../jsons/get-species/200-ok.json';

describe('PokemonSpeciesDto', () => {
  it('returns all defaults with no argument', () => {
    const dto = PokemonSpeciesDto.create();

    expect(dto.captureRate).toBe(0);
    expect(dto.isLegendary).toBe(false);
    expect(dto.eggGroups).toEqual([]);
    expect(dto.evolutionChain.url).toBe('');
  });

  it('camelCases and maps the full snake_case payload', () => {
    const dto = PokemonSpeciesDto.create(speciesMock);

    expect(dto.isMythical).toBe(false);
    expect(dto.captureRate).toBe(190);
    expect(dto.baseHappiness).toBe(50);
    expect(dto.eggGroups).toHaveLength(2);
    expect(dto.genera.at(0)?.genus).toBe('Mouse Pokémon');
    expect(dto.flavorTextEntries.at(0)?.language.name).toBe('en');
    expect(dto.evolutionChain.url).toContain('/evolution-chain/10/');
  });

  it('defaults a null habitat to an empty resource', () => {
    const dto = PokemonSpeciesDto.create({ habitat: null as unknown as undefined });

    expect(dto.habitat.name).toBe('');
  });
});
