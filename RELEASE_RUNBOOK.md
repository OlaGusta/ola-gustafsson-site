# Release Runbook (Stage -> Live)

Detta flode minimerar risken for drift mellan stage och live.

## Grundprincip

1. Bygg och testa pa `stage`.
2. Deploya samma kod till `live`.
3. Hall miljo-specifika filer utanfor vanlig koddeploy.

## Varfor tidigare buggar kan komma tillbaka

De buggar vi fixade kommer tillbaka om fel filer skrivs over vid deploy:

- `.db-config.php`:
  - Innehaller OpenAI-nyckel, GA4 service account, auth/security.
  - Om live-filen skrivs over av en annan variant far du t.ex. "OpenAI saknar konfiguration" igen.
- `overrides.js`:
  - Innehaller runtime/publicerad innehallsdata.
  - Om en liten lokal stub laddas upp forsvinner inlagd info/titlar till fallback-varden.
- `.user.ini`:
  - Innehaller runtime-PHP-inställningar i hostingmiljon.
  - Fel overwrite kan aktivera gammal prepend/legacy-beteende igen.

## Live-texter vs stage-texter (viktigt)

I din setup ar publicerad text pa live en kombination av:
- `content.js` (grund/fallback)
- DB + `overrides.js` (det du sparar i Studio)

Deploy-scriptet skriver **inte** over `overrides.js`, sa normala code deploys ersatter inte live-texter.

Praktisk regel:
- Andra skarpa texter i live-Studio.
- Andra kod/layout pa stage.
- Om du vill testa med samma texter pa stage: exportera JSON i live-Studio, importera i stage-Studio, spara.

## Nytt verktyg

Skript: `/Users/olagustafsson/Documents/New project/scripts/release.sh`

Det deployar kod men **exkluderar alltid**:

- `.db-config.php`
- `.user.ini`
- `overrides.js`

## Engangssetup (enklast)

```bash
cp .release.env.example .release.env
```

Fyll sedan i `FTP_PASS` i `.release.env`.

Efter det lasa scriptet in allt automatiskt.

## Snabbkommandon (vardag)

```bash
./scripts/stage-release.sh
./scripts/live-release.sh
```

Ett enda kommando for stage -> valfri live:

```bash
./scripts/publish.sh
```

## Om du inte vill skapa .release.env

```bash
export FTP_HOST='ftp.magicspaceillustration.com'
export FTP_USER='magicspa'
export FTP_PASS='...'
```

## Manuell release till stage

```bash
./scripts/release.sh preflight stage
./scripts/release.sh backup stage
./scripts/release.sh deploy stage
./scripts/release.sh postcheck stage
```

## Go-live release

```bash
./scripts/release.sh preflight live
./scripts/release.sh backup live
./scripts/release.sh deploy live
./scripts/release.sh postcheck live
```

Eller i ett steg:

```bash
./scripts/release.sh full live
```

## Nar du behover andra typer av andringar

- Innehallsuppdatering (titlar/texter i Studio):
  - Gor i live-Studio (skarp publicering).
  - Skriv **inte** over `overrides.js` via deploy.
- Konfigandring (OpenAI, GA4, security):
  - Andra i aktuell miljo direkt i respektive `.db-config.php`.
  - Dokumentera andringen i en separat checklista.
- Akutfix direkt i live-kod:
  - Gor fixen, verifiera.
  - For over samma fix till stage/lokal kod direkt efterat.

## Rekommenderad efterkontroll

- Startsida och galleri laddar.
- Minst en verks-URL svarar 200.
- Studio-inloggning fungerar.
- `sitemap.xml` svarar 200.
- Delningspreview testas med "scrape again" i vald plattform.
