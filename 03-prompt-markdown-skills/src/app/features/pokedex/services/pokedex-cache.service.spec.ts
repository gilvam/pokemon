import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { PokedexCacheService } from './pokedex-cache.service';

describe('PokedexCacheService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  function create(platform: 'browser' | 'server'): PokedexCacheService {
    TestBed.configureTestingModule({
      providers: [PokedexCacheService, { provide: PLATFORM_ID, useValue: platform }],
    });
    return TestBed.inject(PokedexCacheService);
  }

  it('returns null for a missing key', () => {
    expect(create('browser').get('missing')).toBeNull();
  });

  it('round-trips a value through memory and localStorage in the browser', () => {
    const cache = create('browser');

    cache.set('list', [1, 2, 3]);

    expect(cache.get<number[]>('list')).toEqual([1, 2, 3]);
    expect(localStorage.getItem('pokedex:v1:list')).toBe('[1,2,3]');
  });

  it('never touches localStorage on the server but still serves from memory', () => {
    const cache = create('server');

    cache.set('list', [1]);

    expect(localStorage.getItem('pokedex:v1:list')).toBeNull();
    expect(cache.get<number[]>('list')).toEqual([1]);
  });
});
