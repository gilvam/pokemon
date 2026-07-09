import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { catchError, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { Pokemon, PokemonListItem } from '../models/pokemon.models';
import { PokemonApiService } from '../services/pokemon-api.service';
import {
  formatHeight,
  formatPokedexNumber,
  formatSlug,
  formatWeight,
  spriteUrl,
} from '../utils/pokemon.utils';
import { StatBar } from '../shared/stat-bar/stat-bar';
import { TypeBadge } from '../shared/type-badge/type-badge';

const PLACEHOLDER_SPRITE = '/pokeball-placeholder.svg';

interface DetailState {
  status: 'loading' | 'error' | 'success';
  pokemon: Pokemon | null;
  flavorText: string | null;
  flavorLoading: boolean;
}

const LOADING_STATE: DetailState = {
  status: 'loading',
  pokemon: null,
  flavorText: null,
  flavorLoading: false,
};

@Component({
  selector: 'app-pokemon-detail',
  imports: [RouterLink, TypeBadge, StatBar],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(PokemonApiService);
  private readonly titleService = inject(Title);

  protected readonly formatSlug = formatSlug;
  protected readonly formatPokedexNumber = formatPokedexNumber;
  protected readonly formatHeight = formatHeight;
  protected readonly formatWeight = formatWeight;

  protected readonly state = toSignal(
    this.route.paramMap.pipe(
      map((params) => (params.get('name') ?? '').toLowerCase().trim()),
      distinctUntilChanged(),
      switchMap((name) =>
        this.api.getPokemonByName(name).pipe(
          switchMap((pokemon) =>
            this.api.getSpeciesFlavorText(pokemon.species.name).pipe(
              map((flavorText): DetailState => ({
                status: 'success',
                pokemon,
                flavorText,
                flavorLoading: false,
              })),
              startWith<DetailState>({
                status: 'success',
                pokemon,
                flavorText: null,
                flavorLoading: true,
              }),
              catchError(() =>
                of<DetailState>({
                  status: 'success',
                  pokemon,
                  flavorText: null,
                  flavorLoading: false,
                }),
              ),
            ),
          ),
          catchError(() =>
            of<DetailState>({
              status: 'error',
              pokemon: null,
              flavorText: null,
              flavorLoading: false,
            }),
          ),
          startWith(LOADING_STATE),
        ),
      ),
    ),
    { initialValue: LOADING_STATE },
  );

  protected readonly allPokemon = toSignal(this.api.getAllPokemon(), {
    initialValue: [] as PokemonListItem[],
  });

  protected readonly neighbors = computed(() => {
    const pokemon = this.state().pokemon;
    const list = this.allPokemon();
    const empty = { prev: null as PokemonListItem | null, next: null as PokemonListItem | null };
    if (!pokemon || list.length === 0) {
      return empty;
    }
    const index = list.findIndex((item) => item.id === pokemon.id);
    if (index === -1) {
      return empty;
    }
    return {
      prev: index > 0 ? list[index - 1] : null,
      next: index < list.length - 1 ? list[index + 1] : null,
    };
  });

  protected readonly totalStats = computed(
    () => this.state().pokemon?.stats.reduce((sum, stat) => sum + stat.base_stat, 0) ?? 0,
  );

  private readonly imageIndex = linkedSignal({
    source: () => this.state().pokemon?.id,
    computation: () => 0,
  });

  protected readonly imageCandidates = computed<string[]>(() => {
    const pokemon = this.state().pokemon;
    if (!pokemon) {
      return [PLACEHOLDER_SPRITE];
    }
    const artwork = pokemon.sprites.other?.['official-artwork']?.front_default;
    const sprite = pokemon.sprites.front_default ?? spriteUrl(pokemon.id);
    const candidates = [artwork, sprite, PLACEHOLDER_SPRITE].filter((url): url is string => !!url);
    return candidates.length > 0 ? candidates : [PLACEHOLDER_SPRITE];
  });

  protected readonly imageSrc = computed(() => {
    const candidates = this.imageCandidates();
    return candidates[Math.min(this.imageIndex(), candidates.length - 1)];
  });

  constructor() {
    effect(() => {
      const pokemon = this.state().pokemon;
      this.titleService.setTitle(
        pokemon
          ? `${formatSlug(pokemon.name)} ${formatPokedexNumber(pokemon.id)} · Pokédex`
          : 'Pokédex',
      );
    });
  }

  protected onImageError(): void {
    this.imageIndex.update((index) => Math.min(index + 1, this.imageCandidates().length - 1));
  }
}
