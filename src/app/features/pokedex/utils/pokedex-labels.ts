import { PokemonType } from '../models/pokemon-type.enum';
import { RarityCategory } from '../models/rarity-category.enum';
import { RarityTier } from '../models/rarity-tier.enum';
import { SortOption } from '../models/sort-option.enum';

/** PT-BR display labels for the (English) domain enums used in the UI. */

export const SORT_LABELS: Record<SortOption, string> = {
  [SortOption.NumberAsc]: 'Número ↑',
  [SortOption.NumberDesc]: 'Número ↓',
  [SortOption.NameAsc]: 'Nome A–Z',
  [SortOption.NameDesc]: 'Nome Z–A',
};

export const TYPE_LABELS: Record<PokemonType, string> = {
  [PokemonType.Normal]: 'Normal',
  [PokemonType.Fire]: 'Fogo',
  [PokemonType.Water]: 'Água',
  [PokemonType.Electric]: 'Elétrico',
  [PokemonType.Grass]: 'Planta',
  [PokemonType.Ice]: 'Gelo',
  [PokemonType.Fighting]: 'Lutador',
  [PokemonType.Poison]: 'Venenoso',
  [PokemonType.Ground]: 'Terrestre',
  [PokemonType.Flying]: 'Voador',
  [PokemonType.Psychic]: 'Psíquico',
  [PokemonType.Bug]: 'Inseto',
  [PokemonType.Rock]: 'Pedra',
  [PokemonType.Ghost]: 'Fantasma',
  [PokemonType.Dragon]: 'Dragão',
  [PokemonType.Dark]: 'Sombrio',
  [PokemonType.Steel]: 'Metálico',
  [PokemonType.Fairy]: 'Fada',
};

export const RARITY_CATEGORY_LABELS: Record<RarityCategory, string> = {
  [RarityCategory.Normal]: 'Normal',
  [RarityCategory.Baby]: 'Bebê',
  [RarityCategory.Legendary]: 'Lendário',
  [RarityCategory.Mythical]: 'Mítico',
};

export const RARITY_TIER_LABELS: Record<RarityTier, string> = {
  [RarityTier.Common]: 'Comum',
  [RarityTier.Uncommon]: 'Incomum',
  [RarityTier.Rare]: 'Raro',
  [RarityTier.VeryRare]: 'Muito Raro',
};

/** PT-BR labels for the PokeAPI base-stat names. */
export const STAT_LABELS: Record<string, string> = {
  hp: 'HP',
  attack: 'Atq',
  defense: 'Def',
  'special-attack': 'Atq. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Vel',
};
