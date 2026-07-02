import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { PokemonSummary } from '../../models/pokemon-summary.model';
import { Rarity } from '../../models/rarity.model';
import { TypePalette } from '../../models/type-palette.model';
import { SpriteUrl } from '../../models/sprite-url.model';
import { TypeChip } from '../type-chip/type-chip';
import { RarityBadge } from '../rarity-badge/rarity-badge';

/** Clickable Pokédex card: type-colored gradient background, artwork, number, name, chips. */
@Component({
  selector: 'app-pokemon-card',
  imports: [RouterLink, NgOptimizedImage, MatCardModule, TypeChip, RarityBadge],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCard {
  readonly summary = input.required<PokemonSummary>();
  readonly rarity = input<Rarity | undefined>(undefined);

  private readonly fallback = signal(false);

  readonly background = computed(() => TypePalette.cardBackground(this.summary().types));
  readonly imageUrl = computed(() =>
    this.fallback() ? SpriteUrl.fallback(this.summary().id) : SpriteUrl.artwork(this.summary().id),
  );
  readonly numberLabel = computed(() => `#${String(this.summary().id).padStart(4, '0')}`);
  readonly name = computed(() => this.summary().name);

  onImageError(): void {
    if (!this.fallback()) {
      this.fallback.set(true);
    }
  }
}
