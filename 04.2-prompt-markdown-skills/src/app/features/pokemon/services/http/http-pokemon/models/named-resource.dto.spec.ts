import { NamedResourceDto } from './named-resource.dto';

describe('NamedResourceDto', () => {
  it('retorna os defaults sem argumento', () => {
    expect(NamedResourceDto.create()).toEqual(new NamedResourceDto('', ''));
  });

  it('retorna os defaults para null', () => {
    expect(NamedResourceDto.create(null as unknown as Partial<NamedResourceDto>)).toEqual(
      new NamedResourceDto(),
    );
  });

  it('retorna os defaults para um objeto vazio', () => {
    expect(NamedResourceDto.create({})).toEqual(new NamedResourceDto());
  });

  it('mapeia um payload completo', () => {
    const dto = NamedResourceDto.create({ name: 'pikachu', url: '/api/v2/pokemon/25/' });

    expect(dto.name).toBe('pikachu');
    expect(dto.url).toBe('/api/v2/pokemon/25/');
  });

  it('mantém os valores informados e usa default para o restante', () => {
    const dto = NamedResourceDto.create({ name: 'pikachu' });

    expect(dto.name).toBe('pikachu');
    expect(dto.url).toBe('');
  });

  it('converte campos null para o default seguro', () => {
    const dto = NamedResourceDto.create({ name: null as unknown as string });

    expect(dto.name).toBe('');
  });

  it('monta um array, com default para entradas vazias/parciais', () => {
    expect(NamedResourceDto.createArray()).toEqual([]);
    expect(NamedResourceDto.createArray([{ name: 'a' }, {}])).toEqual([
      new NamedResourceDto('a', ''),
      new NamedResourceDto(),
    ]);
  });
});
