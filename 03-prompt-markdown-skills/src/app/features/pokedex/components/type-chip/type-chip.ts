import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PokemonType } from '../../models/pokemon-type.enum';
import { TypePalette } from '../../models/type-palette.model';
import { TypeLabel } from '../../models/type-label.model';

/** A small, accessible color-coded chip naming a single Pokémon type. */
@Component({
  selector: 'app-type-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span
    class="type-chip"
    [style.background]="color().background"
    [style.color]="color().text"
    >{{ label() }}</span
  >`,
  styles: `
    :host {
      display: inline-flex;
    }
    .type-chip {
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1.5;
      letter-spacing: 0.02em;
    }
  `,
})
export class TypeChip {
  readonly type = input.required<PokemonType>();
  readonly color = computed(() => TypePalette.colorOf(this.type()));
  readonly label = computed(() => TypeLabel.pt(this.type()));
}
