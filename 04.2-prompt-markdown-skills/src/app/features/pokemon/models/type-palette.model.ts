import { PokemonType } from './pokemon-type.enum';
import { TypeColor } from './type-color.model';

/**
 * Accessible pastel color palette per Pokémon type. Every background is a light,
 * desaturated tint paired with a single dark text color so every combination clears
 * WCAG AA (contrast >= 4.5:1) — verified in the spec. Card/header backgrounds blend
 * the (up to two) type tints into a soft gradient.
 */
export class TypePalette {
  private static readonly text = '#1f2937';
  private static readonly neutralBackground = '#e5e7eb';

  private static readonly palette = new Map<PokemonType, TypeColor>([
    [PokemonType.NORMAL, new TypeColor('#d9d6c9', TypePalette.text)],
    [PokemonType.FIRE, new TypeColor('#ffd2bd', TypePalette.text)],
    [PokemonType.WATER, new TypeColor('#bcdcff', TypePalette.text)],
    [PokemonType.ELECTRIC, new TypeColor('#fff1b8', TypePalette.text)],
    [PokemonType.GRASS, new TypeColor('#cdeeb6', TypePalette.text)],
    [PokemonType.ICE, new TypeColor('#cdeef0', TypePalette.text)],
    [PokemonType.FIGHTING, new TypeColor('#f2c0bb', TypePalette.text)],
    [PokemonType.POISON, new TypeColor('#e6c4ec', TypePalette.text)],
    [PokemonType.GROUND, new TypeColor('#ecdcb0', TypePalette.text)],
    [PokemonType.FLYING, new TypeColor('#d6dcf7', TypePalette.text)],
    [PokemonType.PSYCHIC, new TypeColor('#ffc8db', TypePalette.text)],
    [PokemonType.BUG, new TypeColor('#dcecb0', TypePalette.text)],
    [PokemonType.ROCK, new TypeColor('#e3d8b4', TypePalette.text)],
    [PokemonType.GHOST, new TypeColor('#cfc6e6', TypePalette.text)],
    [PokemonType.DRAGON, new TypeColor('#d4c6f7', TypePalette.text)],
    [PokemonType.DARK, new TypeColor('#cfc4ba', TypePalette.text)],
    [PokemonType.STEEL, new TypeColor('#d8e2ee', TypePalette.text)],
    [PokemonType.FAIRY, new TypeColor('#f9d3e3', TypePalette.text)],
  ]);

  static colorOf(type: PokemonType): TypeColor {
    return TypePalette.palette.get(type) ?? new TypeColor();
  }

  static all(): PokemonType[] {
    return [...TypePalette.palette.keys()];
  }

  /** CSS `background` value for a card/header given its 0, 1 or 2 types. */
  static cardBackground(types: PokemonType[]): string {
    const first = types.at(0);
    if (!first) {
      return TypePalette.neutralBackground;
    }
    const firstColor = TypePalette.colorOf(first).background;
    const second = types.at(1);
    if (!second) {
      const lighter = `color-mix(in srgb, ${firstColor} 45%, white)`;
      return `linear-gradient(135deg, ${lighter}, ${firstColor})`;
    }
    const secondColor = TypePalette.colorOf(second).background;
    return `linear-gradient(135deg, ${firstColor}, ${secondColor})`;
  }
}
