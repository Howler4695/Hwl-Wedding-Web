#!/usr/bin/env bash
#
# install-services.sh — Install systemd services for the wedding app.
# This ensures the backend and frontend restart on reboot, which matters
# especially on a smaller instance (t3.micro) that may be stopped/started.
#
# Run once on the EC2:
#   sudo bash scripts/install-services.sh
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Adjust paths in service files if the project isn't at the default location
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
echo "==> Project directory: $PROJECT_DIR"

# Copy and update service files
for svc in wedding-backend wedding-frontend; do
  src="$SCRIPT_DIR/systemd/$svc.service"
  dest="/etc/systemd/system/$svc.service"

  # Replace default path with actual project path
  sed "s|/home/ubuntu/Hwl-Wedding-Web|$PROJECT_DIR|g" "$src" > "$dest"
  echo "    Installed $dest"
done

systemctl daemon-reload
systemctl enable wedding-backend wedding-frontend
echo "==> Services enabled. They will start on boot."
echo ""
echo "    Manage with:"
echo "      sudo systemctl start wedding-backend wedding-frontend"
echo "      sudo systemctl status wedding-backend"
echo "      sudo journalctl -u wedding-backend -f"
