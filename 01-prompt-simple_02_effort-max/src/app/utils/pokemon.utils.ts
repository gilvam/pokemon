import { PokemonListItem } from '../models/pokemon.models';
import { STAT_BAR_SCALE_MAX } from './pokemon.constants';

/** Extrai o id numérico de uma URL de recurso da PokeAPI (ex.: `/api/v2/pokemon/25/` -> 25). */
export function idFromUrl(url: string): number {
  const match = /\/(\d+)\/?$/.exec(url);
  return match ? Number(match[1]) : 0;
}

/** Converte um slug ("charizard-mega-x") em texto legível ("Charizard Mega X"). */
export function formatSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Número da Pokédex formatado com zero à esquerda (mínimo 3 dígitos): 25 -> "#025". */
export function formatPokedexNumber(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

/** Altura em decímetros (formato da API) convertida para metros. */
export function formatHeight(decimetres: number): string {
  return `${(decimetres / 10).toFixed(1)} m`;
}

/** Peso em hectogramas (formato da API) convertido para quilos. */
export function formatWeight(hectograms: number): string {
  return `${(hectograms / 10).toFixed(1)} kg`;
}

/** Remove quebras de linha/página usadas nos jogos antigos e normaliza espaços. */
export function cleanFlavorText(text: string): string {
  return text
    .replace(/[\n\f\r]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Percentual (0-100) de uma barra de estatística, numa escala visual fixa. */
export function statBarPercent(value: number): number {
  return Math.max(0, Math.min(100, (value / STAT_BAR_SCALE_MAX) * 100));
}

/** Sprite "de frente" construído a partir do id — usado na grade, sem buscar o detalhe completo. */
export function spriteUrl(id: number): string {
  return `/media/sprites/pokemon/${id}.png`;
}

/** Normaliza um termo de busca para comparação (minúsculas, sem espaços nas pontas). */
export function normalizeQuery(term: string): string {
  return term.trim().toLowerCase();
}

/** Um item da lista corresponde ao termo se o nome contém o texto ou o id bate exatamente. */
export function matchesQuery(item: PokemonListItem, query: string): boolean {
  if (!query) {
    return true;
  }
  return item.name.includes(query) || String(item.id) === query;
}
