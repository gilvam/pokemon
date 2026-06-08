/**
 * Species rarity category derived from the species flags
 * (`is_mythical`, `is_legendary`, `is_baby`).
 */
export enum RarityCategory {
  Normal = 'normal',
  Baby = 'baby',
  Legendary = 'legendary',
  Mythical = 'mythical',
}

export const RARITY_CATEGORIES: readonly RarityCategory[] = Object.values(RarityCategory);
