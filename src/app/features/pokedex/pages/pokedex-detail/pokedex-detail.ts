import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';

import { HttpPokeapiService } from '../../services/http/http-pokeapi/http-pokeapi.service';
import { PokemonDto } from '../../services/http/http-pokeapi/models/pokemon.dto';
import { PokemonSpeciesDto } from '../../services/http/http-pokeapi/models/pokemon-species.dto';
import { EvolutionChainResponseDto } from '../../services/http/http-pokeapi/models/evolution-chain-response.dto';
import { TypeChip } from '../../components/type-chip/type-chip';
import { RarityBadge } from '../../components/rarity-badge/rarity-badge';
import { StatBar } from '../../components/stat-bar/stat-bar';
import { getCardBackground, CARD_TEXT_COLOR } from '../../utils/type-color';
import { buildArtworkUrl } from '../../utils/sprites';
import { extractIdFromUrl, formatPokedexNumber } from '../../utils/pokemon-id';
import { toPokemonTypes } from '../../utils/type-name';
import { resolveRarity } from '../../utils/rarity';
import { flattenEvolution } from '../../utils/evolution';
import { STAT_LABELS } from '../../utils/pokedex-labels';

const NOT_FOUND_STATUS = 404;
const ENGLISH = 'en';

type DetailStatus = 'loading' | 'ready' | 'notfound' | 'error';

interface IDetailData {
  pokemon: PokemonDto;
  species: PokemonSpeciesDto;
  evolution: EvolutionChainResponseDto;
}

@Component({
  selector: 'app-pokedex-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatListModule,
    MatTabsModule,
    TypeChip,
    RarityBadge,
    StatBar,
  ],
  templateUrl: './pokedex-detail.html',
  styleUrl: './pokedex-detail.scss',
})
export class PokedexDetail implements OnInit {
  private readonly api = inject(HttpPokeapiService);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly cardTextColor = CARD_TEXT_COLOR;
  protected readonly status = signal<DetailStatus>('loading');

  private readonly pokemon = signal<PokemonDto | null>(null);
  private readonly species = signal<PokemonSpeciesDto | null>(null);

  protected readonly types = computed(() => {
    const value = this.pokemon();
    if (!value) {
      return [];
    }
    const names = [...value.types]
      .sort((a, b) => a.slot - b.slot)
      .map((slot) => slot.type.name);
    return toPokemonTypes(names);
  });

  protected readonly headerBackground = computed(() => getCardBackground(this.types()));
  protected readonly pokedexNumber = computed(() => formatPokedexNumber(this.pokemon()?.id ?? 0));
  protected readonly artwork = computed(() => buildArtworkUrl(this.pokemon()?.id ?? 0));

  protected readonly rarity = computed(() => {
    const value = this.species();
    if (!value) {
      return undefined;
    }
    return resolveRarity({
      isBaby: value.isBaby,
      isLegendary: value.isLegendary,
      isMythical: value.isMythical,
      captureRate: value.captureRate,
    });
  });

  protected readonly stats = computed(() =>
    (this.pokemon()?.stats ?? []).map((stat) => ({
      label: STAT_LABELS[stat.stat.name] ?? stat.stat.name,
      value: stat.baseStat,
    })),
  );

  protected readonly statTotal = computed(() =>
    this.stats().reduce((total, stat) => total + stat.value, 0),
  );

  protected readonly abilities = computed(() =>
    (this.pokemon()?.abilities ?? []).map((ability) => ({
      name: ability.ability.name,
      hidden: ability.isHidden,
    })),
  );

  protected readonly moves = computed(() =>
    (this.pokemon()?.moves ?? []).map((move) => move.move.name).sort((a, b) => a.localeCompare(b)),
  );

  protected readonly genus = computed(
    () => this.species()?.genera.find((entry) => entry.language.name === ENGLISH)?.genus ?? '',
  );

  protected readonly flavorText = computed(() => {
    const entry = this.species()?.flavorTextEntries.find((item) => item.language.name === ENGLISH);
    return (entry?.flavorText ?? '').replace(/[\n\f\r]+/g, ' ').trim();
  });

  protected readonly evolution = signal<ReturnType<typeof flattenEvolution>>([]);

  protected readonly sprites = computed(() => {
    const value = this.pokemon()?.sprites;
    if (!value) {
      return [];
    }
    return [
      { label: 'Frente', url: value.frontDefault },
      { label: 'Costas', url: value.backDefault },
      { label: 'Frente shiny', url: value.frontShiny },
      { label: 'Costas shiny', url: value.backShiny },
    ].filter((sprite) => sprite.url.length > 0);
  });

  protected readonly cry = computed(() => this.pokemon()?.cries.latest ?? '');
  protected readonly height = computed(() => (this.pokemon()?.height ?? 0) / 10);
  protected readonly weight = computed(() => (this.pokemon()?.weight ?? 0) / 10);
  protected readonly name = computed(() => this.pokemon()?.name ?? '');
  protected readonly baseExperience = computed(() => this.pokemon()?.baseExperience ?? 0);
  protected readonly captureRate = computed(() => this.species()?.captureRate ?? 0);
  protected readonly baseHappiness = computed(() => this.species()?.baseHappiness ?? 0);
  protected readonly growthRate = computed(() => this.species()?.growthRate.name ?? '');
  protected readonly habitat = computed(() => this.species()?.habitat.name ?? '');
  protected readonly eggGroups = computed(() =>
    (this.species()?.eggGroups ?? []).map((group) => group.name),
  );

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id') ?? ''),
        tap(() => this.status.set('loading')),
        switchMap((id) => this.load(id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => this.apply(result));
  }

  protected goBack(): void {
    this.location.back();
  }

  protected artworkFor(id: number): string {
    return buildArtworkUrl(id);
  }

  protected idFromSpeciesUrl(url: string): number {
    return extractIdFromUrl(url);
  }

  private load(id: string): Observable<IDetailData | DetailStatus> {
    return this.api.getPokemon(id).pipe(
      switchMap((pokemon) =>
        this.api.getSpecies(pokemon.id).pipe(
          switchMap((species) => {
            const chainId = extractIdFromUrl(species.evolutionChain.url);
            const chain$ = chainId
              ? this.api.getEvolutionChain(chainId)
              : of(new EvolutionChainResponseDto());
            return chain$.pipe(map((evolution) => ({ pokemon, species, evolution })));
          }),
        ),
      ),
      catchError((error: HttpErrorResponse) =>
        of<DetailStatus>(NOT_FOUND_STATUS === error.status ? 'notfound' : 'error'),
      ),
    );
  }

  private apply(result: IDetailData | DetailStatus): void {
    if ('notfound' === result || 'error' === result || 'loading' === result || 'ready' === result) {
      this.status.set(result);
      return;
    }
    this.pokemon.set(result.pokemon);
    this.species.set(result.species);
    this.evolution.set(flattenEvolution(result.evolution.chain));
    this.status.set('ready');
  }
}
