import { PokemonDto } from './pokemon.dto';
import pokemonMock from '../jsons/get-pokemon/200-ok.json';

describe('PokemonDto', () => {
  it('returns all defaults with no argument', () => {
    const dto = PokemonDto.create();

    expect(dto.id).toBe(0);
    expect(dto.name).toBe('');
    expect(dto.baseExperience).toBe(0);
    expect(dto.stats).toEqual([]);
    expect(dto.sprites.other.officialArtwork.frontDefault).toBe('');
  });

  it('returns all defaults for null and for an empty object', () => {
    expect(PokemonDto.create(null as unknown as Partial<PokemonDto>).id).toBe(0);
    expect(PokemonDto.create({}).name).toBe('');
  });

  it('camelCases and maps the full snake_case payload, including nested DTOs', () => {
    const dto = PokemonDto.create(pokemonMock as unknown as Partial<PokemonDto>);

    expect(dto.baseExperience).toBe(112);
    expect(dto.stats).toHaveLength(3);
    expect(dto.stats.at(0)?.baseStat).toBe(35);
    expect(dto.types.at(0)?.type.name).toBe('electric');
    expect(dto.abilities.at(1)?.isHidden).toBe(true);
    expect(dto.sprites.other.officialArtwork.frontDefault).toContain('official-artwork/25.png');
    expect(dto.cries.latest).toContain('latest/25.ogg');
  });

  it('keeps provided values and defaults the rest on a partial payload', () => {
    const dto = PokemonDto.create({ name: 'mew' });

    expect(dto.name).toBe('mew');
    expect(dto.types).toEqual([]);
    expect(dto.sprites.other.officialArtwork.frontShiny).toBe('');
  });
});
