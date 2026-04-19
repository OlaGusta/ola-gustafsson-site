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
tmp_stage=""
tmp_live=""

log() {
  printf '[promote-content] %s\n' "$*"
}

die() {
  printf '[promote-content][error] %s\n' "$*" >&2
  exit 1
}

require_tools() {
  local tools=(curl rg shasum mktemp)
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
      die "Set FTP_PASS before running in non-interactive mode."
    fi
  fi
}

fetch_remote_file() {
  local remote_path="$1"
  local output_file="$2"
  curl -sS --fail --ftp-method nocwd --user "$FTP_USER:$FTP_PASS" \
    "ftp://${FTP_HOST}${remote_path}" -o "$output_file"
}

upload_remote_file() {
  local local_path="$1"
  local remote_path="$2"
  curl -sS --fail --ftp-method nocwd --user "$FTP_USER:$FTP_PASS" \
    -T "$local_path" "ftp://${FTP_HOST}${remote_path}" >/dev/null
}

cleanup_tmp_files() {
  rm -f "${tmp_stage:-}" "${tmp_live:-}"
}

main() {
  require_tools
  require_env

  tmp_stage="$(mktemp)"
  tmp_live="$(mktemp)"
  trap cleanup_tmp_files EXIT

  local stage_path="/stage.olagustafsson.com/overrides.js"
  local live_path="/public_html/olagustafsson.com/overrides.js"

  log "Fetching stage overrides.js"
  fetch_remote_file "$stage_path" "$tmp_stage"

  if ! rg -q "PORTFOLIO_OVERRIDES" "$tmp_stage"; then
    die "Stage overrides.js does not look valid (missing PORTFOLIO_OVERRIDES)."
  fi

  local stage_hash live_hash
  stage_hash="$(shasum -a 256 "$tmp_stage" | awk '{print $1}')"

  log "Uploading stage overrides.js to live"
  upload_remote_file "$tmp_stage" "$live_path"

  log "Verifying live overrides.js"
  fetch_remote_file "$live_path" "$tmp_live"
  live_hash="$(shasum -a 256 "$tmp_live" | awk '{print $1}')"

  if [ "$stage_hash" != "$live_hash" ]; then
    die "Verification failed: live overrides hash differs from stage."
  fi

  log "Done. Live overrides now match stage (sha256: ${live_hash})."
}

main "$@"
