import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { HttpPokeapiService } from './http-pokeapi.service';
import { PokemonDto } from './models/pokemon.dto';
import { NamedApiResourceListDto } from './models/named-api-resource-list.dto';
import { TypeResponseDto } from './models/type-response.dto';

import pokemonMock from './mocks/get-pokemon/200-ok.json';
import pokemonListMock from './mocks/get-pokemon-list/200-ok.json';
import typeMock from './mocks/get-type/200-ok.json';
import mock404 from './mocks/get-pokemon/404-not-found.json';
import mock500 from './mocks/get-pokemon/500-internal-server-error.json';

const API_BASE = 'https://pokeapi.co/api/v2';

describe('HttpPokeapiService', () => {
  let service: HttpPokeapiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HttpPokeapiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('maps a pokemon into a PokemonDto instance', () => {
    let result: PokemonDto | undefined;
    service.getPokemon('pikachu').subscribe((dto) => (result = dto));

    const req = httpMock.expectOne(`${API_BASE}/pokemon/pikachu`);
    expect(req.request.method).toBe('GET');
    req.flush(pokemonMock);

    expect(result).toBeInstanceOf(PokemonDto);
    expect(result?.name).toBe('pikachu');
    expect(result?.sprites.other.official_artwork.front_default).toBe(
      'https://sprites/official-artwork/25.png',
    );
  });

  it('requests the full pokemon list with limit/offset params', () => {
    let result: NamedApiResourceListDto | undefined;
    service.getPokemonList().subscribe((dto) => (result = dto));

    const req = httpMock.expectOne((r) => r.url === `${API_BASE}/pokemon`);
    expect(req.request.params.get('limit')).toBe('100000');
    expect(req.request.params.get('offset')).toBe('0');
    req.flush(pokemonListMock);

    expect(result).toBeInstanceOf(NamedApiResourceListDto);
    expect(result?.results).toHaveLength(3);
  });

  it('maps a type response into a TypeResponseDto', () => {
    let result: TypeResponseDto | undefined;
    service.getType('fire').subscribe((dto) => (result = dto));

    httpMock.expectOne(`${API_BASE}/type/fire`).flush(typeMock);

    expect(result).toBeInstanceOf(TypeResponseDto);
    expect(result?.pokemon[0].pokemon.name).toBe('charmander');
  });

  const errorCases = [
    { name: '404-not-found', status: 404, mock: mock404 },
    { name: '500-internal-server-error', status: 500, mock: mock500 },
  ];

  errorCases.forEach(({ name, status, mock }) => {
    it(`propagates ${name} with status ${status}`, () => {
      let errorStatus: number | undefined;
      let errorBody: unknown;
      service.getPokemon('missingno').subscribe({
        next: () => {
          throw new Error('should have failed');
        },
        error: (error) => {
          errorStatus = error.status;
          errorBody = error.error;
        },
      });

      httpMock
        .expectOne(`${API_BASE}/pokemon/missingno`)
        .flush(mock, { status, statusText: 'Error' });

      expect(errorStatus).toBe(status);
      expect(errorBody).toEqual(mock);
    });
  });
});
