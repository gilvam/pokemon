import { PokemonSummary } from './pokemon-summary.model';
import { PokemonFilterCriteria } from './pokemon-filter-criteria.model';
import { Rarity } from './rarity.model';
import { SortOption } from './sort-option.enum';

/** Pure filtering + ordering of the Pokémon index — no Angular, fully testable. */
export class PokemonFilter {
  static apply(
    items: PokemonSummary[],
    criteria: PokemonFilterCriteria,
    rarityById: Map<number, Rarity>,
  ): PokemonSummary[] {
    const matched = items.filter(
      (item) =>
        PokemonFilter.matchesSearch(item, criteria.search) &&
        PokemonFilter.matchesTypes(item, criteria) &&
        PokemonFilter.matchesRarity(item, criteria, rarityById),
    );
    return PokemonFilter.sort(matched, criteria.sort);
  }

  private static matchesSearch(item: PokemonSummary, search: string): boolean {
    const query = search.trim().toLowerCase();
    if (!query) {
      return true;
    }
    const number = String(item.id);
    const padded = `#${number.padStart(4, '0')}`;
    return (
      item.name.toLowerCase().includes(query) || number.includes(query) || padded.includes(query)
    );
  }

  private static matchesTypes(item: PokemonSummary, criteria: PokemonFilterCriteria): boolean {
    return criteria.types.every((type) => item.types.includes(type));
  }

  private static matchesRarity(
    item: PokemonSummary,
    criteria: PokemonFilterCriteria,
    rarityById: Map<number, Rarity>,
  ): boolean {
    const hasCategoryFilter = criteria.rarityCategories.length > 0;
    const hasTierFilter = criteria.rarityTiers.length > 0;
    if (!hasCategoryFilter && !hasTierFilter) {
      return true;
    }
    const rarity = rarityById.get(item.id);
    if (!rarity) {
      return false;
    }
    const categoryOk = !hasCategoryFilter || criteria.rarityCategories.includes(rarity.category);
    const tierOk = !hasTierFilter || criteria.rarityTiers.includes(rarity.tier);
    return categoryOk && tierOk;
  }

  private static sort(items: PokemonSummary[], sort: SortOption): PokemonSummary[] {
    return [...items].sort((left, right) => {
      switch (sort) {
        case SortOption.NUMBER_DESC:
          return right.id - left.id;
        case SortOption.NAME_ASC:
          return left.name.localeCompare(right.name);
        case SortOption.NAME_DESC:
          return right.name.localeCompare(left.name);
        case SortOption.NUMBER_ASC:
        default:
          return left.id - right.id;
      }
    });
  }
}
