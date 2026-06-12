import { ColorContrast } from './color-contrast.model';
import { PokemonType } from './pokemon-type.enum';
import { TypePalette } from './type-palette.model';

describe('TypePalette', () => {
  it('defines an accessible (AA) color pair for every one of the 18 types', () => {
    const types = TypePalette.all();

    expect(types).toHaveLength(18);
    types.forEach((type) => {
      const color = TypePalette.colorOf(type);
      const ratio = ColorContrast.ratio(color.text, color.background);
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    });
  });

  it('falls back to a neutral surface background when there are no types', () => {
    expect(TypePalette.cardBackground([])).toContain('var(--mat-sys-');
  });

  it('builds a soft single-color gradient for one type', () => {
    const background = TypePalette.cardBackground([PokemonType.FIRE]);

    expect(background).toContain('linear-gradient');
    expect(background).toContain('color-mix');
    expect(background).toContain('#ffd2bd');
  });

  it('blends both tints into a gradient for a dual-type Pokémon', () => {
    const background = TypePalette.cardBackground([PokemonType.GRASS, PokemonType.POISON]);

    expect(background).toContain('linear-gradient');
    expect(background).toContain('#cdeeb6');
    expect(background).toContain('#e6c4ec');
  });
});
