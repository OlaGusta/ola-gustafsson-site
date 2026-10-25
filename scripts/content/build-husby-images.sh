#!/usr/bin/env bash
# Bygger webbversioner av bilderna till utställningssidan Ljusets återkomst
# (/ljusets-aterkomst) till images/ljusets-aterkomst/.
# Källor: fotografens mapp "Husby utställningsfix" på SSES3 och Olas egna filer
# i ~/Documents/Claude/husby-2026/bilder (andra argumentet). Där ligger också
# ola-demo-kort-skarpedjup.jpg: ola-demo-original.jpg med kort skärpedjup
# (Apple Vision-masker + oskärpa) och tätare beskärning.
# Ut: <id>.jpg (1600 px lång sida) + thumb/<id>.jpg (800 px), båda med
# .webp-sidecar som .htaccess serverar automatiskt, och manifest.json med mått.
# Befintliga bilder byggs inte om (FORCE=1 bygger alla), så att deployen bara
# laddar upp nya.
set -euo pipefail

SRC="${1:-/Volumes/SSES3/Annat/Olas Konst/Husby/Husby utställningsfix}"
OWN="${2:-$HOME/Documents/Claude/husby-2026/bilder}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/images/ljusets-aterkomst"
mkdir -p "$OUT/thumb"

# id|källa (relativ till SRC, eller own:<fil> relativ till OWN)
IMAGES=(
  "00-utstallningen|Husby_vernissage&demodag32.jpg"
  "01-timmarna-och-solvaggen|Husby_vernissage&demodag1.jpg"
  "02-ola-vid-solvaggen|own:ola-vid-solvaggen.jpg"
  "03-svarta-rummet|Husby_vernissage&demodag2.jpg"
  "04-det-langa-nuet|Husby_vernissage&demodag4.jpg"
  "05-tid-i-vila|Husby_vernissage&demodag11.jpg"
  "06-timmarna-daremellan|Husby_vernissage&demodag17.jpg"
  "07-jenny-skarmar|Husby_vernissage&demodag7.jpg"
  "08-jenny-vagg|Husby_vernissage&demodag6.jpg"
  "09-oppningstal|Husby_vernissage&demodag14.jpg"
  "10-ola-och-jenny|own:ola-och-jenny.jpg"
  "11-blommor|Husby_vernissage&demodag15.jpg"
  "12-ola-demo|own:ola-demo-kort-skarpedjup.jpg"
  "13-jenny-demo|Husby_vernissage&demodag52.jpg"
  "14-pensel|Husby_vernissage&demodag66.jpg"
  "15-solvaggen|Husby_vernissage&demodag38.jpg"
  "16-demomalning-sol|own:demomalning-sol.jpg"
  "17-demomalning-moln|own:demomalning-moln.jpg"
)

for entry in "${IMAGES[@]}"; do
  id="${entry%%|*}"
  src="${entry#*|}"
  if [[ "$src" == own:* ]]; then
    [ -n "$OWN" ] || { echo "ange mappen med Olas egna filer som andra argument" >&2; exit 1; }
    in="$OWN/${src#own:}"
  else
    in="$SRC/$src"
  fi
  [ -f "$in" ] || { echo "saknas: $in" >&2; exit 1; }
  if [ -f "$OUT/$id.jpg" ] && [ -z "${FORCE:-}" ]; then
    continue
  fi
  magick "$in" -auto-orient -colorspace sRGB -strip -resize '1600x1600>' -quality 84 "$OUT/$id.jpg"
  magick "$in" -auto-orient -colorspace sRGB -strip -resize '800x800>' -quality 80 "$OUT/thumb/$id.jpg"
  cwebp -quiet -q 82 "$OUT/$id.jpg" -o "$OUT/$id.jpg.webp"
  cwebp -quiet -q 78 "$OUT/thumb/$id.jpg" -o "$OUT/thumb/$id.jpg.webp"
done

# Delningsbild 1200 × 630 för og:image (samma som toppbilden).
magick "$SRC/Husby_vernissage&demodag32.jpg" -auto-orient -colorspace sRGB -strip \
  -resize '1200x630^' -gravity center -extent 1200x630 -quality 84 "$OUT/og.jpg"

# Manifest med pixelmått så att sidan kan sätta width/height (ingen layoutförskjutning).
{
  printf '{\n'
  n=0
  for entry in "${IMAGES[@]}"; do
    n=$((n + 1))
    id="${entry%%|*}"
    read -r w h < <(magick identify -format '%w %h\n' "$OUT/$id.jpg")
    sep=','; [ "$n" -eq "${#IMAGES[@]}" ] && sep=''
    printf '  "%s": [%d, %d]%s\n' "$id" "$w" "$h" "$sep"
  done
  printf '}\n'
} > "$OUT/manifest.json"

du -sh "$OUT"
