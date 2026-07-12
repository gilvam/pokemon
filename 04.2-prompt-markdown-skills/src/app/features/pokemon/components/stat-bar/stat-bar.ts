import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** A single accessible base-stat row exposed to assistive tech as a progressbar. */
@Component({
  selector: 'app-stat-bar',
  templateUrl: './stat-bar.html',
  styleUrl: './stat-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'progressbar',
    'aria-valuemin': '0',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-label]': 'ariaLabel()',
  },
})
export class StatBar {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly max = input(255);

  protected readonly percent = computed(() =>
    Math.min(100, Math.round((this.value() / this.max()) * 100)),
  );
  protected readonly ariaLabel = computed(() => `${this.label()}: ${this.value()}`);
}
