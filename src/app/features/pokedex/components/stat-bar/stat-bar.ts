import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const DEFAULT_MAX = 255;

/** A labelled base-stat bar built on Material's determinate progress bar. */
@Component({
  selector: 'app-stat-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressBarModule],
  template: `
    <div class="stat-bar">
      <span class="stat-bar__label">{{ label() }}</span>
      <span class="stat-bar__value">{{ value() }}</span>
      <mat-progress-bar
        class="stat-bar__meter"
        mode="determinate"
        [value]="percent()"
        [attr.aria-label]="label() + ': ' + value() + ' de ' + max()"
      />
    </div>
  `,
  styles: `
    .stat-bar {
      display: grid;
      grid-template-columns: 7ch 4ch 1fr;
      align-items: center;
      gap: 0.5rem;
    }
    .stat-bar__label {
      font: var(--mat-sys-label-medium);
      color: var(--mat-sys-on-surface-variant);
    }
    .stat-bar__value {
      font: var(--mat-sys-label-large);
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .stat-bar__meter {
      --mat-progress-bar-active-indicator-height: 10px;
      --mat-progress-bar-track-height: 10px;
      border-radius: 999px;
    }
  `,
})
export class StatBar {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly max = input(DEFAULT_MAX);

  protected readonly percent = computed(() => Math.min(100, (this.value() / this.max()) * 100));
}
