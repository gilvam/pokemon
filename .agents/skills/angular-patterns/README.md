# Angular Patterns

Skill for writing and reviewing **modern Angular** code: standalone components split into separate
`.ts`/`.html`/`.css` files, **signals-first** state with RxJS for streams (and async/await only for one-shot
promises), OnPush/zoneless change detection, native control flow (`@if`/`@for`/`@switch`), `inject()`, host
and class/style bindings, and typed reactive forms. It pulls current Angular patterns via the **Angular CLI
MCP** (`get_best_practices`) with the context7 `ctx7` CLI as fallback.

## Structure

```
angular-patterns/
├── SKILL.md                       # Main entry (frontmatter for agent discovery)
├── README.md                      # This file
├── AGENTS.md                      # Detailed guide for agents/LLMs
└── references/
    ├── mcp-lookup.md              # Pull current Angular docs (Angular CLI MCP → ctx7 → angular.dev)
    ├── component-patterns.md      # Standalone, separate files, OnPush, inject(), host bindings
    ├── reactivity.md              # Signals vs RxJS vs async/await; toSignal / async pipe
    ├── templates.md               # Native control flow, class/style bindings, @defer, NgOptimizedImage
    └── forms.md                   # Typed reactive forms
```

## How to use

- **For humans**: start with [`SKILL.md`](SKILL.md) for the rules and flow, then open the relevant file under
  [`references/`](references/) for component, reactivity, template, or form details.
- **For agents/LLMs**: [`SKILL.md`](SKILL.md) is the entry point; its `name`/`description` frontmatter makes
  the skill discoverable when authoring or reviewing Angular code. [`AGENTS.md`](AGENTS.md) holds the
  operational guide.

## Core rules (validated against angular.dev)

- **Three separate files per component** — external `templateUrl`/`styleUrl` (the CLI default); inline only
  for trivial components.
- **Signals for state, RxJS for streams, async/await for one-shot** — bridge to templates with `toSignal()`
  or the `async` pipe; use RxJS when you need cancellation/operators (`switchMap`, `debounceTime`, retries).
- **Standalone + OnPush + `inject()`** for all new components.
- **Native control flow** (`@if`/`@for`/`@switch`) and **class/style bindings** over the legacy directives.
- **Typed reactive forms** over template-driven forms.

## Scope

- **In scope**: component/directive/pipe authoring, state & reactivity choices, template constructs, and
  reactive forms — the *coding patterns* of an Angular app.
- **Out of scope**: project/feature **folder layout** (use the **`angular-folder-structure`** skill) and
  **HTTP/REST integration** modules (use the **`angular-http`** skill).

## References

- Angular style guide — https://angular.dev/style-guide
- Components — https://angular.dev/guide/components
- Signals — https://angular.dev/guide/signals
- RxJS interop (`toSignal`) — https://angular.dev/ecosystem/rxjs-interop
- Control flow — https://angular.dev/guide/templates/control-flow
- Typed reactive forms — https://angular.dev/guide/forms/reactive-forms
- Related skills: `angular-folder-structure` (layout), `angular-http` (HTTP modules), `code-standards-en`
  (identifier/naming rules).
