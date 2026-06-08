import { PokemonType } from '../models/pokemon-type.enum';
import { TypeColor } from '../models/type-color.model';
import { mixHex, readableTextColor } from './color';

/** Card text color shared across type backgrounds (kept dark for AA on tints). */
export const CARD_TEXT_COLOR = '#1b1b1f';

/** How far each base color is mixed toward white to produce the soft tint. */
const SOFT_TINT_RATIO = 0.8;

/** Vibrant base color per type (classic Pokémon type palette). */
const TYPE_BASE_COLOR: Record<PokemonType, string> = {
  [PokemonType.Normal]: '#9099a1',
  [PokemonType.Fire]: '#ff9d55',
  [PokemonType.Water]: '#5090d6',
  [PokemonType.Electric]: '#f4d23c',
  [PokemonType.Grass]: '#63bc5a',
  [PokemonType.Ice]: '#73cec0',
  [PokemonType.Fighting]: '#ce4069',
  [PokemonType.Poison]: '#ab6ac8',
  [PokemonType.Ground]: '#d97746',
  [PokemonType.Flying]: '#8fa9de',
  [PokemonType.Psychic]: '#f97176',
  [PokemonType.Bug]: '#90c12c',
  [PokemonType.Rock]: '#c7b78b',
  [PokemonType.Ghost]: '#5269ad',
  [PokemonType.Dragon]: '#0b6dc3',
  [PokemonType.Dark]: '#5a5465',
  [PokemonType.Steel]: '#5a8ea1',
  [PokemonType.Fairy]: '#ec8fe6',
};

export function getTypeColor(type: PokemonType): TypeColor {
  const base = TYPE_BASE_COLOR[type];
  const soft = mixHex(base, '#ffffff', SOFT_TINT_RATIO);
  return new TypeColor(base, readableTextColor(base), soft);
}

/**
 * Build a soft gradient background from a Pokémon's type(s):
 * - one type → a gentle gradient of that type's soft tint;
 * - two types → a gradient blending both soft tints.
 */
export function getCardBackground(types: readonly PokemonType[]): string {
  if (0 === types.length) {
    return 'var(--mat-sys-surface-container)';
  }

  const softColors = types.map((type) => getTypeColor(type).soft);

  if (1 === softColors.length) {
    const single = softColors.at(0)!;
    const deeper = mixHex(single, getTypeColor(types.at(0)!).base, 0.18);
    return `linear-gradient(135deg, ${single} 0%, ${deeper} 100%)`;
  }

  return `linear-gradient(135deg, ${softColors.at(0)} 0%, ${softColors.at(-1)} 100%)`;
}
