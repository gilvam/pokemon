import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PokemonType } from '../../models/pokemon-type.enum';
import { getTypeColor } from '../../utils/type-color';
import { TYPE_LABELS } from '../../utils/pokedex-labels';

/**
 * A small, accessible colored tag for a Pokémon type. Uses a custom element
 * (not mat-chip) so the per-type background/text contrast can be controlled
 * precisely to meet WCAG AA.
 */
@Component({
  selector: 'app-type-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="type-chip"
      [style.background]="color().base"
      [style.color]="color().onBase"
      >{{ label() }}</span
    >
  `,
  styles: `
    .type-chip {
      display: inline-flex;
      align-items: center;
      padding: 0.15rem 0.6rem;
      border-radius: 999px;
      font: var(--mat-sys-label-medium);
      font-weight: 600;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }
  `,
})
export class TypeChip {
  readonly type = input.required<PokemonType>();

  protected readonly color = computed(() => getTypeColor(this.type()));
  protected readonly label = computed(() => TYPE_LABELS[this.type()]);
}
