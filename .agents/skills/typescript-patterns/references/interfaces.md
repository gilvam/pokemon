# Interfaces

Interfaces describe **contracts / structural shapes** with no behavior. (For data that carries behavior or
invariants, use a class `.model.ts` instead — see `classes.md`.)

## File & name

- File ends in **`.interface.ts`**.
- The interface name is **prefixed with `I`**.
- The **filename drops the `I`** and kebab-cases the rest:

```
interface IUserGeneric   →   user-generic.interface.ts
interface IOrderRepository →  order-repository.interface.ts
```

```ts
// user-generic.interface.ts
export interface IUserGeneric {
  id: string;
  name: string;
}
```

> **House standard, stated explicitly:** the `I` prefix **diverges from the Google and Microsoft TypeScript
> style guides**, which recommend *no* prefix (TypeScript is structurally typed, so the marker is redundant).
> This project keeps the `I` prefix on purpose for at-a-glance contract recognition — apply it **consistently**
> to every interface. If you ever standardize the codebase away from it, drop the prefix everywhere at once;
> never mix `IUser` and `User` interfaces.

## When to use an interface vs a class vs a type

- **Interface (`I…`, `*.interface.ts`)** — a pure contract: an object shape, or the public API a class must
  implement (`class UserRepo implements IUserRepository`). No runtime footprint.
- **Class (`*.model.ts`)** — domain data with behavior/invariants, instantiated with `new` (see `classes.md`).
- **`type`** — only for what interfaces can't express: unions, tuples, mapped/conditional types, primitive
  aliases.

The TypeScript handbook notes interfaces and intersections extend more efficiently for the compiler than
`type` intersections — another reason to prefer an interface for a plain contract.

## Avoid

- Interfaces without the `I` prefix (house standard).
- Keeping the `I` in the **filename** (`iuser-generic.interface.ts` ❌ → `user-generic.interface.ts`).
- More than one interface per file, or mixing an interface into a class/enum file.
- Using an interface where the concept needs behavior — model it as a class instead.
