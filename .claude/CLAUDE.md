# Atrium – Schulwiese basic modules – project notes for Claude

Basic modules of the Schulwiese for the **Kalypzo Atrium** core. The core is a git submodule at `.core`, pinned to a tag.
Talk to the user in **German**; everything written into the repo is **English** (see `rules/conventions.md`).

## Core rules
The core rules still apply: `.core/.claude/CLAUDE.md` and `.core/.claude/rules/*.md` – above all `modules.md`,
`architecture.md`, `ui-design.md`, `testing-and-verification.md`.
**Overridden in this repo:** everything about language. Code, identifiers, comments, log messages, commits, branches and
docs are English (the core's "German comments" rule does not apply). UI texts are never hard-coded but translated
(`de` + `en`). Where this file or `rules/*.md` contradict the core rules, this repo's rules win.

## Layout
- `modules/<id>/` – per module `atrium-module.json`, `module.ts`, `ui.ts`, `messages/{de,en}.json`, `migrations/`, `pages/`,
  `tests/{unit,integration}`, `e2e/`; catalog `modules/atrium-modules.json`.
- `scripts/` – `setup.mjs`, `core.mjs` (runs commands in the core with `ATRIUM_MODULES_DIR=./modules`), check scripts.
- `.claude/rules/` – `conventions.md`, `testing.md`, and `module-<id>.md` per module (loaded via `paths:`).
- `.github/` – CI, release, core update, Dependabot, PR template.

## Commands
| Command | Purpose |
|---|---|
| `npm run setup` | Fetch/install core, link `node_modules` → `.core/node_modules`, install module packages |
| `npm run check` / `npm run lint` / `npm run format:check` | Types / ESLint / Prettier |
| `npm test` | Module tests (Vitest, PGlite) |
| `npm run build` / `npm run e2e` / `npm run demo` | Build / Playwright / demo server (:4300) |
| `npm run check:catalog` / `npm run check:migrations` | Catalog complete / applied migrations unchanged |

Update the core: `git -C .core fetch --tags && git -C .core checkout <tag>`, `npm run setup -- --force`, verify, commit
(`chore(core): update core to <tag>`). Usually done by the weekly `Core update` workflow.

## Hard rules
1. Only change files under `modules/`, `scripts/`, `.claude/`, `.github/` and root config – **never** `.core`
   (core changes belong in the core repo, then tag + submodule update).
2. Modules import only `$lib/sdk/*`, `$lib/components/{ui,layout,forms}`, `$lib/forms`, `$lib/pdf-lists`, `$lib/utils`
   and `import type` from other modules' `contract.ts` – never `$lib/server/*`.
3. Version and dependencies only in `atrium-module.json`; new permissions in manifest **and** JSON; keep the catalog in sync.
4. Migrations are additive and immutable once tagged (`check:migrations`).
5. Follow `rules/conventions.md` (language, naming, comments, commits, branches) and `rules/testing.md` (tests, definition of done).
6. Work on a branch `<type>/<description>` from `staging`; merge only via pull request. Never commit or push unless the user asks.
7. Never report a task as done before the definition of done in `rules/testing.md` is green; say explicitly what was not verified.
