import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

/** Presentational client-side pagination — no API paging involved. */
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  /** 0-based current page index. */
  readonly page = input.required<number>();
  readonly totalPages = input.required<number>();
  readonly pageChange = output<number>();

  protected readonly hasPrevious = computed(() => this.page() > 0);
  protected readonly hasNext = computed(() => this.page() < this.totalPages() - 1);
  protected readonly label = computed(
    () => `Página ${this.page() + 1} de ${Math.max(this.totalPages(), 1)}`,
  );

  protected goToPrevious(): void {
    if (this.hasPrevious()) {
      this.pageChange.emit(this.page() - 1);
    }
  }

  protected goToNext(): void {
    if (this.hasNext()) {
      this.pageChange.emit(this.page() + 1);
    }
  }
}
