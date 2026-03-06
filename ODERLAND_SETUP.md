# Oderland: Deploy + Aktivering (Secure Auth)

Den här guiden gäller nuvarande setup:
- statisk frontend (`index.html`, `gallery.html`, `studio.html`)
- backend i `api/` (PHP + MySQL)
- Studio-auth med lösenord + TOTP 2FA + recovery-koder + resetflöde.

## 1) Ladda upp filer till stage/live

Använd release-skriptet:
- `./scripts/release.sh preflight <stage|live>`
- `./scripts/release.sh backup <stage|live>`
- `./scripts/release.sh deploy <stage|live>`
- `./scripts/release.sh postcheck <stage|live>`

Enklare vardagskommandon:
- `./scripts/stage-release.sh`
- `./scripts/live-release.sh`
- `./scripts/publish.sh` (kör stage och frågar sedan om live)

Skriptet deployar kod men exkluderar medvetet:
- `.db-config.php` (miljöspecifika secrets/nycklar)
- `.user.ini` (miljöspecifik PHP-runtime)
- `overrides.js` (publicerat runtime-innehåll)

Detta förhindrar att live-konfiguration och publicerad data skrivs över av misstag.

Viktigt:
- Behåll `Options -Indexes` i `.htaccess` så kataloglistning är avstängd.
- Se `RELEASE_RUNBOOK.md` för full stage->live-rutin.

## 2) Databas

1. Skapa databasen i Oderland/cPanel.
2. Importera `/db/schema.sql`.
3. Sätt rätt DB-uppgifter i `.db-config.php`.

Schema innehåller:
- `portfolio_state`
- `studio_admin`
- `studio_recovery_codes`
- `security_rate_limits`
- `studio_password_resets`
- `contact_messages`

## 3) Säkerhetskonfig i `.db-config.php`

I `security`-blocket:
- `authMode`: `session-2fa`
- `bootstrapAccessKey`: lång slumpad nyckel (krävs när första admin skapas)
- `sessionTtlSeconds`: sessionslängd
- `login*`, `reset*`, `contact*`: rate-limit och blocktider
- `resetBaseUrl`: exakt URL till `studio.html` på aktuell miljö
- `turnstileSiteKey` och `turnstileSecret` för kontaktformulär
- `mailerFrom`, `mailerReplyTo`, `contactRecipient` för e-post

`content.js` ska ha:
- `studioAccess.mode: "secure-auth"`
- `studioAccess.password: ""`
- `contact.form.turnstileSiteKey` satt om Turnstile används publikt.

## 4) Första aktivering av Studio-admin

1. Öppna `https://din-domän/studio.html`.
2. Om ingen admin finns visas bootstrap-flödet.
3. Ange:
   - admin-e-post
   - starkt lösenord
   - bootstrap-nyckel (från `.db-config.php`)
4. Lägg in TOTP-secret i authenticator-app.
5. Slutför med 6-siffrig kod.
6. Spara recovery-koder offline direkt.

Efter bootstrap:
- inloggning kräver lösenord + TOTP eller recovery-kod
- publicering till `api/publish.php` kräver giltig session + CSRF.

## 5) Återställning av lösenord

1. På `studio.html`, klicka `Glömt lösenord`.
2. Begär reset-länk.
3. Länk skickas via backend-mail till admin-adressen.
4. Sätt nytt lösenord via `reset_token`-länk.

Tips:
- verifiera först att `mail()` fungerar i miljön, annars använd SMTP/extern mailprovider.

## 6) Kontaktform anti-spam

Skydd som finns:
- honeypot-fält
- minsta submit-tid
- IP-baserad rate limit + blockering
- valfri Turnstile-verifiering server-side
- lagring av meddelande + leveransstatus i DB.

För aktiv captcha i live:
1. Sätt `security.turnstileSecret` i `.db-config.php`.
2. Sätt `contact.form.turnstileSiteKey` i `content.js`.
3. Kontrollera CSP i `.htaccess` (Cloudflare Turnstile-domäner är redan tillagda).

## 7) Go-live checklista

1. HTTPS fungerar för hela domänen.
2. `GET /api/auth/status.php` svarar `ok: true`.
3. Studio-login fungerar med 2FA.
4. `POST /api/publish.php` fungerar efter login.
5. Reset-flöde fungerar end-to-end.
6. Kontaktform fungerar och blockar spamtest.
7. Recovery-koder finns sparade offline.
8. Ny backup av filer + DB är tagen innan live.
9. Deploy har körts via `scripts/release.sh` (inte manuell overwrite av `.db-config.php`/`overrides.js`).
