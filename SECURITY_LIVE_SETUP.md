# Security Live Setup

Målet är Wordfence-liknande grundskydd för en custom stack:
- stark autentisering
- 2FA
- resetflöde
- rate limiting/bruteforce-skydd
- anti-spam på kontaktform.

## 1) Auth och åtkomst

Studio kör i `secure-auth`:
- konto: exakt en adminrad i `studio_admin`
- inloggning: e-post + lösenord + TOTP (eller recovery-kod)
- session: server-side session med TTL + session-version
- CSRF: krävs för state-changing calls (t.ex. publish/logout).

Endast bootstrap när admin saknas:
- endpoint: `/api/auth/bootstrap.php`
- skydd: `bootstrapAccessKey` + rate limit
- bootstrap bör göras direkt efter deploy.

## 2) Bruteforce och abuse-skydd

DB-tabell `security_rate_limits` används för:
- login-försök (IP + konto)
- reset-försök (IP + konto)
- bootstrap-försök (IP)
- kontaktform (IP).

När gräns nås:
- svar `429`
- `Retry-After` header
- temporär blockering enligt config.

## 3) Password reset

Flöde:
1. `/api/auth/request-reset.php` skapar token-hash i `studio_password_resets`.
2. Mail med reset-länk skickas till admin.
3. `/api/auth/reset-password.php` verifierar token (giltig tid + ej använd).
4. Lösenord uppdateras, session-version ökas, reset-token invalidieras.

Säkerhet:
- generiskt svar i request-reset (minskar konto-uppslagning)
- token lagras hashat
- engångsanvändning + expiry.

## 4) 2FA och recovery

2FA:
- TOTP (6 siffror, 30s fönster)
- verifiering med litet tidsfönster.

Recovery:
- engångskoder hashade i `studio_recovery_codes`
- markeras `used_at` vid användning.

Operativt krav:
- recovery-koder måste lagras offline.

## 5) Kontaktform och anti-spam

Kontakt-API: `/api/contact.php`
- honeypot (`website`)
- minsta submit-tid (`elapsedMs`)
- rate-limit/blockering
- valfri Turnstile-verifiering (secret i backend).

För full effekt:
- sätt både `turnstileSiteKey` (frontend) och `turnstileSecret` (backend).

## 6) HTTP hardening

`.htaccess` sätter:
- HTTPS-redirect
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- CSP med explicita källor (inkl. Turnstile)
- cache headers
- `Options -Indexes`.

## 7) Konfigkrav innan live

I `.db-config.php`:
- `security.authMode = "session-2fa"`
- `security.bootstrapAccessKey = <lång slumpad hemlighet>`
- `security.appSecret = <egen stark hemlighet>`
- `security.resetBaseUrl = https://din-domän/studio.html`
- `security.mailerFrom`, `security.mailerReplyTo`, `security.contactRecipient`
- `security.turnstileSecret` (om captcha aktiv)

I `content.js`:
- `studioAccess.mode = "secure-auth"`
- `contact.form.turnstileSiteKey` (om captcha aktiv).

## 8) Rekommenderat extra skydd (server-nivå)

Utöver app-lagret:
- aktivera WAF/ModSecurity i hostingpanelen
- blockera XML-RPC/irrelevanta attackytor om de inte används
- övervaka access/error-loggar dagligen första veckorna
- ta regelbunden backup av filer + databas.

## 9) Verifiering före live

1. Login med korrekt 2FA fungerar.
2. Login med felaktig 2FA blockeras och rate-limit triggas.
3. Reset-länk skickas och kan användas exakt en gång.
4. Publish utan CSRF token nekas.
5. Kontaktform blockerar:
   - för snabb submit
   - fylld honeypot
   - fel/avsaknad captcha (när aktiv).
6. Headers/CSP visas korrekt på live.
