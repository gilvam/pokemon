import { RarityCategory } from './rarity-category.enum';
import { RarityTier } from './rarity-tier.enum';
import { IRarityFlags } from './rarity-flags.interface';

/** A Pokémon's rarity: its species category plus a capture-rate band. */
export class Rarity {
  constructor(
    public category: RarityCategory = RarityCategory.NORMAL,
    public tier: RarityTier = RarityTier.COMMON,
  ) {}

  static categoryOf(flags: IRarityFlags): RarityCategory {
    if (flags.isMythical) {
      return RarityCategory.MYTHICAL;
    }
    if (flags.isLegendary) {
      return RarityCategory.LEGENDARY;
    }
    if (flags.isBaby) {
      return RarityCategory.BABY;
    }
    return RarityCategory.NORMAL;
  }

  static tierOf(captureRate: number): RarityTier {
    if (captureRate <= 3) {
      return RarityTier.VERY_RARE;
    }
    if (captureRate <= 45) {
      return RarityTier.RARE;
    }
    if (captureRate <= 120) {
      return RarityTier.UNCOMMON;
    }
    return RarityTier.COMMON;
  }

  static fromSpecies(flags: IRarityFlags, captureRate: number): Rarity {
    return new Rarity(Rarity.categoryOf(flags), Rarity.tierOf(captureRate));
  }
}
