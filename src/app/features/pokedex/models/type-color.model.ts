/**
 * Resolved color set for a Pokémon type.
 * - `base`: the vibrant type color (used as a chip background).
 * - `onBase`: text color with AA contrast over `base`.
 * - `soft`: a light, desaturated tint used for card backgrounds (dark text
 *   keeps AA contrast over it).
 */
export class TypeColor {
  constructor(
    public readonly base: string,
    public readonly onBase: string,
    public readonly soft: string,
  ) {}
}
