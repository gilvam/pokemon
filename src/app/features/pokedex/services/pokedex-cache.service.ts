import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Two-tier, versioned cache: an in-memory `Map` backed by `localStorage`.
 * SSR-safe (no storage access on the server) and version-namespaced so a schema
 * change invalidates every stale entry at once.
 */
@Injectable({
  providedIn: 'root',
})
export class PokedexCacheService {
  private static readonly prefix = 'pokedex:v1:';
  private readonly memory = new Map<string, unknown>();
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  get<T>(key: string): T | null {
    if (this.memory.has(key)) {
      return this.memory.get(key) as T;
    }
    const stored = this.readStorage<T>(key);
    if (stored !== null) {
      this.memory.set(key, stored);
    }
    return stored;
  }

  set<T>(key: string, value: T): void {
    this.memory.set(key, value);
    this.writeStorage(key, value);
  }

  private readStorage<T>(key: string): T | null {
    if (!this.isBrowser) {
      return null;
    }
    try {
      const raw = localStorage.getItem(PokedexCacheService.prefix + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      // Corrupt JSON or storage disabled — fall back to the network.
      return null;
    }
  }

  private writeStorage<T>(key: string, value: T): void {
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(PokedexCacheService.prefix + key, JSON.stringify(value));
    } catch {
      // Quota exceeded or storage disabled — the in-memory cache still serves the session.
    }
  }
}
