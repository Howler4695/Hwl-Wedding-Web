# HWL Wedding

Full-stack wedding RSVP application for thehowles.love.

## Tech Stack

- **Frontend**: Next.js 16 (App Router, Turbopack), Tailwind CSS 4, Framer Motion
- **Backend**: Go / Gin
- **Database**: PostgreSQL 17 (pgx/v5)
- **Auth**: AWS Cognito + NextAuth 5
- **Infrastructure**: EC2 (t3.micro), Nginx, Let's Encrypt, systemd

## Local Development

### Prerequisites
- Node.js 20+, Yarn
- Go 1.24+
- Docker (for local PostgreSQL)

### Frontend
```bash
yarn install
yarn dev
```
Runs at http://localhost:3000.

### Backend
```bash
cd backend
docker-compose up -d   # start PostgreSQL
go run wedding.go
```
Runs at http://localhost:8090.

### Environment Variables

**Frontend** (`.env.local`):
```
AUTH_SECRET=<secret>
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
AUTH_COGNITO_ID=<cognito-client-id>
AUTH_COGNITO_SECRET=<cognito-client-secret>
AUTH_COGNITO_ISSUER=<cognito-issuer-url>
BACKEND_URL=http://localhost:8090
```

**Backend** (`backend/.env`):
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=wedding
AWS_REGION=us-east-2
COGNITO_POOL_ID=<pool-id>
HOST_URL=localhost:8090
CORS_ORIGIN=http://localhost:3000
```

## Deployment

Deployed on AWS EC2 with nginx reverse proxy and Let's Encrypt SSL.

```bash
# From any machine with the SSH key:
ssh -i ~/Downloads/hwl.pem ubuntu@3.150.189.231 "bash ~/Hwl-Wedding-Web/scripts/deploy.sh dev"
```

See `scripts/` for setup and deployment scripts.

## Project Structure

```
app/                    # Next.js pages (App Router)
  admin/                # Admin dashboard, guest list, allergies
  auth/                 # Sign-in, sign-out, reauth
  (home)/               # Landing page
backend/
  controller/           # HTTP handlers
  services/             # Business logic
  repositories/         # Database queries
  models/               # Structs and DTOs
  auth/                 # JWT validation middleware
  SQL/                  # Schema and migrations
components/             # Shared React components
helpers/                # Fetch, auth, date, allergy utilities
lambdas/UpdateUser/     # Cognito post-signup Lambda
scripts/                # Deploy and infrastructure scripts
```
