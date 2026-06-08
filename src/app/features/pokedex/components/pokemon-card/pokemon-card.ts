import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { PokemonSummary } from '../../models/pokemon-summary.model';
import { TypeChip } from '../type-chip/type-chip';
import { RarityBadge } from '../rarity-badge/rarity-badge';
import { CARD_TEXT_COLOR, getCardBackground } from '../../utils/type-color';
import { buildArtworkUrl, buildSpriteFallbackUrl } from '../../utils/sprites';
import { formatPokedexNumber } from '../../utils/pokemon-id';

const IMAGE_SIZE = 200;

/** Grid card for a Pokémon, with a soft gradient background from its type(s). */
@Component({
  selector: 'app-pokemon-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatCardModule, TypeChip, RarityBadge],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss',
})
export class PokemonCard {
  readonly pokemon = input.required<PokemonSummary>();

  protected readonly imageSize = IMAGE_SIZE;
  protected readonly cardTextColor = CARD_TEXT_COLOR;

  private readonly imageFailed = signal(false);

  protected readonly background = computed(() => getCardBackground(this.pokemon().types));
  protected readonly pokedexNumber = computed(() => formatPokedexNumber(this.pokemon().id));
  protected readonly imageSrc = computed(() =>
    this.imageFailed() ? buildSpriteFallbackUrl(this.pokemon().id) : buildArtworkUrl(this.pokemon().id),
  );
  protected readonly ariaLabel = computed(
    () => `${this.pokemon().name}, ${this.pokedexNumber()} — ver detalhes`,
  );

  protected onImageError(): void {
    this.imageFailed.set(true);
  }
}
