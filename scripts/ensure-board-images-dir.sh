#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET_DIR="$ROOT_DIR/public/images/board"

mkdir -p "$TARGET_DIR"
echo "Ensured board image directory exists: $TARGET_DIR"
