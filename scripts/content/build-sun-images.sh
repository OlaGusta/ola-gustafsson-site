#!/usr/bin/env bash
# Bygger webbversioner av de 100 solarna till images/sol/.
# Källa: InDesign-exporten "100dagaravsol - N.jpeg" där N = dagnumret.
# Ut: images/sol/dag-NNN.jpg (1600 px lång sida) + thumb/dag-NNN.jpg (520 px),
# båda med .webp-sidecar som .htaccess serverar automatiskt.
set -euo pipefail

SRC="${1:-/Volumes/SSES3/Annat/Olas Konst/100dagaravsol}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/images/sol"
mkdir -p "$OUT/thumb"

for n in $(seq 1 100); do
  in="$SRC/100dagaravsol - $n.jpeg"
  [ -f "$in" ] || { echo "saknas: $in" >&2; exit 1; }
  id=$(printf 'dag-%03d' "$n")
  magick "$in" -auto-orient -colorspace sRGB -strip -resize '1600x1600>' -quality 84 "$OUT/$id.jpg"
  magick "$in" -auto-orient -colorspace sRGB -strip -resize '520x520>' -quality 80 "$OUT/thumb/$id.jpg"
  cwebp -quiet -q 82 "$OUT/$id.jpg" -o "$OUT/$id.jpg.webp"
  cwebp -quiet -q 78 "$OUT/thumb/$id.jpg" -o "$OUT/thumb/$id.jpg.webp"
done

# Manifest med pixelmått så att sidan kan sätta width/height (ingen layoutförskjutning).
{
  printf '{\n'
  for n in $(seq 1 100); do
    id=$(printf 'dag-%03d' "$n")
    read -r w h < <(magick identify -format '%w %h\n' "$OUT/thumb/$id.jpg")
    sep=','; [ "$n" -eq 100 ] && sep=''
    printf '  "%d": [%d, %d]%s\n' "$n" "$w" "$h" "$sep"
  done
  printf '}\n'
} > "$OUT/manifest.json"

du -sh "$OUT"
