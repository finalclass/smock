#!/usr/bin/env bash
# @axiom: infrastructure.md#skrypt-deploy
set -euo pipefail

REMOTE_DIR="/opt/smock"
SERVICE="smock"

echo "==> Building release..."
well release

ARCHIVE=$(ls -t *.tar.gz 2>/dev/null | head -1)
if [ -z "$ARCHIVE" ]; then
  echo "ERROR: No .tar.gz archive found after well release"
  exit 1
fi

echo "==> Extracting..."
mkdir -p "$REMOTE_DIR"
tar -xzf "$ARCHIVE" -C "$REMOTE_DIR"

echo "==> Restarting service..."
systemctl restart "$SERVICE"

echo "==> Status:"
systemctl status "$SERVICE" --no-pager -l || true

echo "==> Done!"
# /@axiom: infrastructure.md#skrypt-deploy
