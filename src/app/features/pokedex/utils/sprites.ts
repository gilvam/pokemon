const SPRITE_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

/** High-resolution official artwork URL for a Pokémon id (preferred for cards/detail). */
export function buildArtworkUrl(id: number): string {
  return `${SPRITE_BASE}/other/official-artwork/${id}.png`;
}

/** Default pixel sprite URL — used as a fallback when artwork is missing. */
export function buildSpriteFallbackUrl(id: number): string {
  return `${SPRITE_BASE}/${id}.png`;
}
