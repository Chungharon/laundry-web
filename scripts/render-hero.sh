#!/usr/bin/env bash
# Renders the hero scene's final frame to public/hero/hero-stack.avif: the
# static first paint and LCP image that the live canvas fades in over.
# Run after changing src/components/hero/stack-scene.ts:  npm run render:hero
# Needs: firefox, avifenc, python3.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SIZE="${SIZE:-1200}"
PORT="${PORT:-4517}"
WORK="$(mktemp -d)"
trap 'kill "${SERVER:-0}" 2>/dev/null || true; rm -rf "$WORK"' EXIT

cd "$ROOT"
npx tsc src/components/hero/stack-scene.ts --target es2022 --module esnext \
  --moduleResolution bundler --skipLibCheck --outDir "$WORK/site"
cp node_modules/three/build/three.module.js node_modules/three/build/three.core.js "$WORK/site/"
cp scripts/render-hero.html "$WORK/site/index.html"

python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$WORK/site" >/dev/null 2>&1 &
SERVER=$!
for _ in $(seq 1 40); do curl -sf "http://127.0.0.1:$PORT/" >/dev/null && break; sleep 0.25; done

mkdir -p "$WORK/profile"
timeout 90 firefox --headless --no-remote --profile "$WORK/profile" \
  --window-size="$SIZE,$SIZE" --screenshot "$WORK/frame.png" "http://127.0.0.1:$PORT/" >/dev/null 2>&1

mkdir -p public/hero
# 4:4:4 with the identity matrix keeps the mist ground (--lh-mist) exact, so the
# image's edges never show against the page.
cp "$WORK/frame.png" "${KEEP_PNG:-/dev/null}" 2>/dev/null || true
avifenc --yuv 444 --cicp 1/13/0 --range full -q 70 -s 4 "$WORK/frame.png" public/hero/hero-stack.avif >/dev/null
echo "public/hero/hero-stack.avif: $(stat -c %s public/hero/hero-stack.avif) bytes (${SIZE}x${SIZE})"
