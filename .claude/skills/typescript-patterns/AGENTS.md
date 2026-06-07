# TypeScript Patterns — Guide for Agents

> This document is optimized for agents/LLMs applying the `typescript-patterns` skill when writing or
> reviewing TypeScript against this project's house standards. Humans can use it too.

## When to activate this skill

Activate `typescript-patterns` when the user asks to:

- Write a **new TypeScript file** (class/model, interface, enum) to house standards.
- **Review or refactor** TypeScript naming, file structure, or data modeling.
- Decide **how to name a file/type** or **how to model data** (class vs interface vs enum vs `type`).

**Do not redefine here** (defer to the owner): identifier casing & function-shaping → `code-standards-en`;
Angular folder layout → `angular-folder-structure`; Angular component/reactivity patterns → `angular-patterns`;
HTTP DTO/service modules → `angular-http`.

## File map

| File | Purpose |
| --- | --- |
| `SKILL.md` | Entry point: when to use, the flow, non-negotiable rules. |
| `references/context7-lookup.md` | Confirm version-specific TS behavior via `ctx7`; lists where these rules diverge from idiomatic TS. |
| `references/naming-and-files.md` | kebab-case, symbol↔filename, type suffixes, one-per-file, component folder echo. |
| `references/classes.md` | `.model.ts`, instances over object literals, one class per file. |
| `references/interfaces.md` | `.interface.ts`, `I` prefix (with divergence note), filename rule. |
| `references/enums.md` | `.enum.ts`, closed sets, enum vs union literals/`as const`. |
| `references/code-style.md` | Braces on every `if`; full array-iteration-method set over loops; `.at()` over bracket indexing (defers the rest to `code-standards-en`). |
| `references/testing.md` | A unit test per unit. |

## Operational workflow

1. **Consult docs when version-specific** — `ctx7` (cap 3 calls); state the source. Structure/naming rules
   rarely need this (`references/context7-lookup.md`).
2. **Detect the project's style** — read a few existing files. If the codebase is consistent, **mirror it**;
   only standardize on explicit request.
3. **Name & place** — kebab-case filename matching the symbol, one declaration per file, correct suffix
   (`.model.ts`/`.interface.ts`/`.enum.ts`); component folders echo their name (`references/naming-and-files.md`).
4. **Model data** — class for domain models (`new`, not literals); interface (`I…`) for contracts; enum for
   closed sets; `type` only for unions/tuples/mapped types (`classes.md`/`interfaces.md`/`enums.md`).
5. **Control flow & iteration** — braces on every `if`/`else`/loop; array iteration methods
   (`map`/`filter`/`reduce`/`reduceRight`/`some`/`every`/`find`/`findIndex`/`findLast`/`findLastIndex`/
   `flatMap`/`flat`/`entries`/`keys`/`values`) over `for`/`while`/`do...while` for data; reserve
   `for...of`/`for await...of` for sequential `await` or imperative side-effects; `.at()` over `[]` for
   positional access, `.at(-1)` for the last element (`code-style.md`).
6. **Test** — co-located `*.spec.ts` for every new unit (`testing.md`).
7. **Verify** — `tsc --noEmit` / lint pass; no `any`; tests present.

## How to apply correctly

- **Mirror before you impose.** A consistent existing convention wins; standardize only on explicit request.
- **State divergences honestly.** Three rules differ from idiomatic/community TS — the `I` prefix, classes
  (over interfaces/`type`) for data, and `enum` (over union literals). They are deliberate house standards;
  apply them but don't present them as the universal TS recommendation.
- **One concept per file**, filename mirrors the symbol, suffix encodes the kind.
- **Defer scope to siblings** — casing/Angular/HTTP rules are owned elsewhere.

## Communication guidelines

- Report which step you are on (style detection → naming → modeling → control flow → testing → verify).
- If you consulted `ctx7`, state the resolved id (currently `/microsoft/typescript-website`); otherwise say
  the rule is structural and needed no lookup.
- When working in an existing codebase, state the convention you detected and that you are mirroring it.

## Avoid

- Multi-word filenames not in kebab-case; filenames that don't match their symbol; missing/incorrect suffix.
- More than one top-level declaration per file.
- Object literals for a concept that has a `.model.ts` class.
- Interfaces without the `I` prefix; magic strings instead of a closed type.
- Brace-less single-line `if`.
- `for`/`while`/`do...while` for data processing (use array methods); `arr.forEach(async …)` for sequential
  awaits (use `for...of`/`for await...of`).
- `arr[arr.length - 1]` / from-the-end index arithmetic — use `arr.at(-1)`.
- New code without a unit test.
- Forcing these standards onto a codebase with a different consistent convention.
- Redefining casing/Angular/HTTP rules owned by sibling skills.
