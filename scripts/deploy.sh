#!/usr/bin/env bash
#
# deploy.sh — Pull latest code and restart the frontend + backend
# on the EC2 instance. Run from the project root.
#
# Usage (on the EC2):
#   bash scripts/deploy.sh [branch]
#
# Default branch: current branch.
#
set -euo pipefail

BRANCH="${1:-}"
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR"

echo "==> Pulling latest code"
if [ -n "$BRANCH" ]; then
  git fetch origin
  git checkout "$BRANCH"
  git pull origin "$BRANCH"
else
  git pull
fi

# ── Backend ─────────────────────────────────────────────
echo "==> Rebuilding backend"
cd "$PROJECT_DIR/backend"
go build -o wedding-server wedding.go

echo "==> Restarting backend"
if systemctl is-active --quiet wedding-backend 2>/dev/null; then
  sudo systemctl restart wedding-backend
  echo "    wedding-backend service restarted"
else
  # No systemd service — kill existing and relaunch
  pkill -f "wedding-server" 2>/dev/null || true
  pkill -f "go run wedding.go" 2>/dev/null || true
  nohup ./wedding-server > /tmp/wedding-backend.log 2>&1 &
  echo "    Backend started (PID $!, log: /tmp/wedding-backend.log)"
fi

# ── Frontend ────────────────────────────────────────────
echo "==> Rebuilding frontend"
cd "$PROJECT_DIR"
yarn install --frozen-lockfile
yarn build

echo "==> Restarting frontend"
if systemctl is-active --quiet wedding-frontend 2>/dev/null; then
  sudo systemctl restart wedding-frontend
  echo "    wedding-frontend service restarted"
else
  # No systemd service — kill existing and relaunch
  pkill -f "next start" 2>/dev/null || true
  nohup yarn start > /tmp/wedding-frontend.log 2>&1 &
  echo "    Frontend started (PID $!, log: /tmp/wedding-frontend.log)"
fi

echo ""
echo "==> Deploy complete. Verify:"
echo "    curl http://localhost:8090/health"
echo "    curl http://localhost:3000"
