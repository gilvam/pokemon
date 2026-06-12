import { SortOption } from './sort-option.enum';

/** Brazilian-Portuguese display labels for the list ordering options. */
export class SortLabel {
  private static readonly labels: Record<SortOption, string> = {
    [SortOption.NUMBER_ASC]: 'Número ↑',
    [SortOption.NUMBER_DESC]: 'Número ↓',
    [SortOption.NAME_ASC]: 'Nome A–Z',
    [SortOption.NAME_DESC]: 'Nome Z–A',
  };

  static pt(sort: SortOption): string {
    return SortLabel.labels[sort];
  }
}
