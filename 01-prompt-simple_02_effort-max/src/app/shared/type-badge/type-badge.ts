import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DEFAULT_TYPE_COLOR, TYPE_COLORS, TYPE_LABELS } from '../../utils/pokemon.constants';

@Component({
  selector: 'app-type-badge',
  templateUrl: './type-badge.html',
  styleUrl: './type-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypeBadge {
  readonly type = input.required<string>();

  protected readonly label = computed(() => TYPE_LABELS[this.type()] ?? this.type());
  protected readonly color = computed(() => TYPE_COLORS[this.type()] ?? DEFAULT_TYPE_COLOR);
}
