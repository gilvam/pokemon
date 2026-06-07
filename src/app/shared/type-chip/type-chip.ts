import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { getTypeColor, getTypeLabel } from '../type-color';

/** A small, accessible coloured badge for a Pokémon type. */
@Component({
  selector: 'app-type-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span
    class="type-chip"
    [style.background-color]="color().background"
    [style.color]="color().text"
    >{{ label() }}</span
  >`,
  styles: [
    `
      .type-chip {
        display: inline-flex;
        align-items: center;
        padding: 0.15rem 0.6rem;
        border-radius: 999px;
        font-size: 0.78rem;
        font-weight: 600;
        line-height: 1.4;
        letter-spacing: 0.02em;
        text-transform: uppercase;
        white-space: nowrap;
      }
    `,
  ],
})
export class TypeChip {
  readonly type = input.required<string>();

  protected readonly color = computed(() => getTypeColor(this.type()));
  protected readonly label = computed(() => getTypeLabel(this.type()));
}
