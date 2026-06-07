import { PokemonSpeciesDto } from '../../services/http/http-pokeapi/models/pokemon-species.dto';

/** Species-flag based rarity category. */
export type RarityCategory = 'normal' | 'baby' | 'legendary' | 'mythical';

/** Catch-difficulty tier derived from `capture_rate` (0-255, higher = easier/commoner). */
export type CaptureTier = 'common' | 'uncommon' | 'rare' | 'very-rare';

export interface RarityInfo {
  readonly category: RarityCategory;
  readonly captureTier: CaptureTier;
  readonly captureRate: number;
}

export const RARITY_CATEGORY_LABELS: Record<RarityCategory, string> = {
  normal: 'Normal',
  baby: 'Bebê',
  legendary: 'Lendário',
  mythical: 'Mítico',
};

export const CAPTURE_TIER_LABELS: Record<CaptureTier, string> = {
  common: 'Comum',
  uncommon: 'Incomum',
  rare: 'Raro',
  'very-rare': 'Muito Raro',
};

export const RARITY_CATEGORY_ORDER: readonly RarityCategory[] = [
  'normal',
  'baby',
  'legendary',
  'mythical',
];

export const CAPTURE_TIER_ORDER: readonly CaptureTier[] = [
  'common',
  'uncommon',
  'rare',
  'very-rare',
];

/** Mythical takes precedence over legendary, then baby, otherwise normal. */
export function deriveRarityCategory(species: {
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
}): RarityCategory {
  if (species.is_mythical) return 'mythical';
  if (species.is_legendary) return 'legendary';
  if (species.is_baby) return 'baby';
  return 'normal';
}

/** Buckets the 0-255 capture rate into four tiers. */
export function deriveCaptureTier(captureRate: number): CaptureTier {
  if (captureRate <= 3) return 'very-rare';
  if (captureRate <= 45) return 'rare';
  if (captureRate <= 120) return 'uncommon';
  return 'common';
}

export function deriveRarity(species: PokemonSpeciesDto): RarityInfo {
  return {
    category: deriveRarityCategory(species),
    captureTier: deriveCaptureTier(species.capture_rate),
    captureRate: species.capture_rate,
  };
}
