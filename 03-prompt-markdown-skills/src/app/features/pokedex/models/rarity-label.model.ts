import { RarityCategory } from './rarity-category.enum';
import { RarityTier } from './rarity-tier.enum';

/** Brazilian-Portuguese display labels for rarity categories and tiers. */
export class RarityLabel {
  private static readonly categories: Record<RarityCategory, string> = {
    [RarityCategory.NORMAL]: 'Normal',
    [RarityCategory.BABY]: 'Bebê',
    [RarityCategory.LEGENDARY]: 'Lendário',
    [RarityCategory.MYTHICAL]: 'Mítico',
  };

  private static readonly tiers: Record<RarityTier, string> = {
    [RarityTier.COMMON]: 'Comum',
    [RarityTier.UNCOMMON]: 'Incomum',
    [RarityTier.RARE]: 'Raro',
    [RarityTier.VERY_RARE]: 'Muito Raro',
  };

  static category(category: RarityCategory): string {
    return RarityLabel.categories[category];
  }

  static tier(tier: RarityTier): string {
    return RarityLabel.tiers[tier];
  }
}
