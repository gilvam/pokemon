import { PokemonDto } from './pokemon.dto';
import pokemonMock from '../jsons/get-pokemon/200-ok.json';

describe('PokemonDto', () => {
  it('retorna todos os defaults sem argumento', () => {
    const dto = PokemonDto.create();

    expect(dto.id).toBe(0);
    expect(dto.name).toBe('');
    expect(dto.stats).toEqual([]);
    expect(dto.sprites.other.officialArtwork.frontDefault).toBe('');
  });

  it('retorna os defaults para null e para um objeto vazio', () => {
    expect(PokemonDto.create(null as unknown as Partial<PokemonDto>).id).toBe(0);
    expect(PokemonDto.create({}).name).toBe('');
  });

  it('converte para camelCase e mapeia o payload completo, incluindo DTOs aninhados', () => {
    const dto = PokemonDto.create(pokemonMock as unknown as Partial<PokemonDto>);

    expect(dto.height).toBe(4);
    expect(dto.weight).toBe(60);
    expect(dto.stats).toHaveLength(3);
    expect(dto.stats.at(0)?.baseStat).toBe(35);
    expect(dto.types.at(0)?.type.name).toBe('electric');
    expect(dto.abilities.at(1)?.isHidden).toBe(true);
    expect(dto.sprites.other.officialArtwork.frontDefault).toContain('official-artwork/25.png');
    expect(dto.cries.latest).toContain('latest/25.ogg');
    expect(dto.species.name).toBe('pikachu');
  });

  it('mantém os valores informados e usa default para o restante em um payload parcial', () => {
    const dto = PokemonDto.create({ name: 'mew' });

    expect(dto.name).toBe('mew');
    expect(dto.types).toEqual([]);
    expect(dto.sprites.other.officialArtwork.frontShiny).toBe('');
  });
});
