/**
 * Helpers to derive image URLs and display strings from a Pokémon id, without
 * needing to fetch the full `/pokemon/{id}` payload for every card.
 */

const SPRITES_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

/** Extracts the trailing numeric id from a PokeAPI resource URL (e.g. `.../pokemon/25/`). */
export function idFromResourceUrl(url: string): number {
  const match = /\/(\d+)\/?$/.exec(url);
  return match ? Number(match[1]) : NaN;
}

/** High-resolution official artwork used on cards and detail headers. */
export function officialArtworkUrl(id: number): string {
  return `${SPRITES_BASE}/other/official-artwork/${id}.png`;
}

/** Default pixel sprite, used as a fallback when artwork is missing. */
export function spriteUrl(id: number): string {
  return `${SPRITES_BASE}/${id}.png`;
}

/** Formats a national dex number as `#0001`. */
export function formatDexNumber(id: number): string {
  return `#${String(id).padStart(4, '0')}`;
}

/** Capitalizes an API name and replaces hyphens with spaces (`mr-mime` -> `Mr Mime`). */
export function formatName(name: string): string {
  return name
    .split('-')
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(' ');
}
