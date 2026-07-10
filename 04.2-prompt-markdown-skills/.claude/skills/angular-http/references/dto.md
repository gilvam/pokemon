# DTO rules

Every DTO class must:

- Import `Dto` from the decorator and apply `@Dto()` immediately above the class. The relative
  import depth depends on where the module and decorator land — see [decorator.md](decorator.md); for the
  conventional layout it is `../../../../_decorators/class.decorator`.
- When the API payload has keys that are **not camelCase** (snake_case, PascalCase, kebab-case),
  apply `@Dto({ keyCamelCase: true })` — but **only on the root DTOs** whose `create()` /
  `createArray()` the `http-*` files (service and mock service) call inside the RxJS `map` with
  the raw API response. The conversion is deep (nested objects and arrays included), so nested
  DTOs receive already-camelCased objects and keep the plain `@Dto()`. Class properties stay in
  camelCase everywhere — never mirror the API's casing — and the conversion runs **only** in
  `create()` / `createArray()`, never in `new`, so raw JSON always enters through the factories.
  See [Non-camelCase API payloads](#non-camelcase-api-payloads).
- When the consumer asks for a **default JSON to complete a partial API response**, add
  `@Dto({ defaultValues: jsonDefault })` on the **root DTOs only** — see
  [Completing partial API responses](#completing-partial-api-responses-defaultvalues).
- Use constructor `public` properties with a safe default for **every** field.
- Expose `static create(item: Partial<Dto> = new this()): Dto`.
- Expose `static createArray(items: Partial<Dto>[] = []): Dto[]` when the DTO can appear in
  arrays.
- Map nested objects explicitly with `ChildDto.create(item.child)`.
- Map nested arrays explicitly with `ChildDto.createArray(item.items)`.

Never use `Object.assign`, spreads, raw JSON passthrough, or implicit constructor mapping for
nested DTOs. Never rely on `@Dto()` alone to convert nested structures (it does not recurse
— see [decorator.md](decorator.md)).

## Safe defaults by type

| Type        | Default            |
| ----------- | ------------------ |
| `string`    | `''`               |
| `number`    | `0`                |
| `boolean`   | `false`            |
| object DTO  | `new ChildDto()`   |
| DTO array   | `[]`               |
| enum        | safest enum member |

## Preferred DTO shape

```typescript
import { Dto } from '../../../../_decorators/class.decorator';
import { UserDto } from './user.dto';
import { RoleDto } from './role.dto';

@Dto()
export class UserResponseDto {
	constructor(
		public user = new UserDto(),
		public roles: RoleDto[] = [],
		public total = 0,
	) {}

	static create(item: Partial<UserResponseDto> = new this()): UserResponseDto {
		return new this(
			UserDto.create(item.user),
			RoleDto.createArray(item.roles),
			item.total,
		);
	}

	static createArray(items: Partial<UserResponseDto>[] = []): UserResponseDto[] {
		return (items).map((item) => UserResponseDto.create(item));
	}
}
```

## Non-camelCase API payloads

When the endpoint returns keys like `first_name` / `UserData` / `user-id`, the DTO stays
**identical** to the camelCase case — only the decorator options change:

```typescript
import { Dto } from '../../../../_decorators/class.decorator';
import { UserDataDto } from './user-data.dto';

@Dto({ keyCamelCase: true })
export class UserDto {
	constructor(
		public firstName = '',
		public userData = new UserDataDto(),
	) {}

	static create(item: Partial<UserDto> = new this()): UserDto {
		return new this(item.firstName, UserDataDto.create(item.userData));
	}
}
```

`UserDto.create({ first_name: 'Ana', user_data: { … } })` yields `firstName: 'Ana'` and hands the
already-camelCased `userData` object to `UserDataDto.create(...)`. That is exactly why the flag
belongs **only on this root DTO** — the one whose factory the `http-*` service calls in the
`map` with the raw API response: the deep conversion normalizes the whole tree up front, so the
nested `UserDataDto` keeps the plain `@Dto()`. Do not spread `{ keyCamelCase: true }` across
every `.dto.ts` of the module. Two limits to keep in mind: the conversion renames keys only —
explicit `create()`/`createArray()` mapping for nested DTOs is still required — and it runs
**only** in the static factories, so `new UserDto(rawJson)` would skip it entirely.

Keep the `jsons/` fixtures in the API's **original** casing so the specs prove the conversion —
see [testing.md](testing.md).

## Completing partial API responses (`defaultValues`)

When the endpoint returns **partial** data and the consumer asks for a default JSON to fill the
gaps, pass a template to `@Dto({ defaultValues })`. The decorator deep-fills every **empty** field
(`null` / `undefined` / `''`) — and any **missing** key — from the template, inside
`create()` / `createArray()` only (never `new`). `0` and `false` survive; `''` is replaced; each
`createArray` element is filled independently. See [decorator.md](decorator.md) for the full
mechanics and a worked template → argument → result example.

The template is **always the DTO's own shape** (or an array of it) — a complete, known-good default.
**Reuse the module's success fixture `jsons/[method]/200-ok.json`** as that default: import it as
`jsonDefault` and hand it to the decorator. No extra file is needed — the same canonical response the
service spec flushes doubles as the backfill source.

```json
// jsons/get/200-ok.json — the complete known-good response, reused as the default
{
	"id": 25,
	"name": "pikachu",
	"experience": 112,
	"sprites": {
		"front": "25.png",
		"back": "back/25.png",
		"other": { "officialArtwork": { "default": "25.png" } }
	},
	"stats": [{ "baseStat": 35, "stat": { "name": "hp", "url": "https://pokeapi.co/api/v2/stat/1/" } }]
}
```

```typescript
// models/pokemon.dto.ts
import { Dto } from '../../../../_decorators/class.decorator';
import jsonDefault from '../jsons/get/200-ok.json'; // tsconfig: resolveJsonModule
import { PokemonSpritesDto } from './pokemon-sprites.dto';
import { PokemonStatDto } from './pokemon-stat.dto';

@Dto({ defaultValues: jsonDefault }) // root DTO only — the deep fill covers the whole tree
export class PokemonDto {
	constructor(
		public id = 0,
		public name = '',
		public experience = 0,
		public sprites = new PokemonSpritesDto(),
		public stats: PokemonStatDto[] = [],
	) {}

	static create(item: Partial<PokemonDto> = new this()): PokemonDto {
		return new this(
			item.id,
			item.name,
			item.experience,
			PokemonSpritesDto.create(item.sprites),
			PokemonStatDto.createArray(item.stats),
		);
	}

	static createArray(items: Partial<PokemonDto>[] = []): PokemonDto[] {
		return items.map((item) => PokemonDto.create(item));
	}
}
```

`PokemonDto.create({ id: null, name: 'Raichu', sprites: { front: '30.png', back: '', other: undefined } })`
first deep-fills the raw argument from `jsonDefault` (`id` → `25`, `sprites.back` → `'back/25.png'`,
`sprites.other` → the template subtree, and the absent `experience` / `stats` → the template),
**then** the `create()` body maps the now-complete item explicitly. `name: 'Raichu'` and
`front: '30.png'` are kept.

Two rules carry over from `keyCamelCase`, for the same reason (the deep fill normalizes the tree
once, in the factory):

- Put `defaultValues` **only on the root DTO** whose factory the `http-*` files call with the raw
  response. Nested DTOs keep the plain `@Dto()` — they receive already-filled objects.
- It supplies **values only** — it does **not** instantiate nested DTOs. Parents still map children
  **explicitly** via `Child.create(...)` / `Child.createArray(...)`.

**Casing.** The fill runs **after** the `keyCamelCase` conversion, so `jsonDefault` must be in the
DTO's **camelCase** shape. Reusing `200-ok.json` works precisely when the API is already camelCase
(the fixture *is* the DTO shape, as above). When the API is snake_case and you pass
`keyCamelCase: true`, keep `200-ok.json` in the API's casing — it proves the conversion (see
[testing.md](testing.md)) — and point `defaultValues` at a separate **camelCase** default JSON
instead.

## Build order

Generate DTOs **inside-out**: leaf DTOs first, then the parent response DTO that composes
them. This guarantees each parent can call its children's `create()` / `createArray()`
factories.

## Local examples to mirror

- `[app-root]/services/http/weather/models/weather-condition.dto.ts` — leaf DTO with an enum
  default.
- `[app-root]/services/http/weather/models/current-weather.dto.ts` — DTO composing a nested DTO
  via `WeatherConditionDto.create(...)`.
- `[app-root]/services/http/weather/models/weather-report.dto.ts` — parent composing nested
  object + array DTOs.
