import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { PokedexDetail } from './pokedex-detail';
import { HttpPokeapiService } from '../../services/http/http-pokeapi/http-pokeapi.service';
import { HttpPokeapiMockService } from '../../services/http/http-pokeapi/http-pokeapi.mock.service';

describe('PokedexDetail', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PokedexDetail],
      providers: [
        provideRouter([]),
        provideNoopAnimations(),
        { provide: HttpPokeapiService, useClass: HttpPokeapiMockService },
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: '4' })) } },
      ],
    }).compileComponents();
  });

  it('should load and render the Pokémon name from the mock service', () => {
    const fixture = TestBed.createComponent(PokedexDetail);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.detail__name')?.textContent).toContain('4');
  });
});
