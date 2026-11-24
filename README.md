# Atrium – Schulwiese Basismodule

Basismodule der Schulwiese für die Plattform [Kalypzo Atrium](https://github.com/KalypzoSolutions/kalypzo-atrium) (Core, eigenes Repo).
Alle Module liegen unter `modules/<id>/`, der Katalog unter `modules/atrium-modules.json`.
Aufbau nach dem Vorbild von [`atrium-basic-modules`](https://github.com/KalypzoSolutions/atrium-basic-modules).

| Modul | Inhalt |
|---|---|
| – | noch keine Module |

## Installation auf einem Server

Administration → Module → **Installieren** → Link `https://github.com/schulwiese/atrium-schulwiese-basic-modules/tree/<commit>/modules`
(oder ZIP dieses Repos) → Module auswählen. Für frische Deployments: Seed (`ATRIUM_MODULES_SEED`, siehe
`docs/deployment.md` im Core).

## Branches

| Branch | Zweck | Schutz |
|---|---|---|
| `main` | Produktiver Stand – davon wird auf Servern installiert; Tags (`vX.Y.Z`) nur hier | geschützt: nur per Pull Request, CI muss grün sein, kein Force-Push, nicht löschbar |
| `staging` | Integrations- und Teststand vor dem Release | geschützt: nur per Pull Request, CI muss grün sein, kein Force-Push, nicht löschbar |
| `feature/<thema>`, `fix/<thema>` | Arbeitszweige | – |

Ablauf: `feature/…` bzw. `fix/…` von `staging` abzweigen → Pull Request nach `staging` → nach dem Test
Pull Request `staging` → `main` → Tag setzen. Dringende Fehlerbehebungen (`hotfix/…`) dürfen von `main`
abzweigen und werden danach auch nach `staging` übernommen.

## Entwickeln

Der Core ist als Git-Submodul `.core` auf einen festen Stand gepinnt.

```bash
git clone --recurse-submodules https://github.com/schulwiese/atrium-schulwiese-basic-modules.git
cd atrium-schulwiese-basic-modules
npm run setup        # Core-Abhängigkeiten, node_modules-Link, Pakete der Module
npm run check        # Typprüfung (Core + Module)
npm test             # Tests der Module (Vitest, PGlite)
npm run build        # Produktions-Build
npm run e2e          # Playwright
npm run demo         # Demo-Server http://localhost:4300 mit diesen Modulen
npm run check:catalog && npm run check:migrations
```

Core aktualisieren: `git -C .core fetch --tags && git -C .core checkout <tag>`, dann `npm run setup -- --force`, prüfen, committen.
Angewendete Migrationen sind unveränderlich (`check:migrations` vergleicht mit dem letzten Tag dieses Repos).

Regeln für die Arbeit an Modulen: `.core/.claude/rules/modules.md` (Muster, Rechte, Endpunkte) und `.claude/rules/module-<id>.md`.
