#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

"${SCRIPT_DIR}/release.sh" full stage

printf '\nStage release is done and checks passed.\n'
read -r -p "Deploy the same release to LIVE now? [y/N]: " answer

case "${answer}" in
  y|Y|yes|YES)
    "${SCRIPT_DIR}/release.sh" full live
    printf '\nPromoting stage text/content (overrides.js) to LIVE...\n'
    "${SCRIPT_DIR}/promote-stage-overrides-to-live.sh"
    ;;
  *)
    printf 'Stopped before live deploy.\n'
    ;;
esac
