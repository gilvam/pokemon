import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Bump to invalidate previously persisted caches after a shape change. */
const CACHE_VERSION = 'v1';
const KEY_PREFIX = `pokedex:${CACHE_VERSION}:`;

/**
 * Two-level cache for Pokédex indices: an in-memory map for the current
 * session plus a versioned `localStorage` layer that survives reloads. All
 * `localStorage` access is guarded so it is a no-op during SSR.
 */
@Injectable({ providedIn: 'root' })
export class PokedexCache {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly memory = new Map<string, unknown>();

  read<T>(key: string): T | undefined {
    if (this.memory.has(key)) {
      return this.memory.get(key) as T;
    }

    const persisted = this.readPersisted<T>(key);
    if (persisted !== undefined) {
      this.memory.set(key, persisted);
    }
    return persisted;
  }

  write<T>(key: string, value: T): void {
    this.memory.set(key, value);
    if (!this.isBrowser) {
      return;
    }
    try {
      localStorage.setItem(`${KEY_PREFIX}${key}`, JSON.stringify(value));
    } catch {
      // Quota exceeded or storage disabled — the in-memory copy still serves.
    }
  }

  private readPersisted<T>(key: string): T | undefined {
    if (!this.isBrowser) {
      return undefined;
    }
    try {
      const raw = localStorage.getItem(`${KEY_PREFIX}${key}`);
      return null === raw ? undefined : (JSON.parse(raw) as T);
    } catch {
      return undefined;
    }
  }
}
