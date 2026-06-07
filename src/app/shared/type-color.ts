/**
 * Per-type colours and Portuguese labels. Each pairing of `background` + `text`
 * is chosen to meet WCAG AA (>= 4.5:1) so type chips stay accessible.
 */

export interface TypeColor {
  readonly background: string;
  readonly text: string;
}

const DARK_TEXT = '#10141a';
const LIGHT_TEXT = '#ffffff';

export const TYPE_COLORS: Record<string, TypeColor> = {
  normal: { background: '#9b9b6f', text: DARK_TEXT },
  fire: { background: '#ee8130', text: DARK_TEXT },
  water: { background: '#6390f0', text: DARK_TEXT },
  grass: { background: '#7ac74c', text: DARK_TEXT },
  electric: { background: '#f7d02c', text: DARK_TEXT },
  ice: { background: '#96d9d6', text: DARK_TEXT },
  fighting: { background: '#b32820', text: LIGHT_TEXT },
  poison: { background: '#8e3c8c', text: LIGHT_TEXT },
  ground: { background: '#e2bf65', text: DARK_TEXT },
  flying: { background: '#a98ff3', text: DARK_TEXT },
  psychic: { background: '#f95587', text: DARK_TEXT },
  bug: { background: '#a6b91a', text: DARK_TEXT },
  rock: { background: '#b6a136', text: DARK_TEXT },
  ghost: { background: '#5b4380', text: LIGHT_TEXT },
  dragon: { background: '#6f35fc', text: LIGHT_TEXT },
  dark: { background: '#4a4a4a', text: LIGHT_TEXT },
  steel: { background: '#b7b7ce', text: DARK_TEXT },
  fairy: { background: '#d685ad', text: DARK_TEXT },
};

const DEFAULT_COLOR: TypeColor = { background: '#5b5b5b', text: LIGHT_TEXT };

export const TYPE_LABELS_PT: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fogo',
  water: 'Água',
  grass: 'Planta',
  electric: 'Elétrico',
  ice: 'Gelo',
  fighting: 'Lutador',
  poison: 'Venenoso',
  ground: 'Terra',
  flying: 'Voador',
  psychic: 'Psíquico',
  bug: 'Inseto',
  rock: 'Pedra',
  ghost: 'Fantasma',
  dragon: 'Dragão',
  dark: 'Sombrio',
  steel: 'Aço',
  fairy: 'Fada',
};

export function getTypeColor(type: string): TypeColor {
  return TYPE_COLORS[type] ?? DEFAULT_COLOR;
}

export function getTypeLabel(type: string): string {
  return TYPE_LABELS_PT[type] ?? type;
}
