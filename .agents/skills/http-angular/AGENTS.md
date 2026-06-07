# Angular HTTP — Guide for Agents

> This document is optimized for agents/LLMs applying the `http-angular` skill when
> generating or standardizing Angular HTTP integration code. Humans can use it too.

## When to activate this skill

Activate `http-angular` when the user asks to:

- Create or standardize an Angular service for a REST/HTTP query.
- Model request/response payloads as typed, null-tolerant DTOs.
- Map nested API JSON (objects/arrays) into classes.
- Add HTTP mocks or unit tests for a service.

**Do not activate** for component/UI logic, signals/state management, routing, or any
non-HTTP service.

## File map

| File | Purpose |
| --- | --- |
| `SKILL.md` | Entry point: when to use, the flow, non-negotiable rules. |
| `references/context7-lookup.md` | Step 1 — pull current Angular docs via the `ctx7` CLI. |
| `references/decorator.md` | Step 2 — validate (or vendor) the `@NoNull()` decorator. |
| `references/folder-structure.md` | Step 3 — required inputs + folder contract. |
| `references/dto.md` | DTO rules, safe defaults, preferred shape. |
| `references/service.md` | Service rules and examples. |
| `references/mock-service.md` | Mock service rules. |
| `references/testing.md` | DTO and service spec requirements. |

## Operational workflow

1. **context7 docs** — resolve the Angular library id and query HttpClient setup/testing
   patterns (`references/context7-lookup.md`). Cap at 3 `ctx7` calls; on quota error fall
   back to the angular.dev links and say so.
2. **Validate `@NoNull()`** — Glob for the decorator (`**/_decorators/class.decorator.ts`; conventionally `[app-root]/_decorators/class.decorator.ts`). Reuse if
   present; vendor from `gilvam/typescript-utils` only if missing
   (`references/decorator.md`).
3. **Confirm contracts** — for each endpoint collect method name, HTTP verb, path, typed
   params/body, a success JSON example, error payloads, the response DTO name, and whether
   the response is a single object or array. Ask for the smallest concrete JSON if a shape
   is missing (`references/folder-structure.md`).
4. **Resolve `[app-root]` and scaffold** `[app-root]/services/http/http-[service-name]/` with `models/`
   and `mocks/` (`references/folder-structure.md`).
5. **Generate DTOs inside-out** — leaf DTOs first, then parents (`references/dto.md`).
6. **Add mocks** under `mocks/[method]/` (200 + relevant 4xx/5xx).
7. **Implement the service last** so each map calls the final DTO factory explicitly
   (`references/service.md`).
8. **Add the mock service** if consumers need it (`references/mock-service.md`).
9. **Write + run specs** — DTO null-safety matrix and service HTTP tests
   (`references/testing.md`). Run the new module's specs, then the project test command if
   practical.

## How to apply correctly

- Resolve the decorator import from the module's actual location (or a TS path alias). For the
  conventional `[app-root]/services/http/[module]/models/` + `[app-root]/_decorators/` layout it is
  `../../../../_decorators/class.decorator`; recompute the depth if the project relocates either
  (`references/decorator.md`).
- Build DTOs from the inside out so each parent can call its children's factories.
- Keep services thin: request assembly + explicit DTO mapping only.
- Mirror the local `[app-root]/services/http/weather` example for naming and style; when it
  diverges from these rules, the rules win.

## Communication guidelines

- Report which step you are on (context7 → decorator → scaffold → DTOs → mocks → service →
  specs).
- State the resolved Angular library id from `ctx7` (it currently resolves to
  `/websites/angular_dev`).
- If context7 is unavailable (quota/network), say so explicitly and note you fell back to
  the angular.dev links.
- When a payload shape is ambiguous, ask for a concrete JSON example before generating DTOs.

## Avoid

- No Angular `NgModule` files for these modules.
- No HTTP DTOs in component or shared/global folders.
- No raw API JSON returned from services.
- Never skip `create()` / `createArray()` in services, even when the type looks compatible.
- Never rely on `@NoNull()` alone for nested conversion — parents must call child factories.
- Never silently skip the context7 lookup.
