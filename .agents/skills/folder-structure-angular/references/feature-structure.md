# Feature folder anatomy & adding to an existing app

A **feature** is a self-contained slice of the app (a domain area or routed section). Everything the feature
needs lives inside its folder until a second consumer justifies promoting it to `shared/` or `core/`.

## Anatomy of one feature

```
features/<feature>/
├─ pages/                 # routed / container components (smart): fetch data, hold state, compose children
│  └─ <page>/
│     ├─ <page>.ts
│     ├─ <page>.html
│     ├─ <page>.css
│     └─ <page>.spec.ts
├─ components/            # presentational (dumb) components local to this feature
│  └─ <component>/ ...
├─ services/              # feature-scoped services (provided in the feature's routes/components)
├─ models/               # feature-scoped types / interfaces / enums
└─ <feature>.routes.ts   # this feature's route group (lazy-loaded from app.routes.ts)
```

Guidelines:

- **`pages/` vs `components/`** — `pages/` are the routed containers (one per route) that orchestrate data
  and state; `components/` are presentational pieces they compose. A presentational component takes inputs
  and emits outputs and holds no app state.
- **Co-locate** each component's `.ts` / `.html` / `.css` / `.spec.ts` in its own folder, sharing one base
  name (see `naming-conventions.md`).
- **Feature-scoped services** stay in the feature; provide them at the route or component level rather than
  `root` unless they are genuinely app-wide singletons (those belong in `core/`).
- **Skip empty folders.** Create `components/`, `services/`, or `models/` only when the feature actually has
  them — don't scaffold empty buckets.

## When to promote out of the feature

| Move it to… | Trigger |
| --- | --- |
| `shared/` | A presentational component/pipe/directive is needed by a **second** feature, and it has no singleton state. |
| `core/` | A service must be a single app-wide instance (auth, config, logging) or it's a guard/interceptor. |

Promote on the *second* concrete use, not in anticipation — early sharing is the *Speculative Generality*
smell (`code-smell` skill).

## Adding a feature to an EXISTING app — detect, then mirror

Do **not** assume this skill's layout. First read what the app already does and follow it.

1. **Confirm it's an Angular workspace** — Glob for `angular.json` and `src/app/`.
2. **Read the established convention** — inspect existing siblings:
   - Glob `src/app/**/*.routes.ts` and the existing `features/` (or equivalent) folders.
   - Grep for `loadComponent` / `loadChildren` to see how routes are wired and how lazy loading is done.
   - Check whether files use suffix-less (`order-list.ts`) or legacy (`order-list.component.ts`) naming.
   - Check whether the app is standalone or still uses `NgModule`s.
3. **Mirror it.** Place the new feature where the existing ones live, match their internal subfolders
   (`pages/`/`components/` or whatever the app uses), and match the naming/routing style you found.
4. **Only impose this skill's layout** when the app has no consistent convention, or when the user
   explicitly asks to standardize/refactor the structure.
5. **Wire the route** into the parent routes file the same way the existing features are wired.

State the convention you detected and that you are mirroring it, so the user can confirm.
