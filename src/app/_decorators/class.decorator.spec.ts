import { NoNull } from './class.decorator';

@NoNull()
class SampleDto {
  constructor(
    public name = 'default',
    public count = 0,
  ) {}

  static create(item: Partial<SampleDto> = new this()): SampleDto {
    return new this(item.name, item.count);
  }

  static createArray(items: Partial<SampleDto>[] = []): SampleDto[] {
    return (items ?? []).map((item) => SampleDto.create(item));
  }

  static untouched(value: string | null): string | null {
    return value;
  }

  greet(): string {
    return `hi ${this.name}`;
  }
}

describe('NoNull decorator', () => {
  it('converts null constructor args to defaults', () => {
    const dto = new SampleDto(null as unknown as string, null as unknown as number);
    expect(dto.name).toBe('default');
    expect(dto.count).toBe(0);
  });

  it('converts create(null) to all defaults', () => {
    const dto = SampleDto.create(null as unknown as Partial<SampleDto>);
    expect(dto).toEqual(new SampleDto());
  });

  it('keeps provided values in create()', () => {
    expect(SampleDto.create({ name: 'pikachu' })).toEqual(new SampleDto('pikachu', 0));
  });

  it('converts createArray(null) to an empty array', () => {
    expect(SampleDto.createArray(null as unknown as Partial<SampleDto>[])).toEqual([]);
  });

  it('maps each item in createArray()', () => {
    expect(SampleDto.createArray([{ name: 'a' }, { count: 5 }])).toEqual([
      new SampleDto('a', 0),
      new SampleDto('default', 5),
    ]);
  });

  it('leaves other static methods untouched', () => {
    expect(SampleDto.untouched(null)).toBeNull();
  });

  it('preserves the prototype chain and instance methods', () => {
    expect(new SampleDto('ash').greet()).toBe('hi ash');
    expect(SampleDto.create({ name: 'ash' }) instanceof SampleDto).toBe(true);
  });
});
