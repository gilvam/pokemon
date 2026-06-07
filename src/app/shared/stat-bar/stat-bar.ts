import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** An accessible horizontal bar for a single base stat. */
@Component({
  selector: 'app-stat-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stat-bar">
      <span class="stat-bar__label" [id]="labelId">{{ label() }}</span>
      <span class="stat-bar__value">{{ value() }}</span>
      <div
        class="stat-bar__track"
        role="progressbar"
        [attr.aria-labelledby]="labelId"
        [attr.aria-valuenow]="value()"
        [attr.aria-valuemin]="0"
        [attr.aria-valuemax]="max()"
      >
        <div
          class="stat-bar__fill"
          [style.width.%]="percent()"
          [style.background-color]="color()"
        ></div>
      </div>
    </div>
  `,
  styles: [
    `
      .stat-bar {
        display: grid;
        grid-template-columns: 6.5rem 2.5rem 1fr;
        align-items: center;
        gap: 0.5rem;
      }
      .stat-bar__label {
        font-weight: 600;
        font-size: 0.85rem;
      }
      .stat-bar__value {
        font-variant-numeric: tabular-nums;
        text-align: right;
        font-size: 0.85rem;
      }
      .stat-bar__track {
        height: 0.6rem;
        border-radius: 999px;
        background: var(--mat-sys-surface-container-highest);
        overflow: hidden;
      }
      .stat-bar__fill {
        height: 100%;
        border-radius: 999px;
        transition: width 0.4s ease;
      }
    `,
  ],
})
export class StatBar {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly max = input(255);

  private static nextId = 0;
  protected readonly labelId = `stat-${StatBar.nextId++}`;

  protected readonly percent = computed(() =>
    Math.max(0, Math.min(100, (this.value() / this.max()) * 100)),
  );

  /** Red (weak) → amber → green (strong) based on the stat value. */
  protected readonly color = computed(() => {
    const v = this.value();
    if (v < 60) return '#d2483f';
    if (v < 90) return '#e0a32e';
    if (v < 120) return '#9bbb2e';
    return '#3a9d57';
  });
}
