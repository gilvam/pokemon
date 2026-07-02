import { Rarity } from './rarity.model';
import { RarityCategory } from './rarity-category.enum';
import { RarityTier } from './rarity-tier.enum';

describe('Rarity.categoryOf', () => {
  it('prefers mythical over every other flag', () => {
    const category = Rarity.categoryOf({ isBaby: true, isLegendary: true, isMythical: true });

    expect(category).toBe(RarityCategory.MYTHICAL);
  });

  it('returns legendary when legendary but not mythical', () => {
    const category = Rarity.categoryOf({ isBaby: false, isLegendary: true, isMythical: false });

    expect(category).toBe(RarityCategory.LEGENDARY);
  });

  it('returns baby when only baby', () => {
    const category = Rarity.categoryOf({ isBaby: true, isLegendary: false, isMythical: false });

    expect(category).toBe(RarityCategory.BABY);
  });

  it('returns normal when no flag is set', () => {
    const category = Rarity.categoryOf({ isBaby: false, isLegendary: false, isMythical: false });

    expect(category).toBe(RarityCategory.NORMAL);
  });
});

describe('Rarity.tierOf', () => {
  const cases = [
    { captureRate: 0, tier: RarityTier.VERY_RARE },
    { captureRate: 3, tier: RarityTier.VERY_RARE },
    { captureRate: 4, tier: RarityTier.RARE },
    { captureRate: 45, tier: RarityTier.RARE },
    { captureRate: 46, tier: RarityTier.UNCOMMON },
    { captureRate: 120, tier: RarityTier.UNCOMMON },
    { captureRate: 121, tier: RarityTier.COMMON },
    { captureRate: 255, tier: RarityTier.COMMON },
  ];

  cases.forEach(({ captureRate, tier }) => {
    it(`maps capture_rate ${captureRate} to ${tier}`, () => {
      expect(Rarity.tierOf(captureRate)).toBe(tier);
    });
  });
});

describe('Rarity.fromSpecies', () => {
  it('combines the category and the tier', () => {
    const rarity = Rarity.fromSpecies({ isBaby: false, isLegendary: true, isMythical: false }, 3);

    expect(rarity).toEqual(new Rarity(RarityCategory.LEGENDARY, RarityTier.VERY_RARE));
  });
});
