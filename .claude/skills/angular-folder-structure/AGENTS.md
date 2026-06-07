# Angular Folder Structure — Guide for Agents

> This document is optimized for agents/LLMs applying the `angular-folder-structure` skill when scaffolding
> or standardizing an Angular project's directory layout. Humans can use it too.

## When to activate this skill

Activate `angular-folder-structure` when the user asks to:

- Set up the folder structure for a **new** Angular project.
- Add or organize a **feature** folder in an existing app.
- **Standardize** or refactor an existing app's directory layout toward feature-based organization.
- Decide **where a file belongs** (`core` vs `_shared` vs a feature).

**Do not activate** for: HTTP/REST integration modules (use `angular-http`), component/UI logic, state
management, or styling decisions.

## File map

| File | Purpose |
| --- | --- |
| `SKILL.md` | Entry point: when to use, the flow, non-negotiable rules. |
| `references/mcp-lookup.md` | Step 1 — pull current Angular docs (Angular CLI MCP → `ctx7` → angular.dev). |
| `references/project-structure.md` | The canonical `core`/`_shared`/`features` layout and routing. |
| `references/feature-structure.md` | Anatomy of one feature folder + existing-app detection rules. |
| `references/naming-conventions.md` | File and symbol naming rules. |
| `references/scaffolding.md` | `ng new` / `ng generate` commands to materialize the layout. |

## Operational workflow

1. **Consult current docs** — query the Angular CLI MCP (`get_best_practices`, `search_documentation`,
   `list_projects`, `find_examples`); on miss, fall back to the `ctx7` CLI (cap 3 calls), then to the
   angular.dev links. Say which source you used (`references/mcp-lookup.md`).
2. **Detect the context** — is this greenfield or an existing app? Glob/Grep for `angular.json`,
   `src/app/app.routes.ts`, and existing folder patterns. If a consistent convention already exists,
   **mirror it**; do not impose this layout unless asked to standardize (`references/feature-structure.md`).
3. **Apply the layout** — place `core/`, `_shared/`, `features/<feature>/` under `src/app`; wire routing with
   `app.routes.ts` + per-feature `<feature>.routes.ts`, lazy-loaded (`references/project-structure.md`).
4. **Scaffold via the CLI** — use `ng new` for greenfield and `ng generate <schematic> <path>` so files land
   in the documented folders (`references/scaffolding.md`).
5. **Name consistently** — hyphenated filenames, co-located component files sharing one base name, one
   concept per file (`references/naming-conventions.md`).
6. **Verify** — run `ng build` and `ng lint`; confirm files landed in the documented paths.

## How to apply correctly

- **Mirror before you impose.** In an existing app, the established convention wins; only standardize on
  explicit request or when starting fresh.
- **Routed components live in `pages/` (hard rule).** Any component a route resolves to (`loadComponent`, a
  `loadChildren` group's targets, or `component:`) goes in `features/<feature>/pages/<page>/`, one per
  subfolder, suffix-less (`order-list.ts` → `class OrderList`). `components/` is presentational only and never
  a route target. In an existing app with a different routed-folder name or suffix, mirror it.
- **Feature isolation.** Everything a feature needs lives inside its folder until a *second* consumer
  appears — only then promote it to `_shared/` (presentational) or `core/` (singleton).
- **`core` vs `_shared`.** `core/` = app-wide singletons provided once (guards, interceptors, app config,
  cross-cutting services). `_shared/` = reusable, stateless presentational components/pipes/directives.
- **Standalone-first.** Do not generate `NgModule` files unless the project already uses them.
- **Defer HTTP modules** to the `angular-http` skill (they live under the project's `services/http` folder,
  default `src/app/services/http`).

## Communication guidelines

- Report which step you are on (docs lookup → context detection → layout → scaffold → naming → verify).
- State the documentation source used: Angular CLI MCP, `ctx7` (and the resolved library id, currently
  `/websites/angular_dev`), or the angular.dev fallback links.
- If the Angular CLI MCP and `ctx7` are both unavailable, say so explicitly and note you fell back to
  angular.dev.
- When working in an existing app, state the convention you detected and that you are mirroring it.

## Avoid

- No type-based folders (`components/`, `services/`, `pipes/`) at the app or feature root.
- Never route to a component outside `pages/` (or the app's equivalent routed-component folder).
- No `NgModule` files in a standalone project.
- No feature-specific code in `core/`/`_shared/`; no singleton state in `_shared/`.
- Never force this layout onto an existing app with a different consistent convention.
- Never redefine HTTP service modules — defer to `angular-http`.
- Never silently skip the docs lookup.
