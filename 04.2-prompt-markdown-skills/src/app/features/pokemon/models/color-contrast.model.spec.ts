import { ColorContrast } from './color-contrast.model';

describe('ColorContrast', () => {
  it('retorna 1 para a mesma cor (sem contraste)', () => {
    expect(ColorContrast.ratio('#808080', '#808080')).toBeCloseTo(1, 5);
  });

  it('retorna 21 para preto sobre branco (contraste máximo)', () => {
    expect(ColorContrast.ratio('#000000', '#ffffff')).toBeCloseTo(21, 0);
  });

  it('é simétrico independentemente de qual cor é o texto', () => {
    const ratio = ColorContrast.ratio('#1f2937', '#ffd2bd');
    const reversed = ColorContrast.ratio('#ffd2bd', '#1f2937');
    expect(ratio).toBeCloseTo(reversed, 5);
  });

  it('aceita hex de 3 dígitos', () => {
    expect(ColorContrast.ratio('#000', '#fff')).toBeCloseTo(21, 0);
  });
});
