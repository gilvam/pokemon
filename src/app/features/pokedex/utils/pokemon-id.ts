const POKEDEX_NUMBER_LENGTH = 4;

/** Extract the numeric id from a PokeAPI resource URL (e.g. `.../pokemon/25/`). */
export function extractIdFromUrl(url: string): number {
  const segments = url.split('/').filter((segment) => segment.length > 0);
  return Number.parseInt(segments.at(-1) ?? '0', 10);
}

/** Format an id as a zero-padded Pokédex number (e.g. `25` → `#0025`). */
export function formatPokedexNumber(id: number): string {
  return `#${String(id).padStart(POKEDEX_NUMBER_LENGTH, '0')}`;
}
