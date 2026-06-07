import { PokemonListItem } from '../../core/pokedex/pokedex-store.service';
import { CaptureTier, RarityCategory, RarityInfo } from '../../core/pokedex/rarity';

export type SortOption = 'number-asc' | 'number-desc' | 'name-asc' | 'name-desc';

export interface FilterCriteria {
  readonly search: string;
  /** Selected type names; an item must match ALL of them (AND semantics). */
  readonly types: readonly string[];
  readonly categories: readonly RarityCategory[];
  readonly tiers: readonly CaptureTier[];
  readonly sort: SortOption;
}

export const DEFAULT_CRITERIA: FilterCriteria = {
  search: '',
  types: [],
  categories: [],
  tiers: [],
  sort: 'number-asc',
};

// Combining diacritical marks (U+0300–U+036F), built from a string to keep the
// source ASCII-only.
const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g');

function normalize(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(DIACRITICS, '').trim();
}

function matchesSearch(item: PokemonListItem, search: string): boolean {
  if (!search) return true;
  const term = normalize(search);
  return normalize(item.name).includes(term) || String(item.id).includes(term);
}

function matchesTypes(item: PokemonListItem, types: readonly string[]): boolean {
  if (types.length === 0) return true;
  return types.every((type) => item.types.includes(type));
}

function matchesRarity(
  item: PokemonListItem,
  categories: readonly RarityCategory[],
  tiers: readonly CaptureTier[],
  rarityMap: ReadonlyMap<number, RarityInfo>,
): boolean {
  if (categories.length === 0 && tiers.length === 0) return true;
  const rarity = rarityMap.get(item.id);
  if (!rarity) return false;
  const categoryOk = categories.length === 0 || categories.includes(rarity.category);
  const tierOk = tiers.length === 0 || tiers.includes(rarity.captureTier);
  return categoryOk && tierOk;
}

function compare(a: PokemonListItem, b: PokemonListItem, sort: SortOption): number {
  switch (sort) {
    case 'number-asc':
      return a.id - b.id;
    case 'number-desc':
      return b.id - a.id;
    case 'name-asc':
      return a.name.localeCompare(b.name);
    case 'name-desc':
      return b.name.localeCompare(a.name);
  }
}

/** Pure filter + sort pipeline used by the list view (and unit tested directly). */
export function applyFilters(
  items: readonly PokemonListItem[],
  criteria: FilterCriteria,
  rarityMap: ReadonlyMap<number, RarityInfo>,
): PokemonListItem[] {
  return items
    .filter(
      (item) =>
        matchesSearch(item, criteria.search) &&
        matchesTypes(item, criteria.types) &&
        matchesRarity(item, criteria.categories, criteria.tiers, rarityMap),
    )
    .sort((a, b) => compare(a, b, criteria.sort));
}

/** True when any rarity filter is active (so the list needs the rarity index). */
export function needsRarityIndex(criteria: FilterCriteria): boolean {
  return criteria.categories.length > 0 || criteria.tiers.length > 0;
}
