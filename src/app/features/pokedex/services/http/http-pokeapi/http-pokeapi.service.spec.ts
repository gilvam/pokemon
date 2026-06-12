import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpPokeapiService } from './http-pokeapi.service';
import { PokemonListResponseDto } from './models/pokemon-list-response.dto';
import { PokemonDto } from './models/pokemon.dto';
import { PokemonSpeciesDto } from './models/pokemon-species.dto';
import { EvolutionChainDto } from './models/evolution-chain.dto';
import { TypeDto } from './models/type.dto';
import getIndexMock from './jsons/get-index/200-ok.json';
import getTypeMock from './jsons/get-type/200-ok.json';
import getPokemonMock from './jsons/get-pokemon/200-ok.json';
import getSpeciesMock from './jsons/get-species/200-ok.json';
import getEvolutionChainMock from './jsons/get-evolution-chain/200-ok.json';
import mock404NotFound from './jsons/get-pokemon/404-not-found.json';
import mock500InternalServerError from './jsons/get-pokemon/500-internal-server-error.json';

const baseUrl = 'https://pokeapi.co/api/v2';

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

  afterEach(() => {
    httpMock.verify();
  });

  it('getIndex requests /pokemon with limit/offset and maps the results array', () => {
    let result: PokemonListResponseDto | undefined;
    service.getIndex(2, 0).subscribe((value) => (result = value));

    const req = httpMock.expectOne((request) => request.url === `${baseUrl}/pokemon`);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('limit')).toBe('2');
    expect(req.request.params.get('offset')).toBe('0');
    req.flush(getIndexMock);

    expect(result).toBeInstanceOf(PokemonListResponseDto);
    expect(result?.count).toBe(1302);
    expect(result?.results).toHaveLength(2);
    expect(result?.results.at(0)?.name).toBe('bulbasaur');
  });

  it('getType maps the nested pokemon references', () => {
    let result: TypeDto | undefined;
    service.getType('grass').subscribe((value) => (result = value));

    httpMock.expectOne(`${baseUrl}/type/grass`).flush(getTypeMock);

    expect(result).toBeInstanceOf(TypeDto);
    expect(result?.pokemon.at(0)?.pokemon.name).toBe('bulbasaur');
  });

  it('getPokemon camelCases the snake_case payload and maps nested DTOs', () => {
    let result: PokemonDto | undefined;
    service.getPokemon(25).subscribe((value) => (result = value));

    httpMock.expectOne(`${baseUrl}/pokemon/25`).flush(getPokemonMock);

    expect(result).toBeInstanceOf(PokemonDto);
    expect(result?.baseExperience).toBe(112);
    expect(result?.abilities.at(1)?.isHidden).toBe(true);
    expect(result?.stats.at(0)?.baseStat).toBe(35);
    expect(result?.sprites.other.officialArtwork.frontDefault).toContain('official-artwork/25.png');
  });

  it('getSpecies maps rarity flags and camelCases keys', () => {
    let result: PokemonSpeciesDto | undefined;
    service.getSpecies(25).subscribe((value) => (result = value));

    httpMock.expectOne(`${baseUrl}/pokemon-species/25`).flush(getSpeciesMock);

    expect(result).toBeInstanceOf(PokemonSpeciesDto);
    expect(result?.captureRate).toBe(190);
    expect(result?.isMythical).toBe(false);
    expect(result?.genera.at(0)?.genus).toBe('Mouse Pokémon');
    expect(result?.flavorTextEntries.at(0)?.flavorText).toContain('lightning');
    expect(result?.evolutionChain.url).toContain('/evolution-chain/10/');
  });

  it('getEvolutionChain maps the recursive species tree', () => {
    let result: EvolutionChainDto | undefined;
    service.getEvolutionChain(10).subscribe((value) => (result = value));

    httpMock.expectOne(`${baseUrl}/evolution-chain/10`).flush(getEvolutionChainMock);

    expect(result?.chain.species.name).toBe('pichu');
    expect(result?.chain.evolvesTo.at(0)?.species.name).toBe('pikachu');
    expect(result?.chain.evolvesTo.at(0)?.evolvesTo.at(0)?.species.name).toBe('raichu');
  });

  const errorCases = [
    { name: '404-not-found', status: 404, mock: mock404NotFound },
    { name: '500-internal-server-error', status: 500, mock: mock500InternalServerError },
  ];

  errorCases.forEach(({ name, status, mock }) => {
    it(`propagates ${name} as an HttpErrorResponse`, () => {
      let captured: HttpErrorResponse | undefined;
      service.getPokemon(25).subscribe({
        next: () => {
          throw new Error('should have failed');
        },
        error: (error: HttpErrorResponse) => (captured = error),
      });

      httpMock.expectOne(`${baseUrl}/pokemon/25`).flush(mock, { status, statusText: 'Error' });

      expect(captured?.status).toBe(status);
      expect(captured?.error).toEqual(mock);
    });
  });
});
