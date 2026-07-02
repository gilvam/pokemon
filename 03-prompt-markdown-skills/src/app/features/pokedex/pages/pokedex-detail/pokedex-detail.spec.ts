import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { PokedexDetail } from './pokedex-detail';
import { HttpPokeapiService } from '../../services/http/http-pokeapi/http-pokeapi.service';
import { HttpPokeapiMockService } from '../../services/http/http-pokeapi/http-pokeapi.mock.service';

describe('PokedexDetail', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexDetail],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: HttpPokeapiService, useClass: HttpPokeapiMockService },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: '25' })) } },
      ],
    }).compileComponents();
  });

  it('renders the loaded Pokémon name, genus and base stats', async () => {
    const fixture = TestBed.createComponent(PokedexDetail);
    await fixture.whenStable();
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('pikachu');
    expect(text).toContain('Mouse Pokémon');
    expect(text).toContain('HP');
    expect(text).toContain('Linha evolutiva');
  });
});
