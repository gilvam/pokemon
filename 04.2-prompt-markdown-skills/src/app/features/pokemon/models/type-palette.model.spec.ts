import { ColorContrast } from './color-contrast.model';
import { PokemonType } from './pokemon-type.enum';
import { TypePalette } from './type-palette.model';

describe('TypePalette', () => {
  it('define um par de cor acessível (AA) para os 18 tipos', () => {
    const types = TypePalette.all();

    expect(types).toHaveLength(18);
    types.forEach((type) => {
      const color = TypePalette.colorOf(type);
      const ratio = ColorContrast.ratio(color.text, color.background);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  it('usa um fundo neutro quando não há tipos', () => {
    expect(TypePalette.cardBackground([])).toBe('#e5e7eb');
  });

  it('monta um gradiente suave de uma cor só para um único tipo', () => {
    const background = TypePalette.cardBackground([PokemonType.FIRE]);

    expect(background).toContain('linear-gradient');
    expect(background).toContain('color-mix');
    expect(background).toContain('#ffd2bd');
  });

  it('mistura as duas cores em gradiente para um Pokémon de dois tipos, na ordem primário→secundário', () => {
    const background = TypePalette.cardBackground([PokemonType.GRASS, PokemonType.POISON]);
    const grassIndex = background.indexOf('#cdeeb6');
    const poisonIndex = background.indexOf('#e6c4ec');

    expect(background).toContain('linear-gradient');
    expect(grassIndex).toBeGreaterThanOrEqual(0);
    expect(poisonIndex).toBeGreaterThan(grassIndex);
  });
});
