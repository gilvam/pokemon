# Backend layout reference (example_6)

Three-layer layout under `backend/src/` separating HTTP transport, domain rules, and external IO.

---

## Backend

Three-layer layout under `backend/src/`:

| Folder | Responsibility |
|--------|----------------|
| **`controllers/`** | HTTP handlers: route wiring, parsing, status codes, light format validation—delegate to services. No complex domain rules. |
| **`services/`** | Domain rules, orchestration, validations—not HTTP framing specifics. |
| **`data/`** | External IO: repositories, outbound HTTP/SDKs, queues, persistence mapping. |

Mandatory flow:

```text
HTTP → controllers/ → services/ → data/
```

- Controllers do not embed external integrations or direct queries.
- Services do not build HTTP responses; return values or throw domain errors.
- `data/` concentrates side effects and IO.

Suggested tree (`backend/src/`):

```text
src/
  controllers/
    <resource>.controller.ts
  services/
    <domain>.service.ts
  data/
    repositories/
    clients/
    ...
  index.ts or server.ts
```

### Shared types

Types/DTOs may live in `src/types`, `src/schemas`, or near the domain provided imports remain acyclic respecting `data → services → controllers`.

---

## Summary

- Backend: `controllers/` (HTTP), `services/` (rules), `data/` (integration and persistence).

Place new files using this snapshot to keep navigation predictable.
