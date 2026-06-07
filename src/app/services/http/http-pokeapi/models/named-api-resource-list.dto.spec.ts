import { NamedApiResourceListDto } from './named-api-resource-list.dto';
import { NamedApiResourceDto } from './named-api-resource.dto';

describe('NamedApiResourceListDto', () => {
  it('defaults to an empty list', () => {
    const dto = NamedApiResourceListDto.create();
    expect(dto.count).toBe(0);
    expect(dto.next).toBe('');
    expect(dto.results).toEqual([]);
  });

  it('maps results into NamedApiResourceDto instances', () => {
    const dto = NamedApiResourceListDto.create({
      count: 1,
      results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }],
    });
    expect(dto.count).toBe(1);
    expect(dto.results[0]).toBeInstanceOf(NamedApiResourceDto);
    expect(dto.results[0].name).toBe('pikachu');
  });

  it('defaults results to [] when the root sends null', () => {
    const dto = NamedApiResourceListDto.create({
      results: null,
    } as unknown as Partial<NamedApiResourceListDto>);
    expect(dto.results).toEqual([]);
  });
});
