# Testing and verification

Details on the test infrastructure (PGlite, `$testing`, Playwright projects): core `.core/.claude/rules/testing-and-verification.md`.

## Every change is tested
- **New feature** → new tests covering it.
- **Bug fix** → write a regression test first that fails, then fix until it passes.
- **Refactoring** → existing tests stay green without being weakened.
- Don't delete or loosen a failing test to make CI pass; fix the cause or ask the user.

## Which test where
| What | Where | How |
|---|---|---|
| Pure logic (calculations, parsers, Zod schemas, formatting) | `modules/<id>/tests/unit/*.test.ts` | Vitest, no database |
| Endpoints, services, database, permissions, jobs, migrations | `modules/<id>/tests/integration/*.test.ts` | Vitest + PGlite via `$testing` |
| User flows in the browser | `modules/<id>/e2e/*.spec.ts` | Playwright via `$testing/e2e` |

- Module tests only use `$testing` / `$testing/e2e` – never `$lib/server/*` or the core's `tests/helpers/*`.
- Test files are named after what they test: `<moduleId>-<area>.test.ts`.

## Minimum per module
- Zod schemas: valid input passes, each invalid case is rejected.
- Permissions: every endpoint is tested with an allowed **and** a denied user.
- Every endpoint: happy path plus at least one error path (404, 409, 422 …).
- Migrations apply cleanly on an empty database; upgrades are covered when data is migrated.
- UI: at least one E2E test per page for the main flow.

## Test quality
- Tests are independent and deterministic: no shared state between tests, fixed dates/time zones, no real network.
- No `.only` or `.skip` in commits; no fixed `sleep` – wait for the actual condition.
- Assert on behaviour and visible results, not on implementation details.

## Definition of done
Before reporting a task as done, in this order, all green:
1. `npx prettier --write <changed files>`
2. `npm run check` – 0 errors, 0 warnings
3. `npm run lint`
4. `npm test`
5. `npm run build`
6. `npm run check:catalog` and `npm run check:migrations`
7. UI changes: `npm run e2e` plus a screenshot check of the changed pages (light and dark, desktop and mobile).

Report honestly what was **not** verified (e.g. real S3 upload, mobile view, a step that could not run locally).
