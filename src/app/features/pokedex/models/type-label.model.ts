import { PokemonType } from './pokemon-type.enum';

/** Brazilian-Portuguese display labels for each Pokémon type. */
export class TypeLabel {
  private static readonly labels: Record<PokemonType, string> = {
    [PokemonType.NORMAL]: 'Normal',
    [PokemonType.FIRE]: 'Fogo',
    [PokemonType.WATER]: 'Água',
    [PokemonType.ELECTRIC]: 'Elétrico',
    [PokemonType.GRASS]: 'Planta',
    [PokemonType.ICE]: 'Gelo',
    [PokemonType.FIGHTING]: 'Lutador',
    [PokemonType.POISON]: 'Veneno',
    [PokemonType.GROUND]: 'Terra',
    [PokemonType.FLYING]: 'Voador',
    [PokemonType.PSYCHIC]: 'Psíquico',
    [PokemonType.BUG]: 'Inseto',
    [PokemonType.ROCK]: 'Pedra',
    [PokemonType.GHOST]: 'Fantasma',
    [PokemonType.DRAGON]: 'Dragão',
    [PokemonType.DARK]: 'Sombrio',
    [PokemonType.STEEL]: 'Aço',
    [PokemonType.FAIRY]: 'Fada',
  };

  static pt(type: PokemonType): string {
    return TypeLabel.labels[type];
  }
}
