import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NamedApiResourceList, PokemonSpecies } from '../models/pokemon.models';
import { PokemonApiService } from './pokemon-api.service';

describe('PokemonApiService', () => {
  let service: PokemonApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PokemonApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('maps the paginated list response into name/id pairs', () => {
    let result: { name: string; id: number }[] | undefined;
    service.getAllPokemon().subscribe((pokemon) => (result = pokemon));

    const req = httpMock.expectOne(
      (request) => request.url === '/api/v2/pokemon' && request.params.get('limit') === '100000',
    );
    const response: NamedApiResourceList = {
      count: 2,
      next: null,
      previous: null,
      results: [
        { name: 'bulbasaur', url: '/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: '/api/v2/pokemon/2/' },
      ],
    };
    req.flush(response);

    expect(result).toEqual([
      { name: 'bulbasaur', id: 1 },
      { name: 'ivysaur', id: 2 },
    ]);
  });

  it('caches the full pokemon list and only requests it once', () => {
    service.getAllPokemon().subscribe();
    service.getAllPokemon().subscribe();

    const empty: NamedApiResourceList = { count: 0, next: null, previous: null, results: [] };
    httpMock.expectOne(() => true).flush(empty);
  });

  it('fetches a single pokemon by name', () => {
    service.getPokemonByName('pikachu').subscribe();
    const req = httpMock.expectOne('/api/v2/pokemon/pikachu');
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('extracts the english flavor text for a species', () => {
    let flavorText: string | null | undefined;
    service.getSpeciesFlavorText('pikachu').subscribe((text) => (flavorText = text));

    const species: PokemonSpecies = {
      id: 25,
      name: 'pikachu',
      flavor_text_entries: [
        { flavor_text: 'Texto em japonês', language: { name: 'ja', url: '' } },
        { flavor_text: 'When several\fof these gather.', language: { name: 'en', url: '' } },
      ],
    };
    httpMock.expectOne('/api/v2/pokemon-species/pikachu').flush(species);

    expect(flavorText).toBe('When several of these gather.');
  });

  it('returns null when there is no english flavor text', () => {
    let flavorText: string | null | undefined;
    service.getSpeciesFlavorText('pikachu').subscribe((text) => (flavorText = text));

    const species: PokemonSpecies = { id: 25, name: 'pikachu', flavor_text_entries: [] };
    httpMock.expectOne('/api/v2/pokemon-species/pikachu').flush(species);

    expect(flavorText).toBeNull();
  });
});
