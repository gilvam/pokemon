import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

import { PokemonRarity } from '../../models/pokemon-rarity.model';
import { RarityCategory } from '../../models/rarity-category.enum';
import { RARITY_CATEGORY_LABELS, RARITY_TIER_LABELS } from '../../utils/pokedex-labels';

const CATEGORY_ICON: Record<RarityCategory, string> = {
  [RarityCategory.Normal]: '',
  [RarityCategory.Baby]: 'child_care',
  [RarityCategory.Legendary]: 'workspace_premium',
  [RarityCategory.Mythical]: 'auto_awesome',
};

/** Shows a Pokémon's rarity category (when special) and capture-rate tier. */
@Component({
  selector: 'app-rarity-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatChipsModule, MatIconModule],
  template: `
    @if (rarity(); as value) {
      <mat-chip-set aria-label="Raridade">
        @if (categoryIcon()) {
          <mat-chip [class]="'rarity-badge__category rarity-badge__category--' + value.category" highlighted>
            <mat-icon matChipAvatar aria-hidden="true">{{ categoryIcon() }}</mat-icon>
            {{ categoryLabel() }}
          </mat-chip>
        }
        <mat-chip>{{ tierLabel() }}</mat-chip>
      </mat-chip-set>
    }
  `,
  styles: `
    .rarity-badge__category--legendary {
      --mdc-chip-elevated-container-color: #f7c948;
      --mdc-chip-label-text-color: #3d2c00;
      --mdc-chip-with-avatar-avatar-color: #3d2c00;
    }
    .rarity-badge__category--mythical {
      --mdc-chip-elevated-container-color: #c08cf2;
      --mdc-chip-label-text-color: #2a0a45;
      --mdc-chip-with-avatar-avatar-color: #2a0a45;
    }
    .rarity-badge__category--baby {
      --mdc-chip-elevated-container-color: #ffc2d1;
      --mdc-chip-label-text-color: #5c1026;
      --mdc-chip-with-avatar-avatar-color: #5c1026;
    }
  `,
})
export class RarityBadge {
  readonly rarity = input<PokemonRarity | undefined>(undefined);

  protected readonly categoryIcon = computed(() => {
    const value = this.rarity();
    return value ? CATEGORY_ICON[value.category] : '';
  });
  protected readonly categoryLabel = computed(() => {
    const value = this.rarity();
    return value ? RARITY_CATEGORY_LABELS[value.category] : '';
  });
  protected readonly tierLabel = computed(() => {
    const value = this.rarity();
    return value ? RARITY_TIER_LABELS[value.tier] : '';
  });
}
