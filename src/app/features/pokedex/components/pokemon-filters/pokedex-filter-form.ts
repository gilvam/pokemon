import { FormControl, FormGroup } from '@angular/forms';
import { PokemonType } from '../../models/pokemon-type.enum';
import { RarityCategory } from '../../models/rarity-category.enum';
import { RarityTier } from '../../models/rarity-tier.enum';
import { SortOption } from '../../models/sort-option.enum';

/** Typed reactive form backing the Pokédex filter bar. */
export type PokedexFilterForm = FormGroup<{
  search: FormControl<string>;
  sort: FormControl<SortOption>;
  types: FormControl<PokemonType[]>;
  categories: FormControl<RarityCategory[]>;
  tiers: FormControl<RarityTier[]>;
}>;
