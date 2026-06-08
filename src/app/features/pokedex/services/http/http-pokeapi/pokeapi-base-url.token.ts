import { InjectionToken } from '@angular/core';

/** Base URL of the PokeAPI v2. Overridable in tests. */
export const POKEAPI_BASE_URL = new InjectionToken<string>('POKEAPI_BASE_URL', {
  providedIn: 'root',
  factory: () => 'https://pokeapi.co/api/v2',
});
