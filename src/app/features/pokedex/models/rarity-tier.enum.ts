/**
 * Rarity tier derived from the species `capture_rate` (0–255; higher is easier
 * to catch, therefore more common).
 */
export enum RarityTier {
  Common = 'common',
  Uncommon = 'uncommon',
  Rare = 'rare',
  VeryRare = 'very-rare',
}

export const RARITY_TIERS: readonly RarityTier[] = Object.values(RarityTier);
