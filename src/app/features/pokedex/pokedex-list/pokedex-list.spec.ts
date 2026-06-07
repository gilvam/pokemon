import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { PokedexStore } from '../../../core/pokedex/pokedex-store.service';
import { PokedexList } from './pokedex-list';

function createStoreStub() {
  return {
    status: signal<'idle' | 'loading' | 'ready' | 'error'>('ready'),
    rarityMap: signal(new Map()),
    rarityStatus: signal<'idle' | 'building' | 'ready' | 'error'>('idle'),
    rarityProgress: signal({ loaded: 0, total: 0 }),
    typeNames: signal<string[]>(['fire', 'water']),
    list: signal([
      { id: 1, name: 'bulbasaur', types: ['grass', 'poison'] },
      { id: 4, name: 'charmander', types: ['fire'] },
    ]),
    loadIndex: vi.fn(),
    ensureRarityIndex: vi.fn(),
    retry: vi.fn(),
  };
}

describe('PokedexList', () => {
  let store: ReturnType<typeof createStoreStub>;

  beforeEach(() => {
    store = createStoreStub();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'pokedex', component: PokedexList }]),
        provideNoopAnimations(),
        { provide: PokedexStore, useValue: store },
      ],
    });
  });

  it('loads the index and renders the ready state with cards', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/pokedex', PokedexList);
    await harness.fixture.whenStable();
    harness.detectChanges();

    expect(store.loadIndex).toHaveBeenCalled();

    const root = harness.fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.results-count')?.textContent).toContain('2 Pokémon');
    expect(root.querySelectorAll('app-pokemon-card').length).toBe(2);
  });

  it('shows the empty state when there are no matching Pokémon', async () => {
    store.list.set([]);
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/pokedex', PokedexList);
    await harness.fixture.whenStable();
    harness.detectChanges();

    const root = harness.fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.state')?.textContent).toContain('Nenhum Pokémon encontrado');
  });
});
