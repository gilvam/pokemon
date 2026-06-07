import { PokemonDto } from './pokemon.dto';
import { SpritesDto } from './sprites.dto';
import { OfficialArtworkDto } from './official-artwork.dto';
import pokemonMock from '../mocks/get-pokemon/200-ok.json';

describe('PokemonDto', () => {
  it('defaults every field with no input', () => {
    const dto = PokemonDto.create();
    expect(dto.id).toBe(0);
    expect(dto.name).toBe('');
    expect(dto.base_experience).toBe(0);
    expect(dto.types).toEqual([]);
    expect(dto.stats).toEqual([]);
    expect(dto.sprites).toBeInstanceOf(SpritesDto);
  });

  it('defaults from create(null)', () => {
    const dto = PokemonDto.create(null as unknown as Partial<PokemonDto>);
    expect(dto).toEqual(new PokemonDto());
  });

  it('defaults from create({})', () => {
    expect(PokemonDto.create({})).toEqual(new PokemonDto());
  });

  it('maps a complete payload including nested DTOs and the hyphenated artwork key', () => {
    const dto = PokemonDto.create(pokemonMock as unknown as Partial<PokemonDto>);
    expect(dto.id).toBe(25);
    expect(dto.name).toBe('pikachu');
    expect(dto.types[0].type.name).toBe('electric');
    expect(dto.stats).toHaveLength(3);
    expect(dto.abilities[1].is_hidden).toBe(true);
    expect(dto.sprites.other.official_artwork).toBeInstanceOf(OfficialArtworkDto);
    expect(dto.sprites.other.official_artwork.front_default).toBe(
      'https://sprites/official-artwork/25.png',
    );
  });

  it('converts nested null values to safe defaults (back_default, cries.legacy)', () => {
    const dto = PokemonDto.create(pokemonMock as unknown as Partial<PokemonDto>);
    expect(dto.sprites.back_default).toBe('');
    expect(dto.cries.legacy).toBe('');
  });

  it('keeps provided values and defaults the rest on a partial payload', () => {
    const dto = PokemonDto.create({ id: 7, name: 'squirtle' });
    expect(dto.id).toBe(7);
    expect(dto.name).toBe('squirtle');
    expect(dto.weight).toBe(0);
    expect(dto.moves).toEqual([]);
  });

  it('defaults nested objects/arrays when the root sends null for them', () => {
    const dto = PokemonDto.create({
      sprites: null,
      types: null,
      stats: null,
    } as unknown as Partial<PokemonDto>);
    expect(dto.sprites).toBeInstanceOf(SpritesDto);
    expect(dto.types).toEqual([]);
    expect(dto.stats).toEqual([]);
  });
});
