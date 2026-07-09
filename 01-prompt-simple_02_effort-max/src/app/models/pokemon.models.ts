/** Recurso nomeado padrão da PokeAPI: `{ name, url }`. */
export interface NamedApiResource {
  name: string;
  url: string;
}

/** Resposta paginada padrão da PokeAPI para endpoints de listagem. */
export interface NamedApiResourceList {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedApiResource[];
}

/** Item leve da lista completa de Pokémon (nome + id, extraído da URL). */
export interface PokemonListItem {
  name: string;
  id: number;
}

export interface PokemonAbilitySlot {
  ability: NamedApiResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonStatSlot {
  base_stat: number;
  effort: number;
  stat: NamedApiResource;
}

export interface PokemonTypeSlot {
  slot: number;
  type: NamedApiResource;
}

export interface PokemonOtherSprites {
  ['official-artwork']?: { front_default: string | null; front_shiny?: string | null };
  home?: { front_default: string | null; front_shiny?: string | null };
  [key: string]: unknown;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny?: string | null;
  other?: PokemonOtherSprites;
  [key: string]: unknown;
}

export interface PokemonCries {
  latest: string | null;
  legacy: string | null;
}

/** Recurso principal `/api/v2/pokemon/<id|nome>`. */
export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  order: number;
  abilities: PokemonAbilitySlot[];
  stats: PokemonStatSlot[];
  types: PokemonTypeSlot[];
  sprites: PokemonSprites;
  cries: PokemonCries;
  species: NamedApiResource;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: NamedApiResource;
  version?: NamedApiResource;
}

/** Recurso `/api/v2/pokemon-species/<id|nome>` (só os campos usados aqui). */
export interface PokemonSpecies {
  id: number;
  name: string;
  flavor_text_entries: FlavorTextEntry[];
}
