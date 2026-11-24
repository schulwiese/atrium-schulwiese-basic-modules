# Atrium – Schulwiese basic modules

Modules of the Schulwiese for [Kalypzo Atrium](https://github.com/KalypzoSolutions/kalypzo-atrium).
Modules live in `modules/<id>/`, the catalog in `modules/atrium-modules.json`.

## Installation

Atrium → Administration → Modules → **Install** → link
`https://github.com/schulwiese/atrium-schulwiese-basic-modules/tree/<commit>/modules`
(or the `modules-<version>.zip` from a [release](https://github.com/schulwiese/atrium-schulwiese-basic-modules/releases)).

## Development

```bash
git clone --recurse-submodules https://github.com/schulwiese/atrium-schulwiese-basic-modules.git
cd atrium-schulwiese-basic-modules
npm run setup
npm run check && npm run lint && npm test
npm run demo   # http://localhost:4300
```

More commands are in `package.json`. Conventions (English code, Conventional Commits, branch names) and testing rules:
`.claude/rules/conventions.md` and `.claude/rules/testing.md`; module development: `.core/docs/module-development.md`.

## Branches

- `main`: production. Tags (`vX.Y.Z`) only here.
- `staging`: test state before a release (default branch).
- Work branches `<type>/<short-description>` (`feature`, `fix`, `hotfix`, `chore`, `docs`) branch off `staging` and go back
  via pull request; `hotfix/…` branches off `main`. Example: `feature/timetable`, `fix/12-calendar-timezone`.

`main` and `staging` are protected: changes only via pull request with green CI, no force push, no deletion.
CI checks the name and target of every pull request. A tag `vX.Y.Z` on `main` creates a release with a ZIP of the modules.
New core tags arrive weekly as a pull request against `staging`.
