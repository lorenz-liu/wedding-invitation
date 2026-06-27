#!/usr/bin/env bash
# Convert preloaded PNG assets (from src/utils/assets.ts) to WebP via ImageMagick 7.
#
# Usage:
#   ./scripts/convert-images-to-webp.sh          # write to assets/images-webp/
#   ./scripts/convert-images-to-webp.sh --install # copy .webp into assets/images/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="$ROOT/assets/images"
OUT_DIR="$ROOT/assets/images-webp"
ASSETS_TS="$ROOT/src/utils/assets.ts"

QUALITY_DEFAULT=85
ALPHA_DEFAULT=85
QUALITY_HIGH=90
ALPHA_HIGH=92
WEBP_METHOD=6

# Fine lines / small UI — higher quality
HIGH_QUALITY_BASENAMES=(
  logo-no-bg
  story-icon
  signature-gao
  signature-niu
  paw-1
  paw-2
  hand-holding
  agenda-ceremony
  agenda-dinner
  agenda-party
)

if ! command -v magick >/dev/null 2>&1; then
  echo "ImageMagick 7 required: brew install imagemagick" >&2
  exit 1
fi

contains_high_quality() {
  local base="$1"
  for item in "${HIGH_QUALITY_BASENAMES[@]}"; do
    if [[ "$item" == "$base" ]]; then
      return 0
    fi
  done
  return 1
}

PNG_FILES=()
while IFS= read -r line; do
  PNG_FILES+=("$line")
done < <(
  grep -oE 'assetPath\("images/[^"]+\.webp"\)' "$ASSETS_TS" \
    | sed -E 's/assetPath\("images\/(.+)\.webp"\)/\1.png/' \
    | sort -u
)

if [[ ${#PNG_FILES[@]} -eq 0 ]]; then
  echo "No PNG paths found in $ASSETS_TS" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

png_total=0
webp_total=0

echo "Converting ${#PNG_FILES[@]} PNG files → $OUT_DIR"
echo ""

for file in "${PNG_FILES[@]}"; do
  in="$SRC_DIR/$file"
  base="${file%.png}"
  out="$OUT_DIR/${base}.webp"

  if [[ ! -f "$in" ]]; then
    echo "Missing source: $in" >&2
    exit 1
  fi

  quality=$QUALITY_DEFAULT
  alpha=$ALPHA_DEFAULT
  if contains_high_quality "$base"; then
    quality=$QUALITY_HIGH
    alpha=$ALPHA_HIGH
  fi

  echo "→ ${base}.webp (quality=$quality, alpha=$alpha)"
  magick "$in" \
    -quality "$quality" \
    -define "webp:alpha-quality=$alpha" \
    -define "webp:method=$WEBP_METHOD" \
    "$out"

  png_size=$(stat -f%z "$in")
  webp_size=$(stat -f%z "$out")
  png_total=$((png_total + png_size))
  webp_total=$((webp_total + webp_size))
done

echo ""
printf "PNG total:  %.2f MB\n" "$(echo "$png_total / 1048576" | bc -l)"
printf "WebP total: %.2f MB\n" "$(echo "$webp_total / 1048576" | bc -l)"
saved=$((png_total - webp_total))
printf "Saved:      %.2f MB (%.1f%%)\n" \
  "$(echo "$saved / 1048576" | bc -l)" \
  "$(echo "scale=1; 100 * $saved / $png_total" | bc -l)"
echo ""
echo "Preview files in: $OUT_DIR"
echo "Update code:      node scripts/report-preload-image-bytes.mjs"

if [[ "${1:-}" == "--install" ]]; then
  echo ""
  echo "Installing WebP files into $SRC_DIR ..."
  for file in "${PNG_FILES[@]}"; do
    base="${file%.png}"
    cp "$OUT_DIR/${base}.webp" "$SRC_DIR/${base}.webp"
  done
  echo "Done. Bump ASSETS_CACHE_VERSION and upload new .webp files to OSS."
fi
