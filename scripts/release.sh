#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

RELEASE_ENV_FILE="${RELEASE_ENV_FILE:-${ROOT_DIR}/.release.env}"
if [ -f "$RELEASE_ENV_FILE" ]; then
  # shellcheck disable=SC1090
  set -a
  . "$RELEASE_ENV_FILE"
  set +a
fi

FTP_HOST="${FTP_HOST:-ftp.magicspaceillustration.com}"
FTP_USER="${FTP_USER:-magicspa}"
FTP_PASS="${FTP_PASS:-}"

readonly EXCLUDED_NAMES=(
  ".db-config.php"
  ".user.ini"
  ".release.env"
  ".release.env.example"
  "overrides.js"
  ".DS_Store"
  ".gitignore"
)

readonly EXCLUDED_PREFIXES=(
  ".git/"
  "skills/"
  "scripts/"
)

readonly EXCLUDED_FILES=(
  "ODERLAND_SETUP.md"
  "SECURITY_LIVE_SETUP.md"
  "RELEASE_RUNBOOK.md"
)

usage() {
  cat <<USAGE
Usage:
  $(basename "$0") preflight <stage|live>
  $(basename "$0") backup <stage|live>
  $(basename "$0") deploy <stage|live>
  $(basename "$0") postcheck <stage|live>
  $(basename "$0") full <stage|live>
  $(basename "$0") list-files

Environment:
  FTP_USER   FTP username (defaults to magicspa)
  FTP_PASS   FTP password (prompts if missing)
  FTP_HOST   Defaults to ftp.magicspaceillustration.com
  RELEASE_ENV_FILE  Optional path to env file (default: .release.env)
USAGE
}

log() {
  printf '[release] %s\n' "$*"
}

warn() {
  printf '[release][warn] %s\n' "$*" >&2
}

die() {
  printf '[release][error] %s\n' "$*" >&2
  exit 1
}

target_remote_base() {
  case "$1" in
    stage) echo "/stage.olagustafsson.com" ;;
    live)  echo "/public_html/olagustafsson.com" ;;
    *) die "Unknown target: $1 (use stage or live)" ;;
  esac
}

target_web_base() {
  case "$1" in
    stage) echo "https://stage.olagustafsson.com" ;;
    live)  echo "https://olagustafsson.com" ;;
    *) die "Unknown target: $1 (use stage or live)" ;;
  esac
}

require_tools() {
  local tools=(curl find rg sed wc date mktemp)
  local t
  for t in "${tools[@]}"; do
    command -v "$t" >/dev/null 2>&1 || die "Missing required tool: $t"
  done
}

require_env() {
  [ -n "$FTP_USER" ] || die "Set FTP_USER before running."
  if [ -z "$FTP_PASS" ]; then
    if [ -t 0 ]; then
      read -r -s -p "FTP password for ${FTP_USER}@${FTP_HOST}: " FTP_PASS || true
      printf '\n' >&2
      [ -n "$FTP_PASS" ] || die "FTP password is empty."
      export FTP_PASS
    else
      die "Set FTP_PASS (or create .release.env) before running in non-interactive mode."
    fi
  fi
}

should_exclude_rel() {
  local rel="$1"
  local name="${rel##*/}"
  local value

  for value in "${EXCLUDED_NAMES[@]}"; do
    if [ "$name" = "$value" ]; then
      return 0
    fi
  done

  for value in "${EXCLUDED_PREFIXES[@]}"; do
    case "$rel" in
      "$value"*) return 0 ;;
    esac
  done

  for value in "${EXCLUDED_FILES[@]}"; do
    if [ "$rel" = "$value" ]; then
      return 0
    fi
  done

  return 1
}

collect_files() {
  local file rel
  while IFS= read -r file; do
    rel="${file#"${ROOT_DIR}/"}"
    should_exclude_rel "$rel" && continue
    printf '%s\n' "$rel"
  done < <(find "$ROOT_DIR" -type f | LC_ALL=C sort)
}

remote_get() {
  local target="$1"
  local rel="$2"
  local output="$3"
  local base
  base="$(target_remote_base "$target")"

  curl -sS --ftp-method nocwd --user "$FTP_USER:$FTP_PASS" \
    "ftp://${FTP_HOST}${base}/${rel}" -o "$output"
}

check_http_url() {
  local url="$1"
  local tmp
  tmp="$(mktemp)"

  local code
  code="$(curl -sS -o "$tmp" -w '%{http_code}' "$url" || true)"

  if [[ "$code" =~ ^[23][0-9][0-9]$ ]]; then
    printf 'OK   %s -> %s\n' "$code" "$url"
    rm -f "$tmp"
    return 0
  fi

  printf 'FAIL %s -> %s\n' "$code" "$url"
  rm -f "$tmp"
  return 1
}

run_preflight() {
  local target="$1"
  local remote_base
  remote_base="$(target_remote_base "$target")"

  require_tools
  require_env

  log "Testing FTP login"
  curl -sS --ftp-method nocwd --user "$FTP_USER:$FTP_PASS" "ftp://${FTP_HOST}/" >/dev/null

  log "Validating required local files"
  local required=(
    "index.php"
    "gallery.php"
    "artwork.php"
    "sitemap.php"
    "studio.html"
    "studio.js"
    "styles.css"
    "api/bootstrap.php"
  )
  local rel
  for rel in "${required[@]}"; do
    [ -f "${ROOT_DIR}/${rel}" ] || die "Missing required file: ${rel}"
  done

  log "Checking remote runtime config (${target})"
  local cfg
  cfg="$(mktemp)"
  remote_get "$target" ".db-config.php" "$cfg" || die "Could not read ${remote_base}/.db-config.php"

  if ! rg -q "'security'\s*=>\s*\[" "$cfg"; then
    rm -f "$cfg"
    die "Remote .db-config.php looks invalid (missing security block)."
  fi

  if [ "$target" = "live" ] && ! rg -q "'openai'\s*=>\s*\[" "$cfg"; then
    rm -f "$cfg"
    die "Remote live .db-config.php missing openai block. Fix before deploy."
  fi

  rm -f "$cfg"

  if [ -f "${ROOT_DIR}/overrides.js" ]; then
    local overrides_size
    overrides_size="$(wc -c < "${ROOT_DIR}/overrides.js" | tr -d ' ')"
    if [ "${overrides_size}" -lt 1024 ]; then
      warn "Local overrides.js is small (${overrides_size} bytes). This is expected if content is runtime-managed."
    fi
  fi

  log "Preflight OK (${target})."
  log "Deploy excludes: .db-config.php, .user.ini, overrides.js"
}

run_backup() {
  local target="$1"
  require_env

  local timestamp backup_dir remote_base
  timestamp="$(date +%Y%m%d-%H%M%S)"
  backup_dir="/tmp/ola-release-backup-${target}-${timestamp}"
  remote_base="$(target_remote_base "$target")"

  mkdir -p "$backup_dir"
  log "Backing up critical files from ${remote_base} to ${backup_dir}"

  local files=(
    ".htaccess"
    "index.php"
    "artwork.php"
    "gallery.php"
    "seo.php"
    "sitemap.php"
    "robots.php"
    ".user.ini"
    ".db-config.php"
    "overrides.js"
  )

  local rel
  for rel in "${files[@]}"; do
    local dest
    dest="${backup_dir}/${rel}"
    mkdir -p "$(dirname "$dest")"
    if remote_get "$target" "$rel" "$dest"; then
      log "Backed up ${rel}"
    else
      warn "Skipping ${rel} (not found or unreadable)"
      rm -f "$dest"
    fi
  done

  log "Backup complete: ${backup_dir}"
}

run_deploy() {
  local target="$1"
  require_tools
  require_env

  local remote_base
  remote_base="$(target_remote_base "$target")"

  local file_list
  file_list="$(mktemp)"
  collect_files > "$file_list"

  local total
  total="$(wc -l < "$file_list" | tr -d ' ')"
  [ "$total" -gt 0 ] || die "No files to deploy."

  log "Deploying ${total} files to ${remote_base}"
  local i rel src url
  i=0
  while IFS= read -r rel; do
    src="${ROOT_DIR}/${rel}"
    url="ftp://${FTP_HOST}${remote_base}/${rel}"
    curl -sS --ftp-method nocwd --ftp-create-dirs --user "$FTP_USER:$FTP_PASS" -T "$src" "$url"
    i=$((i + 1))
    if [ $((i % 25)) -eq 0 ] || [ "$i" -eq "$total" ]; then
      log "Uploaded ${i}/${total}"
    fi
  done < "$file_list"

  rm -f "$file_list"
  log "Deploy complete (${target})."
}

run_postcheck() {
  local target="$1"
  local base
  base="$(target_web_base "$target")"

  log "Running post-deploy checks on ${base}"
  local failed=0
  local path
  local checks=(
    "/"
    "/studio.html"
    "/api/auth/status.php"
    "/sitemap.xml"
    "/verk/vagen-hem?lang=sv"
  )

  if ! check_http_url "${base}/galleri/"; then
    if ! check_http_url "${base}/gallery.php"; then
      failed=1
    fi
  fi

  for path in "${checks[@]}"; do
    if ! check_http_url "${base}${path}"; then
      failed=1
    fi
  done

  if [ "$failed" -ne 0 ]; then
    die "Postcheck failed for one or more URLs."
  fi

  log "Postcheck OK (${target})."
}

run_list_files() {
  collect_files
}

main() {
  local action="${1:-}"
  local target="${2:-}"

  case "$action" in
    preflight)
      [ -n "$target" ] || die "Target is required: stage|live"
      run_preflight "$target"
      ;;
    backup)
      [ -n "$target" ] || die "Target is required: stage|live"
      run_backup "$target"
      ;;
    deploy)
      [ -n "$target" ] || die "Target is required: stage|live"
      run_deploy "$target"
      ;;
    postcheck)
      [ -n "$target" ] || die "Target is required: stage|live"
      run_postcheck "$target"
      ;;
    full)
      [ -n "$target" ] || die "Target is required: stage|live"
      run_preflight "$target"
      run_backup "$target"
      run_deploy "$target"
      run_postcheck "$target"
      ;;
    list-files)
      run_list_files
      ;;
    -h|--help|help)
      usage
      ;;
    *)
      usage
      exit 2
      ;;
  esac
}

main "$@"
