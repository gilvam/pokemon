import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PokemonType } from '../../models/pokemon-type.enum';
import { RarityCategory } from '../../models/rarity-category.enum';
import { RarityTier } from '../../models/rarity-tier.enum';
import { SortOption } from '../../models/sort-option.enum';
import { TypePalette } from '../../models/type-palette.model';
import { TypeLabel } from '../../models/type-label.model';
import { RarityLabel } from '../../models/rarity-label.model';
import { SortLabel } from '../../models/sort-label.model';
import { PokemonFilterForm } from './pokemon-filter-form.type';

/** Presentational filter bar: renders Material controls bound to a typed reactive form. */
@Component({
  selector: 'app-pokemon-filters',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonFilters {
  readonly form = input.required<PokemonFilterForm>();
  readonly clear = output<void>();

  protected readonly sortOptions: SortOption[] = Object.values(SortOption);
  protected readonly typeOptions: PokemonType[] = TypePalette.all();
  protected readonly categoryOptions: RarityCategory[] = Object.values(RarityCategory);
  protected readonly tierOptions: RarityTier[] = Object.values(RarityTier);

  protected sortLabel(sort: SortOption): string {
    return SortLabel.pt(sort);
  }

  protected typeLabel(type: PokemonType): string {
    return TypeLabel.pt(type);
  }

  protected categoryLabel(category: RarityCategory): string {
    return RarityLabel.category(category);
  }

  protected tierLabel(tier: RarityTier): string {
    return RarityLabel.tier(tier);
  }
}
