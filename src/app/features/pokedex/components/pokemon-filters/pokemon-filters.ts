import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { PokedexFilterForm } from './pokedex-filter-form';
import { POKEMON_TYPES } from '../../models/pokemon-type.enum';
import { RARITY_CATEGORIES } from '../../models/rarity-category.enum';
import { RARITY_TIERS } from '../../models/rarity-tier.enum';
import { SortOption } from '../../models/sort-option.enum';
import {
  RARITY_CATEGORY_LABELS,
  RARITY_TIER_LABELS,
  SORT_LABELS,
  TYPE_LABELS,
} from '../../utils/pokedex-labels';

/** Presentational filter bar bound to a parent-owned typed reactive form. */
@Component({
  selector: 'app-pokemon-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './pokemon-filters.html',
  styleUrl: './pokemon-filters.scss',
})
export class PokemonFilters {
  readonly form = input.required<PokedexFilterForm>();
  readonly clearFilters = output<void>();

  protected readonly types = POKEMON_TYPES;
  protected readonly categories = RARITY_CATEGORIES;
  protected readonly tiers = RARITY_TIERS;
  protected readonly sortOptions = Object.values(SortOption);

  protected readonly typeLabels = TYPE_LABELS;
  protected readonly categoryLabels = RARITY_CATEGORY_LABELS;
  protected readonly tierLabels = RARITY_TIER_LABELS;
  protected readonly sortLabels = SORT_LABELS;
}
