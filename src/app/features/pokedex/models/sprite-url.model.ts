/** Builds Pokémon image URLs straight from the id — no extra HTTP request. */
export class SpriteUrl {
  private static readonly base =
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';

  /** High-resolution official artwork. */
  static artwork(id: number): string {
    return `${SpriteUrl.base}/other/official-artwork/${id}.png`;
  }

  /** Lower-resolution default sprite, used as a fallback when artwork is missing. */
  static fallback(id: number): string {
    return `${SpriteUrl.base}/${id}.png`;
  }

  /** Shiny official artwork. */
  static shinyArtwork(id: number): string {
    return `${SpriteUrl.base}/other/official-artwork/shiny/${id}.png`;
  }
}
