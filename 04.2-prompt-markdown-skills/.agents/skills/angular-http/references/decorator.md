# Validate the `@Dto()` decorator

Every DTO depends on the `@Dto()` decorator. Confirm it exists before generating DTOs.

Glob for the decorator anywhere in the project (e.g. `**/_decorators/class.decorator.ts`); it
conventionally lives at `[app-root]/_decorators/class.decorator.ts`.

- **If present** (the normal case): reuse it. The decorator stays **app-wide at `[app-root]/_decorators/`**,
  but the module may sit at any `[host]` (an owning feature, or the app root — see `folder-structure.md`), so
  **prefer the project's TS path alias** if one is configured (e.g. `import { Dto } from '@decorators/class.decorator';`)
  — it survives wherever `[host]` lands. Otherwise **compute the import relative to the DTO's actual
  location**. For the app-root layout — a DTO at `[app-root]/services/http/http-[service-name]/models/` and the
  decorator at `[app-root]/_decorators/` — the import is:
  ```typescript
  import { Dto } from '../../../../_decorators/class.decorator';
  ```
  That `../../../../` depth holds only for an app-root `[host]`. A **feature-scoped** module
  (`features/<feature>/services/http/http-[service-name]/models/`) is deeper, so recompute the relative path
  (it gains the feature segments) — or, better, use the path alias.

- **If missing**: vendor it before continuing. WebFetch the decorator source from
  `https://github.com/gilvam/typescript-utils/tree/main/src/decorators/class` (use the raw file
  URL) and Write it to `[app-root]/_decorators/class.decorator.ts`. Then proceed.

## What `@Dto()` does (and does not) do

The decorator normalizes the **constructor** arguments and the static **`create`** /
**`createArray`** arguments, driven by an options object:

| Option         | Default | Behavior                                                                                                                                                                                                  |
| -------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `noNullValue`  | `true`  | Converts `null` → `undefined` (shallow, at argument level) for the constructor **and** the factories, letting the TypeScript default parameter values take over — `null`, `{}`, missing keys, and partial payloads all collapse to safe defaults. |
| `keyCamelCase` | `false` | Recursively converts the keys of received objects to camelCase — nested objects and arrays included. Applied **only** to the static `create()` / `createArray()` arguments; a plain `new` receives the keys as-is.                                                          |
| `defaultValues` | `undefined` | Deep-fills the **empty** fields (`null` / `undefined` / `''`) of the `create()` / `createArray()` arguments — and any missing keys — from a default template; `0` and `false` are kept. Applied **only** to the factories (never `new`); each array element gets its **own deep clone**. |

Enable `keyCamelCase` whenever the API payload uses keys that are **not camelCase**
(`first_name`, `UserData`, `user-id`, …) — but only on the **root DTOs** whose `create()` /
`createArray()` the `http-*` files call inside the RxJS `map` with the raw API response. The
conversion is deep, so nested DTOs receive already-camelCased objects and keep the plain
`@Dto()` — do not put the flag on every `.dto.ts`. Keep the DTO properties in camelCase —
never mirror the API's casing into the class. Because the conversion
runs **only in the factories**, raw API JSON must always enter through `create()` /
`createArray()` — never through `new` (which this skill already mandates for services). See
[dto.md](dto.md).

Null conversion is shallow, and the key conversion does **not** instantiate nested DTOs. Parent
DTOs must still map their children **explicitly** via `Child.create(...)` /
`Child.createArray(...)` — see [dto.md](dto.md).

## Backfilling with `defaultValues`

When the API returns a **partial** payload and the consumer wants a known-good default JSON to
complete it, pass `@Dto({ defaultValues: <template> })`. Like `keyCamelCase`, it runs **only** in
`create()` / `createArray()` (a plain `new` is untouched) and fills **deeply**:

- "Empty" means `null`, `undefined`, or `''` — these are replaced by the template value. **`0` and
  `false` are kept** (they are not empty), and an empty `''` **is** overwritten, so never enable it
  on a field where a blank string is meaningful.
- Missing keys are added from the template; nested objects merge key-by-key and arrays fill
  element-by-element. Each `createArray` element receives its **own deep clone** — no shared
  references between rows.
- Because the option order is `keyCamelCase` → `noNullValue` → `defaultValues`, the payload is
  camelCased **before** the fill — so author the template in the **camelCase DTO shape**, even when
  the API is snake_case and you also pass `keyCamelCase: true`.
- `noNullValue` collapses a top-level `null` / `undefined` argument to `undefined` first, so
  `create(null)`, `create(undefined)` and `create({})` all yield the **full template**.

Put `defaultValues` **only on the root DTO** whose factory the `http-*` files call with the raw
response — the deep fill normalizes the whole tree in one pass, so nested DTOs keep the plain
`@Dto()`. The fill supplies **values only**; parents still compose children **explicitly** via
`Child.create(...)` / `Child.createArray(...)`. See [dto.md](dto.md).

### What the fill produces

The template is **always the DTO's own shape** (or an array of it) — in practice the module's
success fixture `jsons/[method]/200-ok.json` reused as `jsonDefault` (see [dto.md](dto.md)). Real
values pass through; only the empty leaves (`null` / `undefined` / `''`) are taken from the template:

```typescript
// 1) template — jsonDefault, e.g. jsons/[method]/200-ok.json
{
	id: 25,
	name: 'pikachu',
	experience: 112,
	sprites: {
		front: '25.png',
		back: 'back/25.png',
		other: { officialArtwork: { default: '25.png' } },
	},
	stats: [{ baseStat: 35, stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' } }],
}
```

```typescript
// 2) create() argument — a partial API response
{
	id: null,
	name: 'Raichu',
	experience: 300,
	sprites: {
		front: '30.png',
		back: '',
		other: undefined,
	},
	stats: [{ baseStat: 100, stat: { name: undefined, url: '' } }],
}
```

```typescript
// 3) result — empties filled from the template, real values kept
{
	id: 25,            // null → filled
	name: 'Raichu',    // kept
	experience: 300,   // kept
	sprites: {
		front: '30.png',                                   // kept
		back: 'back/25.png',                               // '' → filled
		other: { officialArtwork: { default: '25.png' } }, // undefined → filled (deep)
	},
	stats: [{ baseStat: 100, stat: { name: 'hp', url: 'https://pokeapi.co/api/v2/stat/1/' } }],
	// baseStat kept; stat.name undefined → 'hp'; stat.url '' → filled
}
```

## Reference

The decorator's behavior is covered by `[app-root]/_decorators/class.decorator.spec.ts`
(upstream:
`https://github.com/gilvam/typescript-utils/blob/main/src/decorators/class/class.decorator.spec.ts`):
it verifies null→undefined for constructor args and for `create`/`createArray`, the deep
key→camelCase conversion when `keyCamelCase: true` (and that keys pass through untouched when
it is off), the deep `defaultValues` fill of empty fields in the factories (keeping `0` / `false`,
replacing `''`, cloning per array element, and never touching the constructor), that other static
methods are untouched, and that the prototype chain / static properties are preserved.
