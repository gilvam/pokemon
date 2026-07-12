import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HttpPokemonService } from './http/http-pokemon/http-pokemon.service';
import { PokemonListResponseDto } from './http/http-pokemon/models/pokemon-list-response.dto';
import { TypeDto } from './http/http-pokemon/models/type.dto';
import { PokemonIndexStore } from './pokemon-index.store';
import { PokemonIndexStatus } from '../models/pokemon-index-status.enum';
import { PokemonType } from '../models/pokemon-type.enum';
import { TypePalette } from '../models/type-palette.model';

describe('PokemonIndexStore', () => {
  let store: PokemonIndexStore;
  let getIndex: ReturnType<typeof vi.fn>;
  let getType: ReturnType<typeof vi.fn>;

  const index = PokemonListResponseDto.create({
    count: 2,
    results: [
      { name: 'bulbasaur', url: '/api/v2/pokemon/1/' },
      { name: 'charmander', url: '/api/v2/pokemon/4/' },
    ],
  });

  function typeOf(name: string, pokemonUrls: { slot: number; url: string }[]): TypeDto {
    return TypeDto.create({
      name,
      pokemon: pokemonUrls.map(({ slot, url }) => ({ slot, pokemon: { name: '', url } })),
    });
  }

  beforeEach(() => {
    getIndex = vi.fn(() => of(index));
    getType = vi.fn((name: string) => {
      if (name === PokemonType.GRASS) {
        return of(typeOf('grass', [{ slot: 1, url: '/api/v2/pokemon/1/' }]));
      }
      if (name === PokemonType.FIRE) {
        return of(typeOf('fire', [{ slot: 1, url: '/api/v2/pokemon/4/' }]));
      }
      return of(typeOf(name, []));
    });

    TestBed.configureTestingModule({
      providers: [{ provide: HttpPokemonService, useValue: { getIndex, getType } }],
    });
    store = TestBed.inject(PokemonIndexStore);
  });

  it('começa idle e sem summaries', () => {
    expect(store.status()).toBe(PokemonIndexStatus.IDLE);
    expect(store.summaries()).toEqual([]);
  });

  it('carrega o índice + o mapa de tipos e monta os summaries', () => {
    store.loadIndex();

    expect(store.status()).toBe(PokemonIndexStatus.READY);
    expect(getType).toHaveBeenCalledTimes(TypePalette.all().length);
    expect(store.summaries()).toHaveLength(2);
    expect(store.summaries().find((s) => s.id === 1)?.types).toEqual([PokemonType.GRASS]);
    expect(store.summaries().find((s) => s.id === 4)?.types).toEqual([PokemonType.FIRE]);
  });

  it('não recarrega quando já está pronto', () => {
    store.loadIndex();
    store.loadIndex();

    expect(getIndex).toHaveBeenCalledTimes(1);
  });

  it('vai para o estado de erro quando a requisição falha', () => {
    getIndex.mockReturnValue(throwError(() => new Error('falhou')));

    store.loadIndex();

    expect(store.status()).toBe(PokemonIndexStatus.ERROR);
  });
});
