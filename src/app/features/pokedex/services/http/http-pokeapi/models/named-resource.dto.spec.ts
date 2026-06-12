import { NamedResourceDto } from './named-resource.dto';

describe('NamedResourceDto', () => {
  it('returns all defaults with no argument', () => {
    expect(NamedResourceDto.create()).toEqual(new NamedResourceDto('', ''));
  });

  it('returns all defaults for null', () => {
    expect(NamedResourceDto.create(null as unknown as Partial<NamedResourceDto>)).toEqual(
      new NamedResourceDto(),
    );
  });

  it('returns all defaults for an empty object', () => {
    expect(NamedResourceDto.create({})).toEqual(new NamedResourceDto());
  });

  it('maps a complete payload', () => {
    const dto = NamedResourceDto.create({ name: 'pikachu', url: 'https://x/25/' });

    expect(dto.name).toBe('pikachu');
    expect(dto.url).toBe('https://x/25/');
  });

  it('keeps provided values and defaults the rest', () => {
    const dto = NamedResourceDto.create({ name: 'pikachu' });

    expect(dto.name).toBe('pikachu');
    expect(dto.url).toBe('');
  });

  it('converts null fields to safe defaults', () => {
    const dto = NamedResourceDto.create({ name: null as unknown as string });

    expect(dto.name).toBe('');
  });

  it('builds an array, defaulting empty and partial entries', () => {
    expect(NamedResourceDto.createArray()).toEqual([]);
    expect(NamedResourceDto.createArray([{ name: 'a' }, {}])).toEqual([
      new NamedResourceDto('a', ''),
      new NamedResourceDto(),
    ]);
  });
});
