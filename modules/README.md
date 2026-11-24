# Modules

Extension modules live here (`modules/<id>/`). See `.core/docs/module-development.md`.

Minimal layout:

```
modules/<id>/
├── atrium-module.json  # id, version, dependencies, npm packages
├── module.ts           # export default defineModule({ manifest, settings, endpoints, migrations })
├── ui.ts               # export default { routes: { '': () => import('./pages/Index.svelte') } }
├── messages/           # de.json + en.json (all UI texts)
├── migrations/
├── pages/…
├── tests/{unit,integration}/
└── e2e/
```

Modules may import `$lib/sdk/*`, the UI building blocks `$lib/components/{ui,layout,forms}`, `$lib/forms`, `$lib/pdf-lists`
and `$lib/utils`; other modules only as `import type` from `$modules/<id>/contract`, nothing from `$lib/server/*`
(enforced by ESLint, see `.core/docs/module-development.md` → "Erlaubte Importe").
