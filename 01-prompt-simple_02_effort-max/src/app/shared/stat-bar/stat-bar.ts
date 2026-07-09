import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  DEFAULT_STAT_COLOR,
  STAT_BAR_SCALE_MAX,
  STAT_COLORS,
  STAT_LABELS,
} from '../../utils/pokemon.constants';
import { statBarPercent } from '../../utils/pokemon.utils';

@Component({
  selector: 'app-stat-bar',
  templateUrl: './stat-bar.html',
  styleUrl: './stat-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatBar {
  readonly stat = input.required<string>();
  readonly value = input.required<number>();

  protected readonly label = computed(() => STAT_LABELS[this.stat()] ?? this.stat());
  protected readonly color = computed(() => STAT_COLORS[this.stat()] ?? DEFAULT_STAT_COLOR);
  protected readonly percent = computed(() => statBarPercent(this.value()));
  protected readonly scaleMax = STAT_BAR_SCALE_MAX;
}
