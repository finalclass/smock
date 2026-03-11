#!/usr/bin/env bash
# @axiom: infrastructure.md#skrypt-deploy
set -euo pipefail

HOST="fcmain"
REMOTE_DIR="/opt/smock"
SERVICE="smock"

echo "==> Building release..."
well release

ARCHIVE=$(ls -t *.tar.gz 2>/dev/null | head -1)
if [ -z "$ARCHIVE" ]; then
  echo "ERROR: No .tar.gz archive found after well release"
  exit 1
fi

echo "==> Uploading $ARCHIVE to $HOST..."
scp "$ARCHIVE" "$HOST:/tmp/$ARCHIVE"

echo "==> Extracting on server..."
ssh "$HOST" "mkdir -p $REMOTE_DIR && tar -xzf /tmp/$ARCHIVE -C $REMOTE_DIR && rm /tmp/$ARCHIVE"

echo "==> Syncing config..."
if [ -f .env ]; then
  rsync -az .env "$HOST:$REMOTE_DIR/.env"
else
  echo "    (no local .env, keeping server config)"
fi
rsync -az smock.service "$HOST:/etc/systemd/system/$SERVICE.service"

echo "==> Installing & restarting service..."
ssh "$HOST" "systemctl daemon-reload && systemctl enable $SERVICE && systemctl restart $SERVICE"

echo "==> Status:"
ssh "$HOST" "systemctl status $SERVICE --no-pager -l" || true

echo "==> Done!"
# /@axiom: infrastructure.md#skrypt-deploy
