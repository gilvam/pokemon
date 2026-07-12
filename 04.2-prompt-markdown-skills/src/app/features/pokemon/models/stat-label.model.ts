/** Brazilian-Portuguese labels for the six base stats (keyed by PokeAPI stat names). */
export class StatLabel {
  private static readonly labels: Record<string, string> = {
    hp: 'HP',
    attack: 'Ataque',
    defense: 'Defesa',
    'special-attack': 'Ataque Esp.',
    'special-defense': 'Defesa Esp.',
    speed: 'Velocidade',
  };

  static pt(name: string): string {
    return StatLabel.labels[name] ?? name;
  }
}
