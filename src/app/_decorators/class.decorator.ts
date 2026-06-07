/* eslint-disable @typescript-eslint/no-explicit-any */
type Constructor<T = unknown> = new (...args: any[]) => T;

/**
 * Vendored from https://github.com/gilvam/typescript-utils (src/decorators), adapted so the
 * normalized static factories are `create` / `createArray` — the names the DTO contract uses
 * (the upstream variant intercepts `execute` / `executeArray`).
 *
 * Converts `null` → `undefined` for:
 * - constructor arguments
 * - the static `create()` / `createArray()` arguments
 *
 * That lets default parameter values take over, so `null`, `{}`, missing keys and partial
 * payloads all collapse to the DTO's safe defaults. It does NOT recurse into nested objects or
 * arrays — parent DTOs must map children explicitly via `Child.create()` / `Child.createArray()`.
 */
export function NoNull() {
  return function <T extends Constructor>(Ctor: T): T {
    const normalizedStatics = ['create', 'createArray'];
    const normalizeNullArgs = (args: any[]): any[] =>
      args.map((arg) => (arg === null ? undefined : arg));

    const wrapped: any = function (...args: any[]) {
      return Reflect.construct(Ctor, normalizeNullArgs(args), new.target);
    };

    wrapped.prototype = Ctor.prototype;

    Object.getOwnPropertyNames(Ctor).forEach((name) => {
      if (name === 'prototype') {
        return;
      }
      const descriptor = Object.getOwnPropertyDescriptor(Ctor, name)!;
      if (normalizedStatics.includes(name) && typeof descriptor.value === 'function') {
        const originalFactory = descriptor.value;
        descriptor.value = function (...args: any[]) {
          return originalFactory.apply(this, normalizeNullArgs(args));
        };
      }
      Object.defineProperty(wrapped, name, descriptor);
    });

    return wrapped as T;
  };
}
