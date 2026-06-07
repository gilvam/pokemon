# TypeScript Patterns

Skill encoding this project's **TypeScript house standards**: kebab-case filenames whose base matches the
symbol, one declaration per file with a type suffix (`.model.ts` / `.interface.ts` / `.enum.ts`), classes for
domain models instantiated with `new`, `I`-prefixed interfaces, enums for closed value sets, braces on every
`if`, component folder names echoed in inner files, and a unit test for every unit. Current TypeScript
behavior is confirmed via the context7 `ctx7` CLI when a rule is version-dependent.

## Structure

```
typescript-patterns/
├── SKILL.md                       # Main entry (frontmatter for agent discovery)
├── README.md                      # This file
├── AGENTS.md                      # Detailed guide for agents/LLMs
└── references/
    ├── context7-lookup.md         # Confirm version-specific TS behavior via ctx7
    ├── naming-and-files.md        # kebab-case, symbol↔filename, suffixes, one-per-file, folder echo
    ├── classes.md                 # .model.ts, instances over literals, one class per file
    ├── interfaces.md              # .interface.ts, I prefix, filename rule
    ├── enums.md                   # .enum.ts, closed sets, enum vs union literals
    ├── code-style.md              # braces on every if; all array iteration methods over loops; .at() over []
    └── testing.md                 # a unit test per unit
```

## How to use

- **For humans**: start with [`SKILL.md`](SKILL.md) for the rules and flow, then open the relevant file under
  [`references/`](references/) for naming, classes, interfaces, enums, control flow, or testing.
- **For agents/LLMs**: [`SKILL.md`](SKILL.md) is the entry point; its `name`/`description` frontmatter makes
  the skill discoverable when authoring or reviewing TypeScript. [`AGENTS.md`](AGENTS.md) holds the
  operational guide.

## Core rules (house standards)

- **kebab-case filenames**; multi-word names use `-` (`user-default.model.ts`).
- **One declaration per file** — one class/interface/enum, nothing else top-level.
- **Filename mirrors the symbol** + a **type suffix** per kind (`.model.ts` / `.interface.ts` / `.enum.ts`).
- **Classes for domain data**, created with `new User(...)` rather than object literals; prefer
  classes/models/enums over bare `type`.
- **Interfaces prefixed with `I`** (`IUserGeneric` → `user-generic.interface.ts`).
- **Enums for closed domain value sets**, never loose magic strings.
- **Braces on every `if`** — no single-line `if`.
- **Array iteration methods over loops** — the full set (`map`, `filter`, `forEach`, `reduce`, `reduceRight`,
  `some`, `every`, `find`, `findIndex`, `findLast`, `findLastIndex`, `flatMap`, `flat`, `entries`, `keys`,
  `values`) instead of `for`/`while`/`do...while` for data; `for...of`/`for await...of` only for sequential
  `await` or imperative side-effects.
- **`.at()` over bracket indexing** — `array.at(i)` (and `array.at(-1)` for the last element) instead of
  `array[i]` / `array[array.length - 1]`.
- **Component folders echo their name** in inner files (`x-card/` → `x-card.component.ts`).
- **A unit test for every unit** (`*.spec.ts`).

## Deliberate divergences from idiomatic TypeScript

Three rules are intentionally stricter/different from the Google/Microsoft TS guidance and are documented as
such in their reference files:

- **`I` interface prefix** — the style guides advise against it; kept here as a house standard.
- **Classes (over `interface`/`type`) for data** — the handbook leans to `interface` for plain shapes; here
  domain data is class-based for behavior + invariants (interfaces remain for pure contracts).
- **`enum` for closed sets** — modern TS often prefers union literals / `as const`; accepted as equivalents,
  with `enum` as the house default.

## Scope

- **In scope**: TypeScript file naming, file-per-declaration, type suffixes, data modeling (class/interface/
  enum/`type`), control-flow bracing, and unit-test expectations.
- **Out of scope** (owned elsewhere): identifier casing & function shaping (`code-standards-en`), Angular
  folder layout (`angular-folder-structure`), Angular component/reactivity patterns (`angular-patterns`),
  HTTP DTO/service modules (`angular-http`).

## References

- TypeScript handbook — everyday types: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
- TypeScript enums: https://www.typescriptlang.org/docs/handbook/enums.html
- Google TypeScript Style Guide: https://google.github.io/styleguide/tsguide.html
- Related skills: `code-standards-en`, `angular-folder-structure`, `angular-patterns`, `angular-http`,
  `vitest-testing`.
