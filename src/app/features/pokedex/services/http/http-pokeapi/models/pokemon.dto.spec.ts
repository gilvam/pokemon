import { PokemonDto } from './pokemon.dto';
import { PokemonSpeciesDto } from './pokemon-species.dto';
import { NamedResourceDto } from './named-resource.dto';

describe('PokemonDto null-safety', () => {
  it('should fall back to safe defaults for an empty payload', () => {
    const pokemon = PokemonDto.create({});

    expect(pokemon.id).toBe(0);
    expect(pokemon.name).toBe('');
    expect(pokemon.types).toEqual([]);
    expect(pokemon.sprites.officialArtwork).toBe('');
    expect(pokemon.species).toBeInstanceOf(NamedResourceDto);
  });

  it('should convert null fields to defaults via @NoNull', () => {
    const pokemon = PokemonDto.create({ id: null as unknown as number, name: null as unknown as string });

    expect(pokemon.id).toBe(0);
    expect(pokemon.name).toBe('');
  });

  it('should map nested type slots explicitly', () => {
    const pokemon = PokemonDto.create({
      types: [{ slot: 1, type: { name: 'fire', url: 'x/10/' } }],
    });

    expect(pokemon.types.at(0)?.type.name).toBe('fire');
  });
});

describe('PokemonSpeciesDto null-safety', () => {
  it('should default a null habitat to an empty NamedResourceDto', () => {
    const species = PokemonSpeciesDto.create({ habitat: null });

    expect(species.habitat).toBeInstanceOf(NamedResourceDto);
    expect(species.habitat.name).toBe('');
  });

  it('should map rarity flags and capture rate', () => {
    const species = PokemonSpeciesDto.create({ is_legendary: true, capture_rate: 3 });

    expect(species.isLegendary).toBe(true);
    expect(species.captureRate).toBe(3);
  });
});
