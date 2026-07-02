import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PokemonCard } from './pokemon-card';
import { PokemonSummary } from '../../models/pokemon-summary.model';
import { PokemonType } from '../../models/pokemon-type.enum';

describe('PokemonCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokemonCard],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
  });

  it('renders the padded number, name and a translated type chip', async () => {
    const fixture = TestBed.createComponent(PokemonCard);
    fixture.componentRef.setInput(
      'summary',
      new PokemonSummary(25, 'pikachu', [PokemonType.ELECTRIC]),
    );
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('#0025');
    expect(text).toContain('pikachu');
    expect(text).toContain('Elétrico');
  });

  it('links to the Pokémon detail route', async () => {
    const fixture = TestBed.createComponent(PokemonCard);
    fixture.componentRef.setInput(
      'summary',
      new PokemonSummary(1, 'bulbasaur', [PokemonType.GRASS]),
    );
    await fixture.whenStable();

    const link = (fixture.nativeElement as HTMLElement).querySelector('a');
    expect(link?.getAttribute('href')).toBe('/pokedex/1');
  });
});
