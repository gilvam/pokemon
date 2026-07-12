import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { HttpPokemonService } from '../../services/http/http-pokemon/http-pokemon.service';
import { PokemonDto } from '../../services/http/http-pokemon/models/pokemon.dto';
import { PokemonSpeciesDto } from '../../services/http/http-pokemon/models/pokemon-species.dto';
import { EvolutionChainDto } from '../../services/http/http-pokemon/models/evolution-chain.dto';
import { EvolutionLinkDto } from '../../services/http/http-pokemon/models/evolution-link.dto';
import { PokemonType } from '../../models/pokemon-type.enum';
import { TypePalette } from '../../models/type-palette.model';
import { SpriteUrl } from '../../models/sprite-url.model';
import { SpriteView } from '../../models/sprite-view.model';
import { StatLabel } from '../../models/stat-label.model';
import { EvolutionStep } from '../../models/evolution-step.model';
import { ResourceId } from '../../models/resource-id.model';
import { StatBar } from '../../components/stat-bar/stat-bar';

/** Pokémon detail page: chains 3 httpResource() calls (pokemon → species → evolution). */
@Component({
  selector: 'app-pokemon-detail',
  imports: [RouterLink, StatBar],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonDetail {
  private readonly api = inject(HttpPokemonService);

  readonly id = input.required<string>();

  private readonly pokemonId = computed(() => Number(this.id()));

  protected readonly pokemon = httpResource(() => this.api.buildPokemonUrl(this.pokemonId()), {
    parse: (raw) => PokemonDto.create(raw as Partial<PokemonDto>),
  });

  /** Single guarded read of the resolved Pokémon, reused by every downstream computed below. */
  private readonly pokemonValue = computed<PokemonDto | undefined>(() =>
    this.pokemon.hasValue() ? this.pokemon.value() : undefined,
  );

  private readonly speciesId = computed(() => {
    const pokemon = this.pokemonValue();
    return pokemon ? ResourceId.fromUrl(pokemon.species.url) : 0;
  });

  protected readonly species = httpResource(
    () => (this.speciesId() > 0 ? this.api.buildSpeciesUrl(this.speciesId()) : undefined),
    { parse: (raw) => PokemonSpeciesDto.create(raw as Partial<PokemonSpeciesDto>) },
  );

  private readonly speciesValue = computed<PokemonSpeciesDto | undefined>(() =>
    this.species.hasValue() ? this.species.value() : undefined,
  );

  private readonly evolutionChainId = computed(() => {
    const species = this.speciesValue();
    return species ? ResourceId.fromUrl(species.evolutionChain.url) : 0;
  });

  protected readonly evolution = httpResource(
    () =>
      this.evolutionChainId() > 0 ? this.api.buildEvolutionChainUrl(this.evolutionChainId()) : undefined,
    { parse: (raw) => EvolutionChainDto.create(raw as Partial<EvolutionChainDto>) },
  );

  protected readonly types = computed<PokemonType[]>(() => {
    const pokemon = this.pokemonValue();
    if (!pokemon) {
      return [];
    }
    return [...pokemon.types]
      .sort((left, right) => left.slot - right.slot)
      .map((slot) => slot.type.name as PokemonType);
  });

  protected readonly background = computed(() => TypePalette.cardBackground(this.types()));

  protected readonly numberLabel = computed(() => {
    const pokemon = this.pokemonValue();
    return pokemon ? `#${String(pokemon.id).padStart(4, '0')}` : '';
  });

  protected readonly artworkUrl = computed(() => {
    const pokemon = this.pokemonValue();
    return pokemon ? SpriteUrl.artwork(pokemon.id) : '';
  });

  protected readonly genus = computed(() => {
    const species = this.speciesValue();
    return species?.genera.find((entry) => entry.language.name === 'en')?.genus ?? '';
  });

  protected readonly flavorText = computed(() => {
    const species = this.speciesValue();
    const entry = species?.flavorTextEntries.find((item) => item.language.name === 'en');
    return entry ? entry.flavorText.replace(/[\n\f\r]+/g, ' ').trim() : '';
  });

  protected readonly statTotal = computed(() => {
    const pokemon = this.pokemonValue();
    return pokemon ? pokemon.stats.reduce((sum, stat) => sum + stat.baseStat, 0) : 0;
  });

  protected readonly heightMeters = computed(() => {
    const pokemon = this.pokemonValue();
    return pokemon ? `${(pokemon.height / 10).toFixed(1)} m` : '';
  });

  protected readonly weightKg = computed(() => {
    const pokemon = this.pokemonValue();
    return pokemon ? `${(pokemon.weight / 10).toFixed(1)} kg` : '';
  });

  protected readonly sprites = computed<SpriteView[]>(() => {
    const pokemon = this.pokemonValue();
    if (!pokemon) {
      return [];
    }
    return [
      new SpriteView('Frente', pokemon.sprites.frontDefault),
      new SpriteView('Costas', pokemon.sprites.backDefault),
      new SpriteView('Frente shiny', pokemon.sprites.frontShiny),
      new SpriteView('Costas shiny', pokemon.sprites.backShiny),
    ].filter((sprite) => sprite.url.length > 0);
  });

  protected readonly evolutionSteps = computed<EvolutionStep[]>(() =>
    this.evolution.hasValue() ? this.flatten(this.evolution.value().chain, []) : [],
  );

  protected statLabel(name: string): string {
    return StatLabel.pt(name);
  }

  protected stepArtwork(id: number): string {
    return SpriteUrl.artwork(id);
  }

  protected humanize(value: string): string {
    return value.replace(/-/g, ' ');
  }

  private flatten(link: EvolutionLinkDto, accumulator: EvolutionStep[]): EvolutionStep[] {
    const id = ResourceId.fromUrl(link.species.url);
    if (id > 0) {
      accumulator.push(new EvolutionStep(id, link.species.name));
    }
    link.evolvesTo.forEach((child) => this.flatten(child, accumulator));
    return accumulator;
  }
}
