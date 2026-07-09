import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { switchMap, catchError, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { PokemonApiService } from '../services/pokemon-api.service';
import { Pokemon } from '../models/pokemon.models';

const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD'
};

const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Ataque Esp.',
  'special-defense': 'Defesa Esp.',
  speed: 'Velocidade'
};

@Component({
  selector: 'app-pokemon-detail',
  imports: [RouterLink],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.scss'
})
export class PokemonDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(PokemonApiService);

  protected readonly notFound = signal(false);

  protected readonly pokemon = toSignal<Pokemon | null>(
    this.route.paramMap.pipe(
      switchMap((params) => {
        this.notFound.set(false);
        const name = params.get('name') ?? '';
        return this.api.getPokemonByName(name).pipe(
          catchError(() => {
            this.notFound.set(true);
            return of(null);
          })
        );
      })
    ),
    { initialValue: null }
  );

  protected typeColor(typeName: string): string {
    return TYPE_COLORS[typeName] ?? '#777';
  }

  protected statLabel(statName: string): string {
    return STAT_LABELS[statName] ?? statName;
  }

  protected statPercent(value: number): number {
    return Math.min(100, Math.round((value / 255) * 100));
  }

  protected artworkUrl(pokemon: Pokemon): string {
    return (
      pokemon.sprites.other?.['official-artwork']?.front_default ??
      pokemon.sprites.front_default ??
      `/media/sprites/pokemon/${pokemon.id}.png`
    );
  }

  protected formattedId(id: number): string {
    return `#${String(id).padStart(3, '0')}`;
  }
}
