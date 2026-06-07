# Angular Patterns — Guide for Agents

> This document is optimized for agents/LLMs applying the `angular-patterns` skill when writing or reviewing
> Angular component, template, reactivity, and form code. Humans can use it too.

## When to activate this skill

Activate `angular-patterns` when the user asks to:

- Write a **new component / directive / pipe** following modern Angular.
- **Review or refactor** component, template, state, or form code toward current best practices.
- Decide **how to model state** (signals vs RxJS vs async/await) or **which template constructs** to use.
- Build a **reactive, typed form**.

**Do not activate** for: project/feature **folder layout** (use `angular-folder-structure`), or **HTTP/REST
integration** modules (use `angular-http`).

## File map

| File | Purpose |
| --- | --- |
| `SKILL.md` | Entry point: when to use, the flow, non-negotiable rules. |
| `references/mcp-lookup.md` | Step 1 — pull current Angular docs (Angular CLI MCP → `ctx7` → angular.dev). |
| `references/component-patterns.md` | Standalone, separate files, OnPush, `inject()`, signal I/O, host bindings. |
| `references/reactivity.md` | Signals vs RxJS vs async/await; `toSignal` / `async` pipe. |
| `references/templates.md` | Native control flow, class/style bindings, `@defer`, `NgOptimizedImage`. |
| `references/forms.md` | Typed reactive forms. |

## Operational workflow

1. **Consult current docs** — query the Angular CLI MCP (`get_best_practices`, `search_documentation`,
   `find_examples`); on miss, fall back to `ctx7` (cap 3 calls), then angular.dev. Say which source you used.
2. **Detect the project's style** — read a few existing components first. If a consistent convention exists,
   **mirror it**; only modernize on explicit request or in greenfield code.
3. **Apply component patterns** — standalone, separate `.ts`/`.html`/`.css`, OnPush, `inject()`, signal
   inputs/outputs, host bindings in the decorator (`references/component-patterns.md`).
4. **Model reactivity** — signals for state, RxJS for streams (cancellation/operators), async/await only for
   one-shot promises; bridge with `toSignal`/`async` pipe (`references/reactivity.md`).
5. **Write modern templates** — `@if`/`@for`/`@switch`, class/style bindings, `@defer`, `NgOptimizedImage`
   (`references/templates.md`).
6. **Build typed reactive forms** when forms are involved (`references/forms.md`).
7. **Verify** — `ng build` / `ng lint`; no `any`, no `*ngIf`/`*ngFor`, no `NgModule`, no manual `subscribe`
   without cleanup.

## How to apply correctly

- **Mirror before you impose.** In an existing app, a consistent established style wins; modernize only on
  explicit request or for new code.
- **Right tool per job (reactivity).** Signals = state; RxJS = streams/cancellation/operators; async/await =
  one-shot promise. Do not force everything through one model.
- **Separate files by default.** External `templateUrl`/`styleUrl`; inline only for trivial components.
- **Standalone + OnPush + `inject()`** for all new components.
- **Defer scope to siblings.** Folder layout → `angular-folder-structure`; HTTP modules → `angular-http`.

## Communication guidelines

- Report which step you are on (docs lookup → style detection → components → reactivity → templates → forms
  → verify).
- State the documentation source used: Angular CLI MCP, `ctx7` (and the resolved library id, currently
  `/websites/angular_dev`), or the angular.dev fallback links.
- When working in an existing app, state the convention you detected and that you are mirroring it.

## Avoid

- Inline `template`/`styles` for non-trivial components.
- `async/await` for continuous streams that need cancellation or operators.
- Legacy `*ngIf`/`*ngFor`/`*ngSwitch`, `NgClass`/`NgStyle`, `NgModule` in new code.
- Constructor injection in new code; `@HostBinding`/`@HostListener` (use the `host` object).
- `any`; untyped forms; manual `subscribe()` without cleanup.
- Forcing these patterns onto an existing app with a different consistent convention.
- Silently skipping the docs lookup.
