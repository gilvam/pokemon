/** Cor oficial de cada tipo de Pokémon (paleta clássica usada em toda a franquia). */
export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

/** Nome do tipo traduzido para português (pt-BR). */
export const TYPE_LABELS: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fogo',
  water: 'Água',
  electric: 'Elétrico',
  grass: 'Planta',
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

export const DEFAULT_TYPE_COLOR = '#68A090';

/** Nome do atributo base traduzido para português (pt-BR). */
export const STAT_LABELS: Record<string, string> = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defesa',
  'special-attack': 'Atq. Especial',
  'special-defense': 'Def. Especial',
  speed: 'Velocidade',
};

/** Cor de exibição de cada atributo base nas barras de estatísticas. */
export const STAT_COLORS: Record<string, string> = {
  hp: '#FF5959',
  attack: '#F5A623',
  defense: '#F8D030',
  'special-attack': '#6890F0',
  'special-defense': '#78C850',
  speed: '#F85888',
};

export const DEFAULT_STAT_COLOR = '#8A8A8A';

/** Valor usado como "100% da barra" na visualização — a maioria dos base stats fica bem abaixo disso. */
export const STAT_BAR_SCALE_MAX = 200;
