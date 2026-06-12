import { ColorContrast } from './color-contrast.model';

describe('ColorContrast', () => {
  it('returns 0 luminance for black and 1 for white', () => {
    expect(ColorContrast.relativeLuminance('#000000')).toBe(0);
    expect(ColorContrast.relativeLuminance('#ffffff')).toBeCloseTo(1, 5);
  });

  it('computes the maximum 21:1 ratio between black and white', () => {
    expect(ColorContrast.ratio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('returns 1 for identical colors', () => {
    expect(ColorContrast.ratio('#3366cc', '#3366cc')).toBeCloseTo(1, 5);
  });

  it('supports shorthand 3-digit hex', () => {
    expect(ColorContrast.ratio('#000', '#fff')).toBeCloseTo(21, 0);
  });

  it('confirms dark slate text on white passes AA', () => {
    expect(ColorContrast.ratio('#1f2937', '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });
});
