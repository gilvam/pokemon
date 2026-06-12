import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Rarity } from '../../models/rarity.model';
import { RarityCategory } from '../../models/rarity-category.enum';
import { RarityLabel } from '../../models/rarity-label.model';

/** Shows a Pokémon's rarity as up to two accessible badges (category + capture-rate tier). */
@Component({
  selector: 'app-rarity-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (showCategory()) {
      <span class="rarity-badge" [class]="categoryClass()">{{ categoryLabel() }}</span>
    }
    <span class="rarity-badge" [class]="tierClass()">{{ tierLabel() }}</span>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .rarity-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: #1f2937;
    }
    .rarity-baby {
      background: #fbcfe8;
    }
    .rarity-legendary {
      background: #fde68a;
    }
    .rarity-mythical {
      background: #e9d5ff;
    }
    .rarity-common {
      background: #e5e7eb;
    }
    .rarity-uncommon {
      background: #cdeeb6;
    }
    .rarity-rare {
      background: #bcdcff;
    }
    .rarity-very-rare {
      background: #f9d3e3;
    }
  `,
})
export class RarityBadge {
  readonly rarity = input.required<Rarity>();
  readonly showCategory = computed(() => this.rarity().category !== RarityCategory.NORMAL);
  readonly categoryLabel = computed(() => RarityLabel.category(this.rarity().category));
  readonly tierLabel = computed(() => RarityLabel.tier(this.rarity().tier));
  readonly categoryClass = computed(() => `rarity-badge rarity-${this.rarity().category}`);
  readonly tierClass = computed(() => `rarity-badge rarity-${this.rarity().tier}`);
}
