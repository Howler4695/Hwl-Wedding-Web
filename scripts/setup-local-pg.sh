#!/usr/bin/env bash
#
# setup-local-pg.sh — Install PostgreSQL 17 on Ubuntu EC2 and configure it
# for the HWL Wedding app (replaces Aurora Serverless).
#
# Run ON the EC2 instance as root or with sudo:
#   sudo bash scripts/setup-local-pg.sh
#
set -euo pipefail

# ── Config ──────────────────────────────────────────────
PG_VERSION=17
DB_NAME="wedding"
DB_USER="wedding_app"
DB_PASS="${DB_PASS:?Set DB_PASS env var before running (e.g. DB_PASS=mySecurePass sudo bash scripts/setup-local-pg.sh)}"

# VPC CIDR — allows Lambda (same VPC) to connect.
# Default VPC in us-east-2 is 172.31.0.0/16. Adjust if yours differs.
VPC_CIDR="${VPC_CIDR:-172.31.0.0/16}"

echo "==> Installing PostgreSQL $PG_VERSION"
# Add the official PostgreSQL APT repo
apt-get update -qq
apt-get install -y -qq curl ca-certificates gnupg lsb-release

curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | \
  gpg --dearmor -o /usr/share/keyrings/pgdg.gpg

echo "deb [signed-by=/usr/share/keyrings/pgdg.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" \
  > /etc/apt/sources.list.d/pgdg.list

apt-get update -qq
apt-get install -y -qq "postgresql-$PG_VERSION"

echo "==> Configuring PostgreSQL"
PG_CONF="/etc/postgresql/$PG_VERSION/main/postgresql.conf"
PG_HBA="/etc/postgresql/$PG_VERSION/main/pg_hba.conf"

# Listen on all interfaces (needed for Lambda connections from VPC)
sed -i "s/^#\?listen_addresses\s*=.*/listen_addresses = '*'/" "$PG_CONF"

# Tune for t3.micro (1 GB RAM) — conservative settings
sed -i "s/^#\?shared_buffers\s*=.*/shared_buffers = 128MB/" "$PG_CONF"
sed -i "s/^#\?effective_cache_size\s*=.*/effective_cache_size = 512MB/" "$PG_CONF"
sed -i "s/^#\?work_mem\s*=.*/work_mem = 4MB/" "$PG_CONF"
sed -i "s/^#\?maintenance_work_mem\s*=.*/maintenance_work_mem = 64MB/" "$PG_CONF"
sed -i "s/^#\?max_connections\s*=.*/max_connections = 50/" "$PG_CONF"

# Allow local app (backend on same machine) via peer/md5
# Allow VPC connections (Lambda) via md5
if ! grep -q "$VPC_CIDR" "$PG_HBA"; then
  echo "" >> "$PG_HBA"
  echo "# HWL Wedding — local backend" >> "$PG_HBA"
  echo "host    $DB_NAME    $DB_USER    127.0.0.1/32    md5" >> "$PG_HBA"
  echo "# HWL Wedding — Lambda (same VPC)" >> "$PG_HBA"
  echo "host    $DB_NAME    $DB_USER    $VPC_CIDR       md5" >> "$PG_HBA"
fi

systemctl restart postgresql
systemctl enable postgresql

echo "==> Creating database and user"
sudo -u postgres psql <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
    CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASS';
  ELSE
    ALTER ROLE $DB_USER WITH PASSWORD '$DB_PASS';
  END IF;
END
\$\$;

CREATE DATABASE $DB_NAME OWNER $DB_USER;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
SQL

echo "==> Loading schema"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SCHEMA="$SCRIPT_DIR/../backend/SQL/aws_schema.sql"

if [ -f "$SCHEMA" ]; then
  sudo -u postgres psql -d "$DB_NAME" -f "$SCHEMA"
  # Grant ownership of all tables to the app user
  sudo -u postgres psql -d "$DB_NAME" -c "
    GRANT ALL ON ALL TABLES IN SCHEMA public TO $DB_USER;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;
  "
  echo "==> Schema loaded successfully"
else
  echo "WARNING: Schema file not found at $SCHEMA — load it manually."
fi

echo ""
echo "==> PostgreSQL $PG_VERSION is ready."
echo "    Database: $DB_NAME"
echo "    User:     $DB_USER"
echo "    Host:     localhost:5432"
echo ""
echo "    Backend .env should have:"
echo "      DB_HOST=localhost"
echo "      DB_DATABASE=$DB_NAME"
echo "      DB_USER=$DB_USER"
echo "      DB_PASSWORD=$DB_PASS"
echo "      (remove DB_MODE=remote or leave it unset)"
echo ""
echo "    For the Lambda, update the Secrets Manager secret to:"
echo "      host: <EC2 private IP>  (check with: hostname -I)"
echo "      port: 5432"
echo "      dbname: $DB_NAME"
echo "      username: $DB_USER"
echo "      password: $DB_PASS"
echo ""
echo "    IMPORTANT: Your EC2 security group must allow inbound TCP 5432"
echo "    from the VPC CIDR ($VPC_CIDR) for the Lambda to connect."
