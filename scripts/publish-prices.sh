#!/usr/bin/env bash
# Publicera innehåll (overrides.js) till stage eller live OCH synka databasen,
# så att Studio inte skriver över det vid nästa publicering.
#
#   ./scripts/publish-prices.sh stage
#   ./scripts/publish-prices.sh live
#
# Steg: 1) backup av serverns overrides.js  2) ladda upp repots overrides.js
#       3) ladda upp engångsskriptet under slumpat namn, anropa det, radera det
#       4) verifiera att fil och DB (api/content.php) har samma antal prissatta verk.
# Kräver FTP_PASS i .release.env (samma som scripts/release.sh).
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

RELEASE_ENV_FILE="${RELEASE_ENV_FILE:-${ROOT_DIR}/.release.env}"
if [ -f "$RELEASE_ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  . "$RELEASE_ENV_FILE"
  set +a
fi
FTP_HOST="${FTP_HOST:-ftp.magicspaceillustration.com}"
FTP_USER="${FTP_USER:-magicspa}"
FTP_PASS="${FTP_PASS:-}"

log() { printf '[publish-prices] %s\n' "$*"; }
die() { printf '[publish-prices][error] %s\n' "$*" >&2; exit 1; }

target="${1:-}"
case "$target" in
  stage) REMOTE_BASE="/stage.olagustafsson.com"; WEB_BASE="https://stage.olagustafsson.com" ;;
  live)  REMOTE_BASE="/public_html/olagustafsson.com"; WEB_BASE="https://olagustafsson.com" ;;
  *) die "Usage: $0 <stage|live>" ;;
esac

[ -n "$FTP_PASS" ] || die "FTP_PASS saknas. Skapa .release.env från .release.env.example."
command -v node >/dev/null || die "node saknas"
command -v curl >/dev/null || die "curl saknas"

LOCAL_OVERRIDES="${ROOT_DIR}/overrides.js"
SYNC_SRC="${ROOT_DIR}/scripts/oneoff/sync-overrides-to-db.php"
[ -f "$LOCAL_OVERRIDES" ] || die "overrides.js saknas i repot"
[ -f "$SYNC_SRC" ] || die "sync-skriptet saknas"
grep -q "PORTFOLIO_OVERRIDES" "$LOCAL_OVERRIDES" || die "Lokal overrides.js ser inte giltig ut"

ftp_get() { curl -sS --fail --ftp-method nocwd --user "$FTP_USER:$FTP_PASS" "ftp://${FTP_HOST}$1" -o "$2"; }
ftp_put() { curl -sS --fail --ftp-method nocwd --user "$FTP_USER:$FTP_PASS" -T "$1" "ftp://${FTP_HOST}$2" >/dev/null; }
ftp_del() { curl -sS --fail --ftp-method nocwd --user "$FTP_USER:$FTP_PASS" "ftp://${FTP_HOST}$(dirname "$1")/" -Q "DELE $1" -o /dev/null; }

count_priced() {
  node -e '
    const fs=require("fs");const raw=fs.readFileSync(process.argv[1],"utf8");
    let payload;
    if (raw.includes("PORTFOLIO_OVERRIDES")) { const s=raw.indexOf("{",raw.indexOf("PORTFOLIO_OVERRIDES")); payload=JSON.parse(raw.slice(s,raw.lastIndexOf("}")+1)); }
    else { const b=JSON.parse(raw); payload=b.payload||b; }
    const a=(payload.gallery&&payload.gallery.artworks)||[];
    console.log(a.length+" "+a.filter(x=>x&&typeof x.priceLabel==="string"&&x.priceLabel.trim()).length);
  ' "$1"
}

BACKUP_DIR="${ROOT_DIR}/scripts/content/backups"
mkdir -p "$BACKUP_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/overrides-${target}-${STAMP}.js"

log "1/4 Backup av ${target} overrides.js -> ${BACKUP_FILE}"
ftp_get "${REMOTE_BASE}/overrides.js" "$BACKUP_FILE"
grep -q "PORTFOLIO_OVERRIDES" "$BACKUP_FILE" || die "Backupen ser inte giltig ut – avbryter"
log "    server före: $(count_priced "$BACKUP_FILE" | awk '{print $1" verk, "$2" prissatta"}')"
log "    lokalt:      $(count_priced "$LOCAL_OVERRIDES" | awk '{print $1" verk, "$2" prissatta"}')"

log "2/4 Laddar upp overrides.js"
ftp_put "$LOCAL_OVERRIDES" "${REMOTE_BASE}/overrides.js"

TOKEN="$(LC_ALL=C tr -dc 'a-f0-9' </dev/urandom | head -c 48)"
TMP_SYNC="$(mktemp)"
trap 'rm -f "$TMP_SYNC"' EXIT
sed "s/__SYNC_TOKEN__/${TOKEN}/" "$SYNC_SRC" >"$TMP_SYNC"
REMOTE_SYNC="${REMOTE_BASE}/api/_sync-${TOKEN:0:12}.php"
WEB_SYNC="${WEB_BASE}/api/_sync-${TOKEN:0:12}.php?token=${TOKEN}"

log "3/4 Synkar databasen"
ftp_put "$TMP_SYNC" "$REMOTE_SYNC"
SYNC_RESULT="$(curl -sS "$WEB_SYNC" || true)"
ftp_del "$REMOTE_SYNC" || log "    VARNING: kunde inte radera ${REMOTE_SYNC} – ta bort den manuellt"
log "    svar: ${SYNC_RESULT}"
printf '%s' "$SYNC_RESULT" | grep -q '"ok":true' || die "DB-synk misslyckades. Filen är uppladdad men DB är gammal – kör om, eller återställ från ${BACKUP_FILE}"

log "4/4 Verifierar"
TMP_FILE="$(mktemp)"; TMP_DB="$(mktemp)"
curl -sS --fail "${WEB_BASE}/overrides.js?nocache=${STAMP}" -o "$TMP_FILE"
curl -sS --fail "${WEB_BASE}/api/content.php?nocache=${STAMP}" -o "$TMP_DB"
FILE_COUNT="$(count_priced "$TMP_FILE")"
DB_COUNT="$(count_priced "$TMP_DB")"
rm -f "$TMP_FILE" "$TMP_DB"
log "    fil: ${FILE_COUNT}   db: ${DB_COUNT}   (verk prissatta)"
[ "$FILE_COUNT" = "$DB_COUNT" ] || die "Fil och DB skiljer sig åt"
log "Klart. ${target} har nu priserna i både overrides.js och databasen."
