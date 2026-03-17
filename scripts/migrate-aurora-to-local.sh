#!/usr/bin/env bash
#
# migrate-aurora-to-local.sh — Dump data from Aurora Serverless and load it
# into the local PostgreSQL instance on this EC2.
#
# Prerequisites:
#   1. Run setup-local-pg.sh first
#   2. The EC2 security group must still allow outbound to Aurora (temporarily)
#   3. pg_dump must be installed (it is after setup-local-pg.sh)
#
# Usage (on the EC2):
#   AURORA_HOST=database-1-instance-1-us-east-2c.cbue6s2qw23y.us-east-2.rds.amazonaws.com \
#   AURORA_PASS=<aurora_password> \
#   DB_PASS=<local_pg_password> \
#   bash scripts/migrate-aurora-to-local.sh
#
set -euo pipefail

# ── Aurora (source) ─────────────────────────────────────
AURORA_HOST="${AURORA_HOST:?Set AURORA_HOST}"
AURORA_PORT="${AURORA_PORT:-5432}"
AURORA_DB="${AURORA_DB:-postgres}"
AURORA_USER="${AURORA_USER:-postgres}"
AURORA_PASS="${AURORA_PASS:?Set AURORA_PASS}"

# ── Local PG (target) ──────────────────────────────────
LOCAL_DB="${LOCAL_DB:-wedding}"
LOCAL_USER="${LOCAL_USER:-wedding_app}"
LOCAL_PASS="${DB_PASS:?Set DB_PASS}"

DUMP_FILE="/tmp/aurora_dump_$(date +%Y%m%d_%H%M%S).sql"

echo "==> Dumping data from Aurora ($AURORA_HOST/$AURORA_DB)"
PGPASSWORD="$AURORA_PASS" pg_dump \
  -h "$AURORA_HOST" \
  -p "$AURORA_PORT" \
  -U "$AURORA_USER" \
  -d "$AURORA_DB" \
  --data-only \
  --no-owner \
  --no-privileges \
  --disable-triggers \
  -f "$DUMP_FILE"

echo "==> Dump saved to $DUMP_FILE ($(du -h "$DUMP_FILE" | cut -f1))"

echo "==> Loading data into local PostgreSQL ($LOCAL_DB)"
PGPASSWORD="$LOCAL_PASS" psql \
  -h 127.0.0.1 \
  -U "$LOCAL_USER" \
  -d "$LOCAL_DB" \
  -f "$DUMP_FILE"

echo "==> Verifying row counts"
PGPASSWORD="$LOCAL_PASS" psql -h 127.0.0.1 -U "$LOCAL_USER" -d "$LOCAL_DB" -c "
  SELECT 'users' AS tbl, count(*) FROM users
  UNION ALL SELECT 'contacts', count(*) FROM contacts
  UNION ALL SELECT 'addresses', count(*) FROM addresses
  UNION ALL SELECT 'party', count(*) FROM party
  UNION ALL SELECT 'party_pop', count(*) FROM party_pop;
"

echo ""
echo "==> Migration complete."
echo "    Dump file kept at: $DUMP_FILE"
echo ""
echo "    Next steps:"
echo "    1. Verify the data looks correct"
echo "    2. Update backend .env to point to local PG"
echo "    3. Update Secrets Manager secret for the Lambda"
echo "    4. Restart the backend (bash scripts/deploy.sh)"
echo "    5. Once confirmed working, delete the Aurora cluster in AWS console"
