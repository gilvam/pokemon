import { PokemonSummary } from '../models/pokemon-summary.model';
import { PokemonType } from '../models/pokemon-type.enum';
import { RarityCategory } from '../models/rarity-category.enum';
import { RarityTier } from '../models/rarity-tier.enum';
import { SortOption } from '../models/sort-option.enum';
import { formatPokedexNumber } from './pokemon-id';

export interface IPokemonFilterCriteria {
  search: string;
  types: readonly PokemonType[];
  categories: readonly RarityCategory[];
  tiers: readonly RarityTier[];
}

function matchesSearch(summary: PokemonSummary, search: string): boolean {
  const term = search.trim().toLowerCase();
  if (0 === term.length) {
    return true;
  }
  return (
    summary.name.toLowerCase().includes(term) ||
    formatPokedexNumber(summary.id).toLowerCase().includes(term)
  );
}

function matchesTypes(summary: PokemonSummary, types: readonly PokemonType[]): boolean {
  return types.every((type) => summary.types.includes(type));
}

function matchesRarity(summary: PokemonSummary, criteria: IPokemonFilterCriteria): boolean {
  const hasRarityFilter = criteria.categories.length > 0 || criteria.tiers.length > 0;
  if (!hasRarityFilter) {
    return true;
  }
  if (!summary.rarity) {
    return false;
  }
  const categoryOk =
    0 === criteria.categories.length || criteria.categories.includes(summary.rarity.category);
  const tierOk = 0 === criteria.tiers.length || criteria.tiers.includes(summary.rarity.tier);
  return categoryOk && tierOk;
}

export function matchesFilters(
  summary: PokemonSummary,
  criteria: IPokemonFilterCriteria,
): boolean {
  return (
    matchesSearch(summary, criteria.search) &&
    matchesTypes(summary, criteria.types) &&
    matchesRarity(summary, criteria)
  );
}

export function sortSummaries(
  list: readonly PokemonSummary[],
  sort: SortOption,
): PokemonSummary[] {
  const sorted = [...list];
  switch (sort) {
    case SortOption.NameAsc:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case SortOption.NameDesc:
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case SortOption.NumberDesc:
      return sorted.sort((a, b) => b.id - a.id);
    default:
      return sorted.sort((a, b) => a.id - b.id);
  }
}

export function filterAndSort(params: {
  list: readonly PokemonSummary[];
  criteria: IPokemonFilterCriteria;
  sort: SortOption;
}): PokemonSummary[] {
  const matched = params.list.filter((summary) => matchesFilters(summary, params.criteria));
  return sortSummaries(matched, params.sort);
}
