import { RarityCategory } from '../models/rarity-category.enum';
import { RarityTier } from '../models/rarity-tier.enum';
import { PokemonRarity } from '../models/pokemon-rarity.model';

interface IRarityFlags {
  isBaby: boolean;
  isLegendary: boolean;
  isMythical: boolean;
  captureRate: number;
}

const VERY_RARE_MAX = 3;
const RARE_MAX = 45;
const UNCOMMON_MAX = 120;

export function resolveRarityCategory({
  isBaby,
  isLegendary,
  isMythical,
}: Pick<IRarityFlags, 'isBaby' | 'isLegendary' | 'isMythical'>): RarityCategory {
  if (isMythical) {
    return RarityCategory.Mythical;
  }
  if (isLegendary) {
    return RarityCategory.Legendary;
  }
  if (isBaby) {
    return RarityCategory.Baby;
  }
  return RarityCategory.Normal;
}

export function resolveRarityTier(captureRate: number): RarityTier {
  if (captureRate <= VERY_RARE_MAX) {
    return RarityTier.VeryRare;
  }
  if (captureRate <= RARE_MAX) {
    return RarityTier.Rare;
  }
  if (captureRate <= UNCOMMON_MAX) {
    return RarityTier.Uncommon;
  }
  return RarityTier.Common;
}

export function resolveRarity(flags: IRarityFlags): PokemonRarity {
  return new PokemonRarity(
    resolveRarityCategory(flags),
    resolveRarityTier(flags.captureRate),
    flags.captureRate,
  );
}
