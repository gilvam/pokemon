import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonListItem } from '../../models/pokemon.models';
import { formatPokedexNumber, formatSlug, spriteUrl } from '../../utils/pokemon.utils';

const PLACEHOLDER_SPRITE = '/pokeball-placeholder.svg';

@Component({
  selector: 'app-pokemon-card',
  imports: [RouterLink],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonCard {
  readonly pokemon = input.required<PokemonListItem>();

  private readonly errored = signal(false);

  protected readonly displayName = computed(() => formatSlug(this.pokemon().name));
  protected readonly pokedexNumber = computed(() => formatPokedexNumber(this.pokemon().id));
  protected readonly imageSrc = computed(() =>
    this.errored() ? PLACEHOLDER_SPRITE : spriteUrl(this.pokemon().id),
  );

  protected onImageError(): void {
    this.errored.set(true);
  }
}
