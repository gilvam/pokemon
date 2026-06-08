import { PokemonType, POKEMON_TYPES } from '../models/pokemon-type.enum';
import { contrastRatio } from './color';
import { CARD_TEXT_COLOR, getCardBackground, getTypeColor } from './type-color';

const WCAG_AA_NORMAL = 4.5;

describe('type-color', () => {
  describe('getTypeColor', () => {
    it.each(POKEMON_TYPES)('should give chip text AA contrast for %s', (type) => {
      const { base, onBase } = getTypeColor(type);

      expect(contrastRatio(base, onBase)).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });

    it.each(POKEMON_TYPES)('should give card text AA contrast over the soft tint for %s', (type) => {
      const { soft } = getTypeColor(type);

      expect(contrastRatio(soft, CARD_TEXT_COLOR)).toBeGreaterThanOrEqual(WCAG_AA_NORMAL);
    });
  });

  describe('getCardBackground', () => {
    it('should fall back to a surface variable when there are no types', () => {
      expect(getCardBackground([])).toContain('--mat-sys-surface');
    });

    it('should build a gradient from a single type soft tint', () => {
      const background = getCardBackground([PokemonType.Fire]);

      expect(background).toContain('linear-gradient');
      expect(background).toContain(getTypeColor(PokemonType.Fire).soft);
    });

    it('should blend both soft tints for a dual-type Pokémon', () => {
      const background = getCardBackground([PokemonType.Fire, PokemonType.Flying]);

      expect(background).toContain(getTypeColor(PokemonType.Fire).soft);
      expect(background).toContain(getTypeColor(PokemonType.Flying).soft);
    });
  });
});
