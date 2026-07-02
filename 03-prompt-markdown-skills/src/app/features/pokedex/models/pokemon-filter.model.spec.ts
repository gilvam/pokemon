import { PokemonFilter } from './pokemon-filter.model';
import { PokemonFilterCriteria } from './pokemon-filter-criteria.model';
import { PokemonSummary } from './pokemon-summary.model';
import { PokemonType } from './pokemon-type.enum';
import { Rarity } from './rarity.model';
import { RarityCategory } from './rarity-category.enum';
import { RarityTier } from './rarity-tier.enum';
import { SortOption } from './sort-option.enum';

const bulbasaur = new PokemonSummary(1, 'bulbasaur', [PokemonType.GRASS, PokemonType.POISON]);
const charmander = new PokemonSummary(4, 'charmander', [PokemonType.FIRE]);
const squirtle = new PokemonSummary(7, 'squirtle', [PokemonType.WATER]);
const gyarados = new PokemonSummary(130, 'gyarados', [PokemonType.WATER, PokemonType.FLYING]);

const all = [gyarados, charmander, bulbasaur, squirtle];

function criteria(overrides: Partial<PokemonFilterCriteria> = {}): PokemonFilterCriteria {
  return Object.assign(new PokemonFilterCriteria(), overrides);
}

describe('PokemonFilter.apply', () => {
  it('sorts by number ascending by default', () => {
    const result = PokemonFilter.apply(all, criteria(), new Map());

    expect(result.map((item) => item.id)).toEqual([1, 4, 7, 130]);
  });

  it('sorts by number descending', () => {
    const result = PokemonFilter.apply(all, criteria({ sort: SortOption.NUMBER_DESC }), new Map());

    expect(result.map((item) => item.id)).toEqual([130, 7, 4, 1]);
  });

  it('sorts by name ascending and descending', () => {
    const asc = PokemonFilter.apply(all, criteria({ sort: SortOption.NAME_ASC }), new Map());
    const desc = PokemonFilter.apply(all, criteria({ sort: SortOption.NAME_DESC }), new Map());

    expect(asc.map((item) => item.name)).toEqual([
      'bulbasaur',
      'charmander',
      'gyarados',
      'squirtle',
    ]);
    expect(desc.map((item) => item.name)).toEqual([
      'squirtle',
      'gyarados',
      'charmander',
      'bulbasaur',
    ]);
  });

  it('searches by name fragment', () => {
    const result = PokemonFilter.apply(all, criteria({ search: 'saur' }), new Map());

    expect(result.map((item) => item.id)).toEqual([1]);
  });

  it('searches by Pokédex number', () => {
    const result = PokemonFilter.apply(all, criteria({ search: '130' }), new Map());

    expect(result.map((item) => item.id)).toEqual([130]);
  });

  it('filters multiple types as an AND', () => {
    const result = PokemonFilter.apply(
      all,
      criteria({ types: [PokemonType.WATER, PokemonType.FLYING] }),
      new Map(),
    );

    expect(result.map((item) => item.id)).toEqual([130]);
  });

  it('excludes Pokémon whose rarity is not loaded yet when a rarity filter is active', () => {
    const rarityById = new Map<number, Rarity>([
      [4, new Rarity(RarityCategory.NORMAL, RarityTier.UNCOMMON)],
    ]);

    const result = PokemonFilter.apply(
      all,
      criteria({ rarityTiers: [RarityTier.UNCOMMON] }),
      rarityById,
    );

    expect(result.map((item) => item.id)).toEqual([4]);
  });

  it('combines category and tier rarity filters', () => {
    const rarityById = new Map<number, Rarity>([
      [1, new Rarity(RarityCategory.NORMAL, RarityTier.RARE)],
      [130, new Rarity(RarityCategory.LEGENDARY, RarityTier.RARE)],
    ]);

    const result = PokemonFilter.apply(
      all,
      criteria({ rarityCategories: [RarityCategory.LEGENDARY], rarityTiers: [RarityTier.RARE] }),
      rarityById,
    );

    expect(result.map((item) => item.id)).toEqual([130]);
  });
});
