import { PokemonType, POKEMON_TYPES } from '../models/pokemon-type.enum';

/** Convert a PokeAPI type name into the typed enum (undefined if unknown). */
export function toPokemonType(name: string): PokemonType | undefined {
  return POKEMON_TYPES.find((type) => type === name);
}

/** Map a list of PokeAPI type names to known {@link PokemonType} values. */
export function toPokemonTypes(names: readonly string[]): PokemonType[] {
  return names
    .map((name) => toPokemonType(name))
    .filter((type): type is PokemonType => type !== undefined);
}
