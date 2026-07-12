import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PokemonDetail } from './pokemon-detail';
import pokemonMock from '../../services/http/http-pokemon/jsons/get-pokemon/200-ok.json';
import speciesMock from '../../services/http/http-pokemon/jsons/get-species/200-ok.json';
import evolutionMock from '../../services/http/http-pokemon/jsons/get-evolution-chain/200-ok.json';
import notFoundMock from '../../services/http/http-pokemon/jsons/get-pokemon/404-not-found.json';

function flushMicrotasks(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('PokemonDetail', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it(
    'mostra o loading e, em seguida, os dados completos (stats, tipos, habilidades, sprites, espécie, evolução)',
    async () => {
      const fixture = TestBed.createComponent(PokemonDetail);
      fixture.componentRef.setInput('id', '25');
      fixture.detectChanges();

      expect(fixture.nativeElement.textContent).toContain('Carregando');

      httpMock.expectOne((request) => request.url.endsWith('/pokemon/25')).flush(pokemonMock);
      await flushMicrotasks();
      fixture.detectChanges();

      httpMock
        .expectOne((request) => request.url.endsWith('/pokemon-species/25'))
        .flush(speciesMock);
      await flushMicrotasks();
      fixture.detectChanges();

      httpMock
        .expectOne((request) => request.url.endsWith('/evolution-chain/10'))
        .flush(evolutionMock);
      await flushMicrotasks();
      fixture.detectChanges();

      const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
      expect(text).toContain('pikachu');
      expect(text).toContain('electric');
      expect(text).toContain('static');
      expect(text).toContain('Mouse Pokémon');
      expect(text).toContain('pichu');
      expect(text).toContain('raichu');
    },
    10000,
  );

  it(
    'mostra uma mensagem amigável e link para voltar quando o Pokémon não é encontrado (404)',
    async () => {
      const fixture = TestBed.createComponent(PokemonDetail);
      fixture.componentRef.setInput('id', '999999');
      fixture.detectChanges();

      httpMock
        .expectOne((request) => request.url.endsWith('/pokemon/999999'))
        .flush(notFoundMock, { status: 404, statusText: 'Not Found' });
      await flushMicrotasks();
      fixture.detectChanges();

      const el = fixture.nativeElement as HTMLElement;
      expect(el.textContent).toContain('Não foi possível encontrar');
      expect(el.querySelector('a[href="/pokemon"]')).toBeTruthy();
    },
    10000,
  );
});
