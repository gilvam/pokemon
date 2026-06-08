import { contrastRatio, hexToRgb, mixHex, readableTextColor, rgbToHex } from './color';

describe('color', () => {
  describe('hexToRgb / rgbToHex', () => {
    it('should round-trip a hex color', () => {
      expect(rgbToHex(hexToRgb('#5090d6'))).toBe('#5090d6');
    });
  });

  describe('mixHex', () => {
    it('should return the start color at ratio 0', () => {
      expect(mixHex('#000000', '#ffffff', 0)).toBe('#000000');
    });

    it('should return the end color at ratio 1', () => {
      expect(mixHex('#000000', '#ffffff', 1)).toBe('#ffffff');
    });

    it('should blend halfway to mid-grey', () => {
      expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080');
    });
  });

  describe('contrastRatio', () => {
    it('should give the maximum ratio for black on white', () => {
      expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
    });
  });

  describe('readableTextColor', () => {
    it('should pick dark text on a light background', () => {
      expect(readableTextColor('#ffffff')).toBe('#1b1b1f');
    });

    it('should pick white text on a dark background', () => {
      expect(readableTextColor('#101014')).toBe('#ffffff');
    });
  });
});
