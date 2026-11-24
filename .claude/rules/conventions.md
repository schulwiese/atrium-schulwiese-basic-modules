# Conventions

## Language
- **English** for everything in the repo: code, identifiers, comments, JSDoc, log and error messages for developers,
  error codes, commit messages, PR titles and descriptions, branch names, README and other docs, these rules.
- **German** only in user-facing translations (`modules/<id>/messages/de.json`) and in demo/seed content meant for users.
- Talk to the user in German.

## UI texts
- Never hard-code user-facing strings (buttons, labels, messages, server error texts shown to users, mails, notifications).
  Use keys `t('<moduleId>.<key>')` from `$lib/sdk/i18n`; every key exists in `messages/de.json` **and** `messages/en.json`.
- Keys: lower camelCase, grouped by screen or feature (`files.trash.emptyConfirm`).
- German: real umlauts and ß, informal "du", short sentences, gender with `*` (`Schüler*innen`) – see core `ui-design.md`.
  English: neutral "you".
- Never call `t()` at module top level (the locale freezes at import) – store the key, translate on use (getter/function).
- Format dates, numbers, money and sizes only with the helpers from `$lib/sdk/i18n` (`formatDate`, `formatNumber`,
  `formatBytes` …), never by hand.

## Naming
- `camelCase` variables and functions, `PascalCase` types, interfaces and Svelte components, `UPPER_SNAKE_CASE` constants.
- Files `kebab-case.ts` (endpoints `<area>.endpoints.ts`, services `<area>.service.ts`), Svelte components `PascalCase.svelte`.
- Database: `snake_case` tables and columns, as the core requires for module schemas.
- Functions start with a verb (`listEvents`, `createShare`, `canEditNote`); booleans `is…`/`has…`/`can…`.
- No unclear abbreviations (`count` not `cnt`, `request` not `req` – except established `id`, `url`, `db`).

## Comments
- Explain **why**, not what the code obviously does.
- JSDoc on every exported function, type and endpoint (purpose, non-obvious parameters, thrown errors).
- Every file starts with a short comment on its purpose when that isn't obvious from the name.
- No commented-out code; no `TODO` without an issue reference: `TODO(#12): …`.

## Code
- TypeScript strict; no `any` (use `unknown` and narrow), no `@ts-ignore` (use `@ts-expect-error` with a reason).
- Validate every external input with Zod (`schemas.ts` in the module).
- Keep logic in small pure functions in their own files so it can be unit-tested; endpoints stay thin.
- Prettier and ESLint configs are authoritative – don't fight them, don't disable rules without a comment why.

## Commits – Conventional Commits
Format: `<type>(<scope>): <summary>`
- Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `ci`, `build`.
- Scope: module id (`files`, `events`) or area (`ci`, `scripts`, `deps`, `core`, `rules`); omit if it spans everything.
- Summary: imperative, lower case, no trailing period, max. 72 characters (`feat(files): add trash view`).
- Body (optional): why the change was made, wrapped at ~72 characters.
- Breaking change: `!` after type/scope and a `BREAKING CHANGE: …` footer.
- One logical change per commit. Pull request titles use the same format – they become the squash commit.

## Branches and pull requests
- Branch names: `<type>/<short-description>` in English kebab-case, types `feature|fix|hotfix|chore|docs`,
  optional issue number (`feature/files-trash`, `fix/12-calendar-timezone`). Prefix the module id if only one module is affected.
- Branch from `staging` (hotfix from `main`), pull request into `staging` (squash merge). `staging → main` as merge commit,
  then tag `vX.Y.Z` on `main` (the release workflow does the rest).
- Fill in the PR template, keep pull requests small, merge only with green CI. Branches are deleted automatically after merge.
