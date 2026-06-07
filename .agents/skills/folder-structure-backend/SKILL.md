---
name: folder-structure-backend
description: Defines backend controllers-services-data layering and HTTP flow direction. Applies when creating backend modules, routes, or handlers for consistency. Do not use for monorepo-wide policies outside this template or frameworks that forbid this layout.
---

# Backend folder structure

## Procedures

**When extending backend modules**

1. Respect the dependency direction `HTTP → controllers/ → services/ → data/`; controllers marshal HTTP shapes and statuses, services encapsulate orchestration and domain guards, data modules perform persistence and integrations.
2. Keep handlers in `controllers/`, workflows in `services/`, adapters in `data/` (`repositories`, `clients`, shared external SDK boundaries).
3. Share cross-layer schemas or validation artifacts under neutral folders (`src/schemas`, `src/types`) avoiding import cycles violating the layering arrow.
4. Read `references/repo-layout.md` for the canonical ASCII tree snapshot and anti-pattern callouts whenever placement is ambiguous.

## Error Handling

1. When backend logic leaks framing details into controllers, refactor transport mapping upward and domain rules downward per the layered flow diagram inside `references/repo-layout.md`.
