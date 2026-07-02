import { PokemonType } from './pokemon-type.enum';
import { RarityCategory } from './rarity-category.enum';
import { RarityTier } from './rarity-tier.enum';
import { SortOption } from './sort-option.enum';

/** The set of filters/ordering applied to the Pokédex list. */
export class PokemonFilterCriteria {
  constructor(
    public search = '',
    public sort: SortOption = SortOption.NUMBER_ASC,
    public types: PokemonType[] = [],
    public rarityCategories: RarityCategory[] = [],
    public rarityTiers: RarityTier[] = [],
  ) {}
}
