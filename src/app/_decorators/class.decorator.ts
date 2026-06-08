// Decorators must accept any constructor signature, hence the `any[]` args.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor<T = unknown> = new (...args: any[]) => T;

/**
 * Class decorator that converts `null` into `undefined` for:
 * - constructor arguments;
 * - the static `create()` / `createArray()` factory arguments.
 *
 * This lets TypeScript default parameter values take over, so `null`, `{}`,
 * missing keys, and partial payloads collapse to safe defaults. It does NOT
 * recurse into nested objects/arrays — parent DTOs must map children explicitly
 * via `Child.create(...)` / `Child.createArray(...)`.
 *
 * Vendored from https://github.com/gilvam/typescript-utils (adapted to the
 * project's `create`/`createArray` factory naming).
 */
export function NoNull() {
  return function <T extends Constructor>(Ctor: T): T {
    const factoryMethods = ['create', 'createArray'];

    const normalizeNullArgs = (args: unknown[]): unknown[] =>
      args.map((arg) => (null === arg ? undefined : arg));

    const wrapped = function (...args: unknown[]) {
      return Reflect.construct(Ctor, normalizeNullArgs(args), new.target);
    } as unknown as T;

    wrapped.prototype = Ctor.prototype;

    Object.getOwnPropertyNames(Ctor).forEach((name) => {
      if (name === 'prototype') {
        return;
      }

      const descriptor = Object.getOwnPropertyDescriptor(Ctor, name)!;

      if (factoryMethods.includes(name) && typeof descriptor.value === 'function') {
        const original = descriptor.value;
        descriptor.value = function (...args: unknown[]) {
          return original.apply(this, normalizeNullArgs(args));
        };
      }

      Object.defineProperty(wrapped, name, descriptor);
    });

    return wrapped;
  };
}
