import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment';
import { HttpPokemonService } from './http-pokemon.service';
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

const baseUrl = environment.pokeapiBaseUrl;

describe('HttpPokemonService', () => {
  let service: HttpPokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HttpPokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getIndex faz a requisição de /pokemon com limit/offset e mapeia o array de results', () => {
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

  it('getType mapeia as referências de pokemon aninhadas', () => {
    let result: TypeDto | undefined;
    service.getType('electric').subscribe((value) => (result = value));

    httpMock.expectOne(`${baseUrl}/type/electric`).flush(getTypeMock);

    expect(result).toBeInstanceOf(TypeDto);
    expect(result?.pokemon.at(0)?.pokemon.name).toBe('pikachu');
  });

  it('getPokemon converte o payload snake_case para camelCase e mapeia os DTOs aninhados', () => {
    let result: PokemonDto | undefined;
    service.getPokemon(25).subscribe((value) => (result = value));

    httpMock.expectOne(service.buildPokemonUrl(25)).flush(getPokemonMock);

    expect(result).toBeInstanceOf(PokemonDto);
    expect(result?.height).toBe(4);
    expect(result?.abilities.at(1)?.isHidden).toBe(true);
    expect(result?.stats.at(0)?.baseStat).toBe(35);
    expect(result?.sprites.other.officialArtwork.frontDefault).toContain('official-artwork/25.png');
  });

  it('getSpecies mapeia genera/flavor text e converte as keys para camelCase', () => {
    let result: PokemonSpeciesDto | undefined;
    service.getSpecies(25).subscribe((value) => (result = value));

    httpMock.expectOne(service.buildSpeciesUrl(25)).flush(getSpeciesMock);

    expect(result).toBeInstanceOf(PokemonSpeciesDto);
    expect(result?.genera.at(0)?.genus).toBe('Mouse Pokémon');
    expect(result?.flavorTextEntries.at(0)?.flavorText).toContain('lightning');
    expect(result?.evolutionChain.url).toContain('/evolution-chain/10/');
  });

  it('getEvolutionChain mapeia a árvore recursiva de espécies', () => {
    let result: EvolutionChainDto | undefined;
    service.getEvolutionChain(10).subscribe((value) => (result = value));

    httpMock.expectOne(service.buildEvolutionChainUrl(10)).flush(getEvolutionChainMock);

    expect(result?.chain.species.name).toBe('pichu');
    expect(result?.chain.evolvesTo.at(0)?.species.name).toBe('pikachu');
    expect(result?.chain.evolvesTo.at(0)?.evolvesTo.at(0)?.species.name).toBe('raichu');
  });

  it('propaga um 404 como HttpErrorResponse', () => {
    let captured: HttpErrorResponse | undefined;
    service.getPokemon(999999).subscribe({
      next: () => {
        throw new Error('deveria ter falhado');
      },
      error: (error: HttpErrorResponse) => (captured = error),
    });

    httpMock
      .expectOne(service.buildPokemonUrl(999999))
      .flush(mock404NotFound, { status: 404, statusText: 'Not Found' });

    expect(captured?.status).toBe(404);
    expect(captured?.error).toEqual(mock404NotFound);
  });
});
