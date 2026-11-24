# Atrium – Schulwiese Basismodule

Module der Schulwiese für [Kalypzo Atrium](https://github.com/KalypzoSolutions/kalypzo-atrium).
Module liegen unter `modules/<id>/`, der Katalog in `modules/atrium-modules.json`.

## Installation

Atrium → Administration → Module → **Installieren** → Link
`https://github.com/schulwiese/atrium-schulwiese-basic-modules/tree/<commit>/modules`

## Entwickeln

```bash
git clone --recurse-submodules https://github.com/schulwiese/atrium-schulwiese-basic-modules.git
cd atrium-schulwiese-basic-modules
npm run setup
npm run check && npm run lint && npm test
npm run demo   # http://localhost:4300
```

Weitere Befehle stehen in `package.json`. Für die Modulentwicklung gelten die Regeln unter `.core/docs/module-development.md`.

## Branches

- `main`: Produktivstand. Tags (`vX.Y.Z`) werden nur hier gesetzt.
- `staging`: Teststand vor dem Release.
- Arbeitszweige zweigen von `staging` ab und gehen per Pull Request zurück. `hotfix/…` zweigt von `main` ab.

Benennung: `<typ>/<kurzbeschreibung>`, kleingeschrieben, mit Bindestrichen, ohne Umlaute.
Typen: `feature/`, `fix/`, `hotfix/`, `chore/`, `docs/`.
Beispiele: `feature/stundenplan`, `fix/12-kalender-zeitzone`.

Die CI prüft Name und Ziel jedes Pull Requests. Ein Tag `vX.Y.Z` auf `main` erstellt automatisch ein Release
mit ZIP der Module. Neue Core-Tags kommen wöchentlich als Pull Request nach `staging`.

`main` und `staging` werden nur per Pull Request mit grüner CI geändert. Technisch erzwungen wird das noch nicht,
weil GitHub Branch-Schutz für private Repos ohne bezahlten Plan nicht anbietet.
