import { PokemonSummary } from '../models/pokemon-summary.model';
import { PokemonType } from '../models/pokemon-type.enum';
import { PokemonRarity } from '../models/pokemon-rarity.model';
import { RarityCategory } from '../models/rarity-category.enum';
import { RarityTier } from '../models/rarity-tier.enum';
import { SortOption } from '../models/sort-option.enum';
import { filterAndSort, matchesFilters } from './filter-sort';

const legendaryRarity = new PokemonRarity(RarityCategory.Legendary, RarityTier.VeryRare, 3);

const charizard = new PokemonSummary(6, 'charizard', [PokemonType.Fire, PokemonType.Flying]);
const pikachu = new PokemonSummary(25, 'pikachu', [PokemonType.Electric]);
const moltres = new PokemonSummary(146, 'moltres', [PokemonType.Fire, PokemonType.Flying], legendaryRarity);

const emptyCriteria = { search: '', types: [], categories: [], tiers: [] };

describe('filter-sort', () => {
  describe('matchesFilters', () => {
    it('should match by name search (case-insensitive)', () => {
      expect(matchesFilters(pikachu, { ...emptyCriteria, search: 'PIKA' })).toBe(true);
      expect(matchesFilters(charizard, { ...emptyCriteria, search: 'PIKA' })).toBe(false);
    });

    it('should match by Pokédex number search', () => {
      expect(matchesFilters(pikachu, { ...emptyCriteria, search: '0025' })).toBe(true);
    });

    it('should require all selected types (AND)', () => {
      const criteria = { ...emptyCriteria, types: [PokemonType.Fire, PokemonType.Flying] };

      expect(matchesFilters(charizard, criteria)).toBe(true);
      expect(matchesFilters(pikachu, criteria)).toBe(false);
    });

    it('should exclude Pokémon without loaded rarity when a rarity filter is active', () => {
      const criteria = { ...emptyCriteria, categories: [RarityCategory.Legendary] };

      expect(matchesFilters(moltres, criteria)).toBe(true);
      expect(matchesFilters(charizard, criteria)).toBe(false);
    });
  });

  describe('filterAndSort', () => {
    it('should sort by number ascending by default', () => {
      const result = filterAndSort({
        list: [pikachu, charizard, moltres],
        criteria: emptyCriteria,
        sort: SortOption.NumberAsc,
      });

      expect(result.map((p) => p.id)).toEqual([6, 25, 146]);
    });

    it('should sort by name descending', () => {
      const result = filterAndSort({
        list: [charizard, pikachu, moltres],
        criteria: emptyCriteria,
        sort: SortOption.NameDesc,
      });

      expect(result.map((p) => p.name)).toEqual(['pikachu', 'moltres', 'charizard']);
    });
  });
});
