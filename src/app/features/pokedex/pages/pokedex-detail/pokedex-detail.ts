import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Location, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { catchError, forkJoin, map, Observable, of, startWith, switchMap } from 'rxjs';
import { HttpPokeapiService } from '../../services/http/http-pokeapi/http-pokeapi.service';
import { PokemonDto } from '../../services/http/http-pokeapi/models/pokemon.dto';
import { PokemonSpeciesDto } from '../../services/http/http-pokeapi/models/pokemon-species.dto';
import { EvolutionChainDto } from '../../services/http/http-pokeapi/models/evolution-chain.dto';
import { EvolutionLinkDto } from '../../services/http/http-pokeapi/models/evolution-link.dto';
import { PokemonType } from '../../models/pokemon-type.enum';
import { Rarity } from '../../models/rarity.model';
import { TypePalette } from '../../models/type-palette.model';
import { SpriteUrl } from '../../models/sprite-url.model';
import { ResourceId } from '../../models/resource-id.model';
import { StatLabel } from '../../models/stat-label.model';
import { EvolutionStep } from '../../models/evolution-step.model';
import { TypeChip } from '../../components/type-chip/type-chip';
import { RarityBadge } from '../../components/rarity-badge/rarity-badge';
import { StatBar } from '../../components/stat-bar/stat-bar';
import { IPokedexDetailState } from './pokedex-detail-state.interface';

/** Smart detail page: composes pokemon + species + evolution into one rich view. */
@Component({
  selector: 'app-pokedex-detail',
  imports: [
    NgOptimizedImage,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    TypeChip,
    RarityBadge,
    StatBar,
  ],
  templateUrl: './pokedex-detail.html',
  styleUrl: './pokedex-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokedexDetail {
  private readonly api = inject(HttpPokeapiService);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);

  private readonly state = toSignal(
    this.route.paramMap.pipe(
      switchMap((params) => this.loadDetail(this.parseId(params.get('id')))),
    ),
    { initialValue: { status: 'loading', data: null } satisfies IPokedexDetailState },
  );

  protected readonly data = computed(() => this.state().data);
  protected readonly isLoading = computed(() => this.state().status === 'loading');
  protected readonly isError = computed(() => this.state().status === 'error');

  goBack(): void {
    this.location.back();
  }

  protected types(pokemon: PokemonDto): PokemonType[] {
    return [...pokemon.types]
      .sort((left, right) => left.slot - right.slot)
      .map((slot) => slot.type.name as PokemonType);
  }

  protected headerBackground(pokemon: PokemonDto): string {
    return TypePalette.cardBackground(this.types(pokemon));
  }

  protected numberLabel(id: number): string {
    return `#${String(id).padStart(4, '0')}`;
  }

  protected artwork(id: number): string {
    return SpriteUrl.artwork(id);
  }

  protected rarity(species: PokemonSpeciesDto): Rarity {
    return Rarity.fromSpecies(
      {
        isBaby: species.isBaby,
        isLegendary: species.isLegendary,
        isMythical: species.isMythical,
      },
      species.captureRate,
    );
  }

  protected genus(species: PokemonSpeciesDto): string {
    return species.genera.find((entry) => entry.language.name === 'en')?.genus ?? '';
  }

  protected flavor(species: PokemonSpeciesDto): string {
    const entry = species.flavorTextEntries.find((item) => item.language.name === 'en');
    return entry ? entry.flavorText.replace(/[\n\f\r]+/g, ' ').trim() : '';
  }

  protected statLabel(name: string): string {
    return StatLabel.pt(name);
  }

  protected eggGroups(species: PokemonSpeciesDto): string {
    const names = species.eggGroups.map((group) => this.humanize(group.name));
    return names.length > 0 ? names.join(', ') : '—';
  }

  protected humanize(value: string): string {
    return value.replace(/-/g, ' ');
  }

  protected statTotal(pokemon: PokemonDto): number {
    return pokemon.stats.reduce((sum, stat) => sum + stat.baseStat, 0);
  }

  protected heightMeters(pokemon: PokemonDto): string {
    return `${(pokemon.height / 10).toFixed(1)} m`;
  }

  protected weightKg(pokemon: PokemonDto): string {
    return `${(pokemon.weight / 10).toFixed(1)} kg`;
  }

  protected sprites(pokemon: PokemonDto): { label: string; url: string }[] {
    return [
      { label: 'Frente', url: pokemon.sprites.frontDefault },
      { label: 'Costas', url: pokemon.sprites.backDefault },
      { label: 'Frente shiny', url: pokemon.sprites.frontShiny },
      { label: 'Costas shiny', url: pokemon.sprites.backShiny },
    ].filter((sprite) => sprite.url.length > 0);
  }

  protected evolutionSteps(evolution: EvolutionChainDto): EvolutionStep[] {
    return this.flatten(evolution.chain, []);
  }

  private flatten(link: EvolutionLinkDto, accumulator: EvolutionStep[]): EvolutionStep[] {
    const id = ResourceId.fromUrl(link.species.url);
    if (id > 0) {
      accumulator.push(new EvolutionStep(id, link.species.name));
    }
    link.evolvesTo.forEach((child) => this.flatten(child, accumulator));
    return accumulator;
  }

  private parseId(value: string | null): number {
    const id = Number(value);
    return Number.isInteger(id) && id > 0 ? id : 0;
  }

  private loadDetail(id: number): Observable<IPokedexDetailState> {
    if (id <= 0) {
      return of<IPokedexDetailState>({ status: 'error', data: null });
    }
    return forkJoin({
      pokemon: this.api.getPokemon(id),
      species: this.api.getSpecies(id),
    }).pipe(
      switchMap(({ pokemon, species }) => {
        const chainId = ResourceId.fromUrl(species.evolutionChain.url);
        const evolution$ =
          chainId > 0
            ? this.api
                .getEvolutionChain(chainId)
                .pipe(catchError(() => of(new EvolutionChainDto())))
            : of(new EvolutionChainDto());
        return evolution$.pipe(
          map(
            (evolution): IPokedexDetailState => ({
              status: 'ready',
              data: { pokemon, species, evolution },
            }),
          ),
        );
      }),
      catchError(() => of<IPokedexDetailState>({ status: 'error', data: null })),
      startWith<IPokedexDetailState>({ status: 'loading', data: null }),
    );
  }
}
