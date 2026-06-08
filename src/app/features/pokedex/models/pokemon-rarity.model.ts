import { RarityCategory } from './rarity-category.enum';
import { RarityTier } from './rarity-tier.enum';

/** Combined rarity of a Pokémon: species category plus capture-rate tier. */
export class PokemonRarity {
  constructor(
    public readonly category: RarityCategory,
    public readonly tier: RarityTier,
    public readonly captureRate: number,
  ) {}
}
