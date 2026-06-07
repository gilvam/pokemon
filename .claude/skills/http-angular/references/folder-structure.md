# Required inputs & folder contract

## Required inputs

Collect or infer before writing code:

- `serviceName`: kebab-case feature/API name **without** the `http-` prefix (e.g. `weather`,
  `user-profile`, `billing`).
- Base URL / endpoint strategy already used by the project.
- For each endpoint: method name, HTTP verb, path, typed query params/body, a success JSON
  example, relevant error payloads, the response DTO name, and whether the response is a
  single object or an array.
- Any enums or domain-specific literal fields present in the JSON.

If an endpoint shape is missing, ask for the smallest concrete JSON example representing
success (and the relevant error payloads).

## Resolve the base path (`[app-root]`)

`[app-root]` is the application root folder that holds `services/`, `_decorators/`, and
`app.config.ts`/`app.routes.ts`. It is **dynamic — never assume `src/app`.** Resolve it before scaffolding:

1. **Existing `services/http/`** — Glob for `**/services/http/`. If found, set `[app-root]` to its
   grandparent and place new modules there (e.g. `src/app/core/services/http/` → `[app-root]` =
   `src/app/core`).
2. **Existing `services/` without `http/`** — if `**/services/` exists, create `http/` inside it.
3. **Greenfield fallback** — set `[app-root]` to where `app.config.ts`/`app.routes.ts`/`main.ts` live
   (default `src/app`) and create `[app-root]/services/http/`, matching Angular conventions (see the
   `folder-structure-angular` skill for the standard layout).

State which case applied when you report back. `[app-root]` **defaults to `src/app`**, so the conventional
path is `src/app/services/http/`.

## Folder contract

Create new modules **only** under `[app-root]/services/http/http-[service-name]/`:

```text
[app-root]/services/http/http-[service-name]/
├── http-[service-name].service.ts          # the real HttpClient service
├── http-[service-name].service.spec.ts     # service unit tests (HttpTestingController)
├── http-[service-name].mock.service.ts     # mock service for component/demo testing
├── models/
│   ├── [query-name].dto.ts                  # response/request DTOs (one concept per file)
│   ├── [nested-entity].dto.ts               # nested sub-DTOs
│   ├── [domain].enum.ts                      # enums / literal types for this module
│   └── [query-name].dto.spec.ts             # DTO null-safety specs
└── mocks/
    └── [method]/                            # one folder per service method (get, search, …)
        ├── 200-ok.json
        ├── 400-invalid-request.json
        └── 500-internal-server-error.json
```

Keep tests beside the code under test. Do not place integration DTOs in shared/global or
component folders unless the user explicitly asks for cross-module reuse.

## Naming conventions

- Module folder: `http-[service-name]/`.
- Service: `http-[service-name].service.ts` → class `Http[ServiceName]Service`.
- Mock service: `http-[service-name].mock.service.ts` → class `Http[ServiceName]MockService`.
- DTO files: `[query-name].dto.ts` → class `[QueryName]Dto`.
- Enums: `[domain].enum.ts` → `[Domain]Enum`.
