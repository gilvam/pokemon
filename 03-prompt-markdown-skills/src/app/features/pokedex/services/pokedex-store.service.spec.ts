import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PokedexStore } from './pokedex-store.service';
import { LoadStatus } from '../models/load-status.enum';
import { SortOption } from '../models/sort-option.enum';
import indexMock from './http/http-pokeapi/jsons/get-index/200-ok.json';
import typeMock from './http/http-pokeapi/jsons/get-type/200-ok.json';

describe('PokedexStore', () => {
  let store: PokedexStore;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    store = TestBed.inject(PokedexStore);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify({ ignoreCancelled: true });
  });

  function loadIndex(): void {
    store.loadIndex();
    httpMock.expectOne((request) => request.url.endsWith('/pokemon')).flush(indexMock);
    const typeRequests = httpMock.match((request) => request.url.includes('/type/'));
    expect(typeRequests).toHaveLength(18);
    typeRequests.forEach((request) => request.flush(typeMock));
  }

  it('starts idle with no data', () => {
    expect(store.status()).toBe(LoadStatus.IDLE);
    expect(store.hasData()).toBe(false);
  });

  it('loads the index (1 + 18 requests) and builds the summaries', () => {
    loadIndex();

    expect(store.status()).toBe(LoadStatus.READY);
    expect(store.hasData()).toBe(true);
    expect(store.total()).toBe(2);
  });

  it('marks the status as error when the index request fails', () => {
    store.loadIndex();
    // forkJoin errors on the failed index and cancels the in-flight type requests.
    httpMock
      .expectOne((request) => request.url.endsWith('/pokemon'))
      .flush('boom', {
        status: 500,
        statusText: 'Error',
      });

    expect(store.status()).toBe(LoadStatus.ERROR);
  });

  it('filters by search across the built summaries', () => {
    loadIndex();

    store.search.set('ivy');

    expect(store.total()).toBe(1);
  });

  it('paginates the filtered list', () => {
    loadIndex();
    store.sort.set(SortOption.NUMBER_ASC);

    store.pageSize.set(1);
    store.pageIndex.set(1);

    expect(store.pageItems()).toHaveLength(1);
    expect(store.pageItems().at(0)?.id).toBe(2);
  });

  it('resets every filter and the page index', () => {
    loadIndex();
    store.search.set('ivy');
    store.pageIndex.set(3);

    store.resetFilters();

    expect(store.search()).toBe('');
    expect(store.pageIndex()).toBe(0);
    expect(store.total()).toBe(2);
  });
});
