import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** A single accessible base-stat row exposed to assistive tech as a progressbar. */
@Component({
  selector: 'app-stat-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'progressbar',
    'aria-valuemin': '0',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-label]': 'ariaLabel()',
  },
  template: `
    <span class="stat-bar__label">{{ label() }}</span>
    <span class="stat-bar__value">{{ value() }}</span>
    <span class="stat-bar__track">
      <span class="stat-bar__fill" [style.width.%]="percent()"></span>
    </span>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-columns: 7.5rem 2.5rem 1fr;
      align-items: center;
      gap: 0.5rem;
    }
    .stat-bar__label {
      font-size: 0.85rem;
      color: var(--mat-sys-on-surface-variant);
    }
    .stat-bar__value {
      font-weight: 600;
      text-align: right;
      font-variant-numeric: tabular-nums;
    }
    .stat-bar__track {
      position: relative;
      height: 0.6rem;
      border-radius: 999px;
      background: var(--mat-sys-surface-variant);
      overflow: hidden;
    }
    .stat-bar__fill {
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      border-radius: 999px;
      background: var(--mat-sys-primary);
    }
  `,
})
export class StatBar {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly max = input(255);
  readonly percent = computed(() => Math.min(100, Math.round((this.value() / this.max()) * 100)));
  readonly ariaLabel = computed(() => `${this.label()}: ${this.value()}`);
}
