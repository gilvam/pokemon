import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonSummary } from '../../models/pokemon-summary.model';
import { TypePalette } from '../../models/type-palette.model';
import { SpriteUrl } from '../../models/sprite-url.model';

/** Clickable Pokédex card: pastel gradient background by type, artwork, number and name. */
@Component({
  selector: 'app-pokemon-card',
  imports: [RouterLink],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCard {
  readonly summary = input.required<PokemonSummary>();

  private readonly fallback = signal(false);

  protected readonly background = computed(() => TypePalette.cardBackground(this.summary().types));
  protected readonly imageUrl = computed(() =>
    this.fallback() ? SpriteUrl.fallback(this.summary().id) : SpriteUrl.artwork(this.summary().id),
  );
  protected readonly numberLabel = computed(() => `#${String(this.summary().id).padStart(4, '0')}`);
  protected readonly name = computed(() => this.summary().name);

  protected onImageError(): void {
    if (!this.fallback()) {
      this.fallback.set(true);
    }
  }
}
