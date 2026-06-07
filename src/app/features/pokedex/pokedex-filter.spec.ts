import { PokemonListItem } from '../../core/pokedex/pokedex-store.service';
import { RarityInfo } from '../../core/pokedex/rarity';
import { applyFilters, DEFAULT_CRITERIA, FilterCriteria, needsRarityIndex } from './pokedex-filter';

const items: PokemonListItem[] = [
  { id: 4, name: 'charmander', types: ['fire'] },
  { id: 6, name: 'charizard', types: ['fire', 'flying'] },
  { id: 7, name: 'squirtle', types: ['water'] },
  { id: 25, name: 'pikachu', types: ['electric'] },
];

const rarityMap = new Map<number, RarityInfo>([
  [6, { category: 'legendary', captureTier: 'rare', captureRate: 45 }],
  [25, { category: 'normal', captureTier: 'common', captureRate: 190 }],
]);

function criteria(overrides: Partial<FilterCriteria>): FilterCriteria {
  return { ...DEFAULT_CRITERIA, ...overrides };
}

describe('applyFilters', () => {
  it('returns everything in dex order by default', () => {
    const result = applyFilters(items, DEFAULT_CRITERIA, rarityMap);
    expect(result.map((p) => p.id)).toEqual([4, 6, 7, 25]);
  });

  it('searches by name (accent/case insensitive) and by id', () => {
    expect(applyFilters(items, criteria({ search: 'CHAR' }), rarityMap).map((p) => p.name)).toEqual([
      'charmander',
      'charizard',
    ]);
    expect(applyFilters(items, criteria({ search: '25' }), rarityMap).map((p) => p.name)).toEqual([
      'pikachu',
    ]);
  });

  it('matches ALL selected types (AND semantics)', () => {
    expect(
      applyFilters(items, criteria({ types: ['fire', 'flying'] }), rarityMap).map((p) => p.id),
    ).toEqual([6]);
    expect(applyFilters(items, criteria({ types: ['fire'] }), rarityMap).map((p) => p.id)).toEqual([
      4, 6,
    ]);
  });

  it('filters by rarity category, excluding items without rarity data', () => {
    expect(
      applyFilters(items, criteria({ categories: ['legendary'] }), rarityMap).map((p) => p.id),
    ).toEqual([6]);
  });

  it('filters by capture tier', () => {
    expect(
      applyFilters(items, criteria({ tiers: ['common'] }), rarityMap).map((p) => p.id),
    ).toEqual([25]);
  });

  it('sorts by name descending', () => {
    expect(applyFilters(items, criteria({ sort: 'name-desc' }), rarityMap).map((p) => p.name)).toEqual(
      ['squirtle', 'pikachu', 'charmander', 'charizard'],
    );
  });

  it('sorts by number descending', () => {
    expect(
      applyFilters(items, criteria({ sort: 'number-desc' }), rarityMap).map((p) => p.id),
    ).toEqual([25, 7, 6, 4]);
  });
});

describe('needsRarityIndex', () => {
  it('is false when no rarity filter is active', () => {
    expect(needsRarityIndex(DEFAULT_CRITERIA)).toBe(false);
  });

  it('is true when a category or tier is selected', () => {
    expect(needsRarityIndex(criteria({ categories: ['mythical'] }))).toBe(true);
    expect(needsRarityIndex(criteria({ tiers: ['rare'] }))).toBe(true);
  });
});
