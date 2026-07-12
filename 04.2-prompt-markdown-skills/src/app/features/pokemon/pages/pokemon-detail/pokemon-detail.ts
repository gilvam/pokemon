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
import { StatLabel } from '../../models/stat-label.model';
import { EvolutionStep } from '../../models/evolution-step.model';
import { ResourceId } from '../../models/resource-id.model';
import { StatBar } from '../../components/stat-bar/stat-bar';

interface SpriteView {
  label: string;
  url: string;
}

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

  protected readonly pokemon = httpResource(() => this.api.pokemonUrl(this.pokemonId()), {
    parse: (raw) => PokemonDto.create(raw as Partial<PokemonDto>),
  });

  private readonly speciesId = computed(() =>
    this.pokemon.hasValue() ? ResourceId.fromUrl(this.pokemon.value().species.url) : 0,
  );

  protected readonly species = httpResource(
    () => (this.speciesId() > 0 ? this.api.speciesUrl(this.speciesId()) : undefined),
    { parse: (raw) => PokemonSpeciesDto.create(raw as Partial<PokemonSpeciesDto>) },
  );

  private readonly evolutionChainId = computed(() =>
    this.species.hasValue() ? ResourceId.fromUrl(this.species.value().evolutionChain.url) : 0,
  );

  protected readonly evolution = httpResource(
    () => (this.evolutionChainId() > 0 ? this.api.evolutionChainUrl(this.evolutionChainId()) : undefined),
    { parse: (raw) => EvolutionChainDto.create(raw as Partial<EvolutionChainDto>) },
  );

  protected readonly types = computed<PokemonType[]>(() =>
    this.pokemon.hasValue()
      ? [...this.pokemon.value().types]
          .sort((left, right) => left.slot - right.slot)
          .map((slot) => slot.type.name as PokemonType)
      : [],
  );

  protected readonly background = computed(() => TypePalette.cardBackground(this.types()));

  protected readonly numberLabel = computed(() =>
    this.pokemon.hasValue() ? `#${String(this.pokemon.value().id).padStart(4, '0')}` : '',
  );

  protected readonly artworkUrl = computed(() =>
    this.pokemon.hasValue() ? SpriteUrl.artwork(this.pokemon.value().id) : '',
  );

  protected readonly genus = computed(() => {
    if (!this.species.hasValue()) {
      return '';
    }
    return this.species.value().genera.find((entry) => entry.language.name === 'en')?.genus ?? '';
  });

  protected readonly flavorText = computed(() => {
    if (!this.species.hasValue()) {
      return '';
    }
    const entry = this.species.value().flavorTextEntries.find((item) => item.language.name === 'en');
    return entry ? entry.flavorText.replace(/[\n\f\r]+/g, ' ').trim() : '';
  });

  protected readonly statTotal = computed(() =>
    this.pokemon.hasValue()
      ? this.pokemon.value().stats.reduce((sum, stat) => sum + stat.baseStat, 0)
      : 0,
  );

  protected readonly heightMeters = computed(() =>
    this.pokemon.hasValue() ? `${(this.pokemon.value().height / 10).toFixed(1)} m` : '',
  );

  protected readonly weightKg = computed(() =>
    this.pokemon.hasValue() ? `${(this.pokemon.value().weight / 10).toFixed(1)} kg` : '',
  );

  protected readonly sprites = computed<SpriteView[]>(() => {
    if (!this.pokemon.hasValue()) {
      return [];
    }
    const sprites = this.pokemon.value().sprites;
    return [
      { label: 'Frente', url: sprites.frontDefault },
      { label: 'Costas', url: sprites.backDefault },
      { label: 'Frente shiny', url: sprites.frontShiny },
      { label: 'Costas shiny', url: sprites.backShiny },
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
