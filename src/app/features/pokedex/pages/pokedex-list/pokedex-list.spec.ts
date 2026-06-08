import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { PokedexList } from './pokedex-list';
import { HttpPokeapiService } from '../../services/http/http-pokeapi/http-pokeapi.service';
import { HttpPokeapiMockService } from '../../services/http/http-pokeapi/http-pokeapi.mock.service';

describe('PokedexList', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexList],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: HttpPokeapiService, useClass: HttpPokeapiMockService },
      ],
    }).compileComponents();
  });

  it('should create and render the filter bar', () => {
    const fixture = TestBed.createComponent(PokedexList);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-pokemon-filters')).not.toBeNull();
  });

  it('should render Pokémon cards from the mock index', () => {
    const fixture = TestBed.createComponent(PokedexList);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('app-pokemon-card').length).toBeGreaterThan(0);
  });
});
