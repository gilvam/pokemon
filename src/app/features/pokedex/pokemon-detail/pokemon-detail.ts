import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom, map } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HttpPokeapiService } from '../../../services/http/http-pokeapi/http-pokeapi.service';
import { ChainLinkDto } from '../../../services/http/http-pokeapi/models/chain-link.dto';
import {
  CAPTURE_TIER_LABELS,
  deriveRarity,
  RARITY_CATEGORY_LABELS,
} from '../../../core/pokedex/rarity';
import {
  formatDexNumber,
  formatName,
  idFromResourceUrl,
  officialArtworkUrl,
} from '../../../core/pokedex/sprites';
import { StatBar } from '../../../shared/stat-bar/stat-bar';
import { TypeChip } from '../../../shared/type-chip/type-chip';

const STAT_LABELS: Record<string, string> = {
  hp: 'PV',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Ataque Esp.',
  'special-defense': 'Defesa Esp.',
  speed: 'Velocidade',
};

interface EvolutionNode {
  readonly id: number;
  readonly name: string;
  readonly displayName: string;
}

function flattenChain(link: ChainLinkDto, acc: EvolutionNode[] = []): EvolutionNode[] {
  acc.push({
    id: idFromResourceUrl(link.species.url),
    name: link.species.name,
    displayName: formatName(link.species.name),
  });
  for (const next of link.evolves_to) {
    flattenChain(next, acc);
  }
  return acc;
}

function pickEnglish<T extends { language: { name: string } }>(entries: readonly T[]): T | undefined {
  return entries.find((entry) => entry.language.name === 'en') ?? entries[0];
}

@Component({
  selector: 'app-pokemon-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DecimalPipe,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressSpinnerModule,
    StatBar,
    TypeChip,
  ],
  templateUrl: './pokemon-detail.html',
  styleUrl: './pokemon-detail.scss',
})
export class PokemonDetail {
  private readonly api = inject(HttpPokeapiService);
  private readonly route = inject(ActivatedRoute);

  protected readonly id = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: '' },
  );

  protected readonly detail = resource({
    params: () => this.id(),
    loader: async ({ params: id }) => {
      const pokemon = await firstValueFrom(this.api.getPokemon(id));
      const species = await firstValueFrom(this.api.getSpecies(pokemon.species.name));
      const evolution = species.evolution_chain.url
        ? await firstValueFrom(this.api.getEvolutionChainByUrl(species.evolution_chain.url))
        : null;
      return { pokemon, species, evolution };
    },
  });

  protected readonly vm = computed(() => {
    const data = this.detail.hasValue() ? this.detail.value() : undefined;
    if (!data) return undefined;
    const { pokemon, species, evolution } = data;
    const rarity = deriveRarity(species);
    const flavor = pickEnglish(species.flavor_text_entries);

    return {
      id: pokemon.id,
      dexNumber: formatDexNumber(pokemon.id),
      name: formatName(pokemon.name),
      artwork: pokemon.sprites.other.official_artwork.front_default || officialArtworkUrl(pokemon.id),
      genus: pickEnglish(species.genera)?.genus ?? '',
      types: pokemon.types.map((entry) => entry.type.name),
      heightM: pokemon.height / 10,
      weightKg: pokemon.weight / 10,
      baseExperience: pokemon.base_experience || null,
      abilities: pokemon.abilities.map((entry) => ({
        name: formatName(entry.ability.name),
        hidden: entry.is_hidden,
      })),
      stats: pokemon.stats.map((entry) => ({
        label: STAT_LABELS[entry.stat.name] ?? formatName(entry.stat.name),
        value: entry.base_stat,
      })),
      statTotal: pokemon.stats.reduce((sum, entry) => sum + entry.base_stat, 0),
      rarityCategory: RARITY_CATEGORY_LABELS[rarity.category],
      isNotableRarity: rarity.category !== 'normal',
      captureTier: CAPTURE_TIER_LABELS[rarity.captureTier],
      captureRate: rarity.captureRate,
      baseHappiness: species.base_happiness,
      hatchCounter: species.hatch_counter,
      growthRate: species.growth_rate.name ? formatName(species.growth_rate.name) : null,
      habitat: species.habitat.name ? formatName(species.habitat.name) : null,
      eggGroups: species.egg_groups.map((group) => formatName(group.name)),
      flavorText: flavor ? flavor.flavor_text.replace(/[\n\f\r]+/g, ' ') : '',
      sprites: [
        { url: pokemon.sprites.front_default, label: 'Frente' },
        { url: pokemon.sprites.back_default, label: 'Costas' },
        { url: pokemon.sprites.front_shiny, label: 'Frente brilhante' },
        { url: pokemon.sprites.back_shiny, label: 'Costas brilhante' },
      ].filter((sprite) => !!sprite.url),
      cry: pokemon.cries.latest || null,
      evolutions: evolution ? flattenChain(evolution.chain) : [],
      moves: pokemon.moves.map((entry) => formatName(entry.move.name)).sort((a, b) => a.localeCompare(b)),
    };
  });

  protected reload(): void {
    this.detail.reload();
  }
}
