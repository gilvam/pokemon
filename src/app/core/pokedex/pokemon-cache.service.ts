import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/** Bump to invalidate every persisted cache entry at once. */
const CACHE_VERSION = 'v1';
const KEY_PREFIX = `pokedex:${CACHE_VERSION}:`;

/**
 * Two-level cache: a process-lifetime in-memory `Map` plus optional
 * `localStorage` persistence. All persistence is guarded for SSR/no-storage.
 */
@Injectable({ providedIn: 'root' })
export class PokemonCacheService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly memory = new Map<string, unknown>();

  get<T>(key: string): T | undefined {
    if (this.memory.has(key)) {
      return this.memory.get(key) as T;
    }
    const persisted = this.readPersisted<T>(key);
    if (persisted !== undefined) {
      this.memory.set(key, persisted);
    }
    return persisted;
  }

  set<T>(key: string, value: T, persist = false): void {
    this.memory.set(key, value);
    if (persist) {
      this.writePersisted(key, value);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  private readPersisted<T>(key: string): T | undefined {
    if (!this.isBrowser) return undefined;
    try {
      const raw = localStorage.getItem(KEY_PREFIX + key);
      return raw === null ? undefined : (JSON.parse(raw) as T);
    } catch {
      return undefined;
    }
  }

  private writePersisted<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(KEY_PREFIX + key, JSON.stringify(value));
    } catch {
      // Quota exceeded or storage disabled — degrade silently to memory-only.
    }
  }
}
