import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { HttpPokeapiService } from './http-pokeapi.service';
import { POKEAPI_BASE_URL } from './pokeapi-base-url.token';

const BASE_URL = 'https://api.test/v2';

describe('HttpPokeapiService (integration)', () => {
  let service: HttpPokeapiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: POKEAPI_BASE_URL, useValue: BASE_URL },
      ],
    });

    service = TestBed.inject(HttpPokeapiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should request the full Pokémon index with limit and offset', () => {
    // Arrange
    let count = 0;

    // Act
    service.getPokemonIndex().subscribe((response) => {
      count = response.count;
    });
    const request = httpMock.expectOne(
      (req) => req.url === `${BASE_URL}/pokemon` && req.params.get('limit') === '100000',
    );
    request.flush({ count: 1, results: [{ name: 'pikachu', url: 'x/25/' }] });

    // Assert
    expect(request.request.params.get('offset')).toBe('0');
    expect(count).toBe(1);
  });

  it('should map a type response into typed DTOs', () => {
    // Arrange
    let names: string[] = [];

    // Act
    service.getType('fire').subscribe((response) => {
      names = response.pokemon.map((entry) => entry.pokemon.name);
    });
    httpMock
      .expectOne(`${BASE_URL}/type/fire`)
      .flush({ id: 10, name: 'fire', pokemon: [{ slot: 1, pokemon: { name: 'charmander', url: 'x/4/' } }] });

    // Assert
    expect(names).toEqual(['charmander']);
  });

  it('should map a pokemon response and flatten official artwork', () => {
    // Arrange
    let artwork = '';

    // Act
    service.getPokemon(25).subscribe((pokemon) => {
      artwork = pokemon.sprites.officialArtwork;
    });
    httpMock.expectOne(`${BASE_URL}/pokemon/25`).flush({
      id: 25,
      name: 'pikachu',
      sprites: { other: { 'official-artwork': { front_default: 'art.png' } } },
    });

    // Assert
    expect(artwork).toBe('art.png');
  });

  it('should surface a 404 error to the caller', () => {
    // Arrange
    let errorStatus = 0;

    // Act
    service.getPokemon('missingno').subscribe({
      error: (error: { status: number }) => {
        errorStatus = error.status;
      },
    });
    httpMock
      .expectOne(`${BASE_URL}/pokemon/missingno`)
      .flush('Not Found', { status: 404, statusText: 'Not Found' });

    // Assert
    expect(errorStatus).toBe(404);
  });
});
