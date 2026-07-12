import { ChangeDetectionStrategy, Component, model } from '@angular/core';

/** Uncontrolled-looking search input; the raw term is exposed via two-way `[(term)]` binding. */
@Component({
  selector: 'app-pokemon-search',
  templateUrl: './pokemon-search.html',
  styleUrl: './pokemon-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonSearch {
  readonly term = model('');

  protected onInput(event: Event): void {
    this.term.set((event.target as HTMLInputElement).value);
  }
}
