import { environment } from '@environments/environment';

/** Builds Pokémon artwork/sprite URLs straight from the id — no extra HTTP request. */
export class SpriteUrl {
  private static readonly base = `${environment.mediaBaseUrl}/sprites/pokemon`;

  /** High-resolution official artwork, used on the list cards. */
  static artwork(id: number): string {
    return `${SpriteUrl.base}/other/official-artwork/${id}.png`;
  }

  /** Lower-resolution default sprite, used as a fallback when artwork fails to load. */
  static fallback(id: number): string {
    return `${SpriteUrl.base}/${id}.png`;
  }
}
