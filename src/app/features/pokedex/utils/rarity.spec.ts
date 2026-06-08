import { RarityCategory } from '../models/rarity-category.enum';
import { RarityTier } from '../models/rarity-tier.enum';
import { resolveRarity, resolveRarityCategory, resolveRarityTier } from './rarity';

describe('rarity', () => {
  describe('resolveRarityCategory', () => {
    it('should prioritize mythical over legendary and baby', () => {
      const category = resolveRarityCategory({
        isBaby: true,
        isLegendary: true,
        isMythical: true,
      });

      expect(category).toBe(RarityCategory.Mythical);
    });

    it('should map legendary when not mythical', () => {
      const category = resolveRarityCategory({
        isBaby: false,
        isLegendary: true,
        isMythical: false,
      });

      expect(category).toBe(RarityCategory.Legendary);
    });

    it('should map baby when only the baby flag is set', () => {
      const category = resolveRarityCategory({
        isBaby: true,
        isLegendary: false,
        isMythical: false,
      });

      expect(category).toBe(RarityCategory.Baby);
    });

    it('should fall back to normal when no flag is set', () => {
      const category = resolveRarityCategory({
        isBaby: false,
        isLegendary: false,
        isMythical: false,
      });

      expect(category).toBe(RarityCategory.Normal);
    });
  });

  describe('resolveRarityTier', () => {
    it('should map capture rate at the very-rare boundary (3)', () => {
      expect(resolveRarityTier(3)).toBe(RarityTier.VeryRare);
    });

    it('should map capture rate at the rare boundary (45)', () => {
      expect(resolveRarityTier(45)).toBe(RarityTier.Rare);
    });

    it('should map capture rate at the uncommon boundary (120)', () => {
      expect(resolveRarityTier(120)).toBe(RarityTier.Uncommon);
    });

    it('should map capture rate above 120 to common', () => {
      expect(resolveRarityTier(255)).toBe(RarityTier.Common);
    });
  });

  describe('resolveRarity', () => {
    it('should combine category, tier and capture rate', () => {
      const rarity = resolveRarity({
        isBaby: false,
        isLegendary: true,
        isMythical: false,
        captureRate: 3,
      });

      expect(rarity.category).toBe(RarityCategory.Legendary);
      expect(rarity.tier).toBe(RarityTier.VeryRare);
      expect(rarity.captureRate).toBe(3);
    });
  });
});
