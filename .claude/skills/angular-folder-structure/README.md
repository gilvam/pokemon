# Angular Folder Structure

Skill for creating and standardizing an Angular application's **folder structure** using current Angular
conventions: feature-based organization under `src/app` with `core/` / `_shared/` / `features/` layers,
standalone components with co-located template/style/spec files, lazy-loaded routes, and hyphenated naming.
It pulls current Angular patterns via the **Angular CLI MCP** (with the context7 `ctx7` CLI as fallback) and
covers both a brand-new project scaffold and adding a feature to an existing app.

## Structure

```
angular-folder-structure/
├── SKILL.md                       # Main entry (frontmatter for agent discovery)
├── README.md                      # This file
├── AGENTS.md                      # Detailed guide for agents/LLMs
└── references/
    ├── mcp-lookup.md              # Pull current Angular docs (Angular CLI MCP → ctx7 → angular.dev)
    ├── project-structure.md       # Canonical core/_shared/features layout + routing
    ├── feature-structure.md       # Anatomy of one feature folder + existing-app rules
    ├── naming-conventions.md      # File and symbol naming rules
    └── scaffolding.md             # ng new / ng generate commands to materialize the layout
```

## How to use

- **For humans**: start with [`SKILL.md`](SKILL.md) for the high-level flow, then open the relevant file
  under [`references/`](references/) for the layout, naming rules, and CLI commands.
- **For agents/LLMs**: [`SKILL.md`](SKILL.md) is the entry point; its `name`/`description` frontmatter makes
  the skill discoverable when scaffolding or standardizing an Angular project. [`AGENTS.md`](AGENTS.md) holds
  the operational guide.

## What the layout looks like

```
src/
├─ app/
│  ├─ core/        # app-wide singletons: guards, interceptors, app config, base services
│  ├─ _shared/     # reusable presentational components, pipes, directives (no singleton state)
│  ├─ features/
│  │  └─ orders/          # example feature
│  │     ├─ pages/        # routed components ONLY (e.g. order-list/, order-detail/) — every route target
│  │     ├─ components/   # presentational components local to the feature (e.g. order-row/)
│  │     ├─ services/     # feature-scoped services
│  │     ├─ models/       # feature-scoped types/DTOs
│  │     └─ orders.routes.ts
│  ├─ app.config.ts
│  ├─ app.routes.ts
│  └─ app.ts / app.html / app.css   # root component (current suffix-less style)
├─ main.ts
└─ styles.css
```

## Scope

- **In scope**: project-wide directory layout, feature folder anatomy, where a file belongs, naming, and the
  CLI commands that put files in the right place.
- **Out of scope**: HTTP/REST integration modules (use the **`angular-http`** skill, which owns
  the project's `services/http` folder, default `src/app/services/http`), and component/UI implementation
  logic.

## References

- Angular style guide — https://angular.dev/style-guide
- Angular CLI MCP Server — https://angular.dev/ai/mcp
- Related skill: `angular-http` — typed `HttpClient` services and DTO modules.
- Related skill: `code-standards-en` — identifier and naming rules used across the codebase.
