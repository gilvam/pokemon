import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonListItem } from '../../models/pokemon.models';

@Component({
  selector: 'app-pokemon-card',
  imports: [RouterLink],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.scss'
})
export class PokemonCard {
  readonly pokemon = input.required<PokemonListItem>();

  protected spriteUrl(id: number): string {
    return `/media/sprites/pokemon/${id}.png`;
  }

  protected formattedId(id: number): string {
    return `#${String(id).padStart(3, '0')}`;
  }
}
