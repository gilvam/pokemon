/**
 * The 18 Pokémon types. Values match the PokeAPI `type` resource names so they
 * can be used directly in `GET /type/{name}` requests and payload mapping.
 */
export enum PokemonType {
  Normal = 'normal',
  Fire = 'fire',
  Water = 'water',
  Electric = 'electric',
  Grass = 'grass',
  Ice = 'ice',
  Fighting = 'fighting',
  Poison = 'poison',
  Ground = 'ground',
  Flying = 'flying',
  Psychic = 'psychic',
  Bug = 'bug',
  Rock = 'rock',
  Ghost = 'ghost',
  Dragon = 'dragon',
  Dark = 'dark',
  Steel = 'steel',
  Fairy = 'fairy',
}

export const POKEMON_TYPES: readonly PokemonType[] = Object.values(PokemonType);
