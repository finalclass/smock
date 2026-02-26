#!/usr/bin/env bash
set -euo pipefail

HOST="fcmain"
REMOTE_DIR="/srv/smock"
SERVICE="smock"

echo "==> Building..."
dune build

BINARY="_build/default/bin/main.exe"
if [ ! -f "$BINARY" ]; then
  echo "ERROR: Binary not found at $BINARY"
  exit 1
fi

echo "==> Syncing files to $HOST:$REMOTE_DIR..."
ssh "$HOST" "mkdir -p $REMOTE_DIR/bin $REMOTE_DIR/data $REMOTE_DIR/static"

rsync -az --delete "$BINARY" "$HOST:$REMOTE_DIR/bin/smock"
rsync -az --delete static/ "$HOST:$REMOTE_DIR/static/"
rsync -az .env "$HOST:$REMOTE_DIR/.env"
ssh "$HOST" "grep -q PRODUCTION $REMOTE_DIR/.env || echo 'PRODUCTION=true' >> $REMOTE_DIR/.env"
rsync -az smock.service "$HOST:/etc/systemd/system/$SERVICE.service"

echo "==> Installing & restarting service..."
ssh "$HOST" "systemctl daemon-reload && systemctl enable $SERVICE && systemctl restart $SERVICE"

echo "==> Status:"
ssh "$HOST" "systemctl status $SERVICE --no-pager -l" || true

echo "==> Done!"
