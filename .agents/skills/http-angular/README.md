# Angular HTTP

Skill for creating and standardizing Angular HTTP integration modules: isolated module
folders under `[app-root]/services/http/http-[service-name]` (default `src/app/services/http`), strongly-typed `HttpClient`
services, `@NoNull()` DTOs with explicit `create()/createArray()` mapping, a mock service,
and unit tests. It pulls current Angular patterns via the context7 `ctx7` CLI and guards the
`@NoNull()` decorator dependency.

## Structure

```
http-angular/
├── SKILL.md                       # Main entry (frontmatter for agent discovery)
├── README.md                      # This file
├── AGENTS.md                      # Detailed guide for agents/LLMs
└── references/
    ├── context7-lookup.md         # Pull current Angular docs via the ctx7 CLI
    ├── decorator.md               # Validate / vendor the @NoNull() decorator
    ├── folder-structure.md        # Required inputs + folder contract
    ├── dto.md                     # DTO rules, safe defaults, preferred shape
    ├── service.md                 # HTTP service rules and examples
    ├── mock-service.md            # Mock service rules
    └── testing.md                 # DTO and service spec requirements
```

## How to use

- **For humans**: start with [`SKILL.md`](SKILL.md) for the high-level flow, then open the
  relevant file under [`references/`](references/) for detailed rules and code templates.
- **For agents/LLMs**: [`SKILL.md`](SKILL.md) is the entry point; its `name`/`description`
  frontmatter makes the skill discoverable when generating or standardizing Angular HTTP
  code. [`AGENTS.md`](AGENTS.md) holds the operational guide.

## What a generated module contains

```
[app-root]/services/http/http-[service-name]/
├── http-[service-name].service.ts          # the real HttpClient service
├── http-[service-name].service.spec.ts     # service unit tests (HttpTestingController)
├── http-[service-name].mock.service.ts     # mock service for component/demo testing
├── models/                                  # DTOs + enums (+ DTO specs)
└── mocks/[method]/                          # 200 / 4xx / 5xx JSON fixtures
```

## Local reference example

The project's own `[app-root]/services/http/weather` module is the canonical example to
mirror (DTOs in `models/`, service, mock service, and specs).

## References

- Angular style guide — https://angular.dev/style-guide
- HttpClient setup — https://angular.dev/guide/http/setup
- HttpClient testing — https://angular.dev/guide/http/testing
- `@NoNull()` decorator source (fallback) — https://github.com/gilvam/typescript-utils/tree/main/src/decorators
