import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

import { PokemonListItem } from '../../../core/pokedex/pokedex-store.service';
import { RarityCategory, RarityInfo, RARITY_CATEGORY_LABELS } from '../../../core/pokedex/rarity';
import {
  formatDexNumber,
  formatName,
  officialArtworkUrl,
  spriteUrl,
} from '../../../core/pokedex/sprites';
import { getTypeColor } from '../../../shared/type-color';
import { TypeChip } from '../../../shared/type-chip/type-chip';

const CATEGORY_BADGE_COLORS: Record<Exclude<RarityCategory, 'normal'>, string> = {
  legendary: '#b8860b',
  mythical: '#7b3fb3',
  baby: '#0f8a8a',
};

/** A single Pokémon tile linking to its detail page. */
@Component({
  selector: 'app-pokemon-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule, TypeChip],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss',
})
export class PokemonCard {
  readonly item = input.required<PokemonListItem>();
  readonly rarity = input<RarityInfo | undefined>(undefined);

  protected readonly dexNumber = computed(() => formatDexNumber(this.item().id));
  protected readonly displayName = computed(() => formatName(this.item().name));
  protected readonly accent = computed(() => {
    const primary = this.item().types[0];
    return primary ? getTypeColor(primary).background : 'var(--mat-sys-outline-variant)';
  });

  protected readonly categoryBadge = computed(() => {
    const category = this.rarity()?.category;
    if (!category || category === 'normal') return null;
    return { label: RARITY_CATEGORY_LABELS[category], color: CATEGORY_BADGE_COLORS[category] };
  });

  // Resets to the artwork URL whenever the item changes, then degrades on error.
  protected readonly imgSrc = linkedSignal(() => officialArtworkUrl(this.item().id));
  private readonly stage = linkedSignal(() => {
    this.item();
    return 0;
  });

  protected onImageError(): void {
    if (this.stage() === 0) {
      this.imgSrc.set(spriteUrl(this.item().id));
      this.stage.set(1);
    } else {
      this.imgSrc.set('');
      this.stage.set(2);
    }
  }
}
