import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PokedexList } from './pokedex-list';
import indexMock from '../../services/http/http-pokeapi/jsons/get-index/200-ok.json';
import typeMock from '../../services/http/http-pokeapi/jsons/get-type/200-ok.json';

describe('PokedexList', () => {
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [PokedexList],
      providers: [
        provideZonelessChangeDetection(),
        provideNoopAnimations(),
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify({ ignoreCancelled: true });
  });

  it('shows a loading bar and then renders cards once the index resolves', async () => {
    const fixture = TestBed.createComponent(PokedexList);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('mat-progress-bar')).toBeTruthy();

    httpMock.expectOne((request) => request.url.endsWith('/pokemon')).flush(indexMock);
    httpMock
      .match((request) => request.url.includes('/type/'))
      .forEach((request) => request.flush(typeMock));

    await fixture.whenStable();
    fixture.detectChanges();

    expect(host.textContent).toContain('Pokémon encontrados');
    expect(host.querySelectorAll('app-pokemon-card').length).toBeGreaterThan(0);
  });
});
