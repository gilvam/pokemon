import { NoNull } from './class.decorator';

@NoNull()
class SampleDto {
  constructor(
    public name = 'default',
    public count = 0,
  ) {}

  static create(item: Partial<SampleDto> = {}): SampleDto {
    return new SampleDto(item.name, item.count);
  }

  static createArray(items: Partial<SampleDto>[] = []): SampleDto[] {
    return items.map((item) => SampleDto.create(item));
  }
}

describe('NoNull decorator', () => {
  it('should convert null constructor args into defaults', () => {
    const dto = new SampleDto(null as unknown as string, null as unknown as number);

    expect(dto.name).toBe('default');
    expect(dto.count).toBe(0);
  });

  it('should convert null create() args into defaults', () => {
    const dto = SampleDto.create(null as unknown as Partial<SampleDto>);

    expect(dto.name).toBe('default');
    expect(dto.count).toBe(0);
  });

  it('should keep non-null values untouched', () => {
    const dto = new SampleDto('pikachu', 25);

    expect(dto.name).toBe('pikachu');
    expect(dto.count).toBe(25);
  });

  it('should preserve other static methods', () => {
    const list = SampleDto.createArray([{ name: 'a' }, { name: 'b' }]);

    expect(list.map((item) => item.name)).toEqual(['a', 'b']);
  });
});
