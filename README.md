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

| Branch | Zweck |
|---|---|
| `main` | Produktiver Stand – davon wird auf Servern installiert; Tags (`vX.Y.Z`) nur hier |
| `staging` | Integrations- und Teststand vor dem Release |
| Arbeitszweige (siehe unten) | Entwicklung einzelner Änderungen, kurzlebig |

Ablauf: Arbeitszweig von `staging` abzweigen → Pull Request nach `staging` → nach dem Test Pull Request
`staging` → `main` → Tag setzen. Dringende Fehlerbehebungen (`hotfix/…`) zweigen von `main` ab, gehen per
Pull Request nach `main` und werden danach auch nach `staging` übernommen. Arbeitszweige nach dem Merge löschen.

> **Branch-Schutz:** `main` und `staging` sollen nur per Pull Request mit grüner CI geändert werden (kein
> Force-Push, nicht löschbar). Bei privaten Repos ohne bezahlten GitHub-Plan lässt sich das derzeit **nicht
> technisch erzwingen** – bis dahin gilt die Regel als Absprache.

### Namensregeln

Schema: `<typ>/<kurzbeschreibung>` – optional mit Issue-Nummer: `<typ>/<nr>-<kurzbeschreibung>`

| Typ | Wofür | Beispiel |
|---|---|---|
| `feature/` | neue Funktion oder neues Modul | `feature/stundenplan-modul` |
| `fix/` | Fehlerbehebung (über `staging`) | `fix/12-kalender-zeitzone` |
| `hotfix/` | dringende Fehlerbehebung direkt von `main` | `hotfix/login-absturz` |
| `chore/` | Wartung: Abhängigkeiten, Core-Update, CI, Aufräumen | `chore/core-v2.0.0` |
| `docs/` | nur Dokumentation | `docs/readme-installation` |

- nur Kleinbuchstaben, Ziffern und Bindestriche (kebab-case), keine Umlaute oder Leerzeichen (`ae`, `oe`, `ue`, `ss`)
- kurz und sprechend (2–5 Wörter), auf Deutsch
- betrifft die Änderung ein einzelnes Modul, die Modul-ID voranstellen: `feature/files-papierkorb`
- Release-Tags: `vMAJOR.MINOR.PATCH` (z. B. `v0.1.0`), nur auf `main`

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
