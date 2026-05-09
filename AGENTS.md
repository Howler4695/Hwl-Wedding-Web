# AGENTS.md

Guidance for coding agents working in this repository.

## Project Overview

HWL Wedding is a full-stack wedding RSVP application for `thehowles.love`.

- Frontend: Next.js 16 App Router, React 19, Tailwind CSS 4, Framer Motion
- Backend: Go 1.24, Gin, pgx/v5, PostgreSQL
- Auth: NextAuth 5 beta with AWS Cognito OAuth2/JWTs
- Gallery: S3-hosted photos, with admin visibility toggles stored in S3
- Infrastructure: single AWS EC2 `t3.micro`, nginx, Let's Encrypt, systemd
- Deployment: manual SSH deploy, no CI/CD

## Commands

Run frontend commands from the repo root:

```bash
yarn dev
yarn build
yarn lint
```

Run backend commands from `backend/`:

```bash
docker-compose up -d
go run wedding.go
go build ./...
```

There is no configured test suite for the frontend or backend. For verification, use the narrowest useful checks, usually `yarn lint`, `yarn build`, and/or `cd backend && go build ./...`.

## Local Development

Frontend runs on `http://localhost:3000`; backend runs on `http://localhost:8090`.

Frontend `.env.local` commonly needs:

```bash
AUTH_SECRET=
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
AUTH_COGNITO_ID=
AUTH_COGNITO_SECRET=
AUTH_COGNITO_ISSUER=
BACKEND_URL=http://localhost:8090
```

Backend `backend/.env` is read by `backend/wedding.go`. Use these names from the code:

```bash
DB_HOST=localhost
DB_DATABASE=postgres
DB_USER=postgres
DB_PASSWORD=postgres
HOST_URL=localhost:8090
BACKEND_ORIGIN=http://localhost:3000
COGNITO_REGION=us-east-2
COGNITO_USER_POOL_ID=
COGNITO_APP_CLIENT_ID=
GIN_MODE=debug
```

For remote/Aurora-style TLS DB connections, `DB_MODE=remote` also requires `DB_ROOTCERT_LOCATION`.

## Architecture

The frontend uses the Next.js App Router under `app/`. Most data-fetching pages are server components that call `auth()` from `auth.ts`, then call the Go API with `GET_OPTIONS(session)` from `helpers/Fetch.ts`.

Important frontend paths:

- `auth.ts`: NextAuth/Cognito setup, JWT/session callbacks, access-token refresh
- `proxy.ts`: route protection, maintenance-mode redirects, reauth redirect on refresh-token errors
- `helpers/Fetch.ts`: backend fetch helpers and `Authorization: Bearer <access token>`
- `helpers/Auth.ts`: admin checks
- `helpers/allergies.ts`: filters empty allergy values for admin displays
- `app/api/gallery/route.ts`: admin-only S3 `visible.json` updates
- `app/globals.css`: Tailwind utilities, theme colors, layout helpers, aurora background styles
- `components/`: shared UI components, grouped by feature

The backend follows controller -> service -> repository layering:

- `backend/wedding.go`: env loading, pgx pool, CORS/gzip, Cognito JWKS init, health route, router startup
- `backend/routes/routes.go`: route map and auth middleware
- `backend/auth/`: Cognito JWT validation and group checks
- `backend/controller/`: HTTP handlers
- `backend/services/`: business logic helpers
- `backend/repositories/`: PostgreSQL queries
- `backend/models/`: Go structs and DTOs
- `backend/SQL/aws_schema.sql`: schema

Backend routes are authenticated globally after `/health`. Admin-only data is exposed at `GET /admin/allpartyinfo` and requires the Cognito `Admin` group.

The Lambda in `lambdas/UpdateUser/` syncs Cognito user attributes into PostgreSQL. It reads database credentials from Secrets Manager via `DB_SECRET_ARN`, uses `DB_SSL=false` to disable SSL, and upserts `users`, `contacts`, and `addresses`.

## Auth Notes

- NextAuth uses a custom PKCE cookie name, `authjs.pkce.code_verifier`, to work behind nginx SSL termination.
- Frontend protected routes are enforced in `proxy.ts`.
- Public routes currently include `/`, `/gallery`, auth pages, static assets, and selected image paths from the matcher.
- Frontend admin checks use `session.groups.includes("Admin")`.
- Backend admin checks use Cognito JWT `cognito:groups`.
- Backend JWT validation expects Cognito access tokens, not ID tokens.

## Styling and UI

- Preserve the wedding visual system: green aurora background, cream surfaces, rose/gold accents, Cormorant Garamond headings, Quicksand body text.
- Prefer existing CSS utilities from `app/globals.css` such as `card`, `card-no-blur`, `center-page`, `center-page-no-scroll`, `naked-text`, and heading utilities.
- Keep App Router pages and shared components consistent with the current Tailwind-heavy style.
- Use existing component groups before adding new patterns.
- Be careful with mobile layout. Existing pages rely on fixed nav/header spacing and custom full-height helpers.

## Data and API Shape

- Frontend types in `types/api.ts` mirror the backend JSON shape. Check Go struct JSON tags in `backend/models/` before changing API field names.
- Server components often call backend endpoints directly with `process.env.BACKEND_URL`.
- `fetchWithRetry` has a 10-second timeout and retries failed/non-ok responses.
- The gallery page reads public S3 XML for `gallery/web/*.jpg`; full-res photos are mapped to `gallery/*.png`.
- Admin gallery visibility is stored at `s3://hwl-wedding-photos/gallery/visible.json`.

## Deployment

Production is a single EC2 instance with nginx in front of Next.js and Go.

Manual deploy command from a machine with the key:

```bash
ssh -i ~/Downloads/hwl.pem ubuntu@3.150.189.231 "bash ~/Hwl-Wedding-Web/scripts/deploy.sh dev"
```

`scripts/deploy.sh [branch]` runs on the EC2 instance and:

1. Fetches/checks out/pulls the requested branch, or pulls the current branch.
2. Builds `backend/wedding-server` from `backend/wedding.go`.
3. Restarts `wedding-backend` if systemd is active; otherwise starts the binary with `nohup`.
4. Runs `yarn install --frozen-lockfile`.
5. Runs `yarn build`.
6. Restarts `wedding-frontend` if systemd is active; otherwise starts `yarn start` with `nohup`.
7. Prints local curl checks for `http://localhost:8090/health` and `http://localhost:3000`.

One-time infrastructure scripts:

- `scripts/install-services.sh`: installs `scripts/systemd/*.service` into `/etc/systemd/system`, replacing `/home/ubuntu/Hwl-Wedding-Web` with the actual repo path, then enables both services.
- `scripts/setup-local-pg.sh`: installs PostgreSQL 17, configures it for a `t3.micro`, creates `wedding`/`wedding_app`, loads `backend/SQL/aws_schema.sql`, and grants privileges.
- `scripts/migrate-aurora-to-local.sh`: dumps Aurora data and loads it into local PostgreSQL.

Systemd service details:

- `wedding-backend` runs `backend/wedding-server`, reads `backend/.env`, requires `postgresql.service`.
- `wedding-frontend` runs `yarn start`, reads `.env.production`, and starts after the backend.

Production domains:

- Frontend: `thehowles.love`
- Backend: `api.thehowles.love`

## Operational Cautions

- Do not commit secrets from `.env.local`, `.env.production`, `backend/.env`, SSH keys, or AWS credentials.
- Deployment scripts affect production EC2 state. Do not run SSH deploys or one-time setup scripts unless explicitly asked.
- `setup-local-pg.sh` and `migrate-aurora-to-local.sh` are production-data/infrastructure scripts; review env vars before use.
- There are spelling-sensitive existing routes/env vars such as `/maintence` and `MAINTENCE_MODE`; do not rename them casually.
- `next.config.ts` uses `output: "standalone"` and allows images from `hwl-wedding-photos.s3.us-east-2.amazonaws.com`.
- The app currently has no automated tests, so build/lint checks matter before deploying.

## Working Conventions

- Keep changes scoped to the requested feature or fix.
- Prefer existing helpers, components, and route patterns over new abstractions.
- Use `rg` for searching.
- Use `yarn` rather than npm for the root frontend.
- Keep Go code formatted with `gofmt`.
- Keep TypeScript strict-mode compatible.
- Preserve user-facing copy and wedding-specific details unless the task asks to change them.
- When touching auth, deployment, DB schema, or admin endpoints, verify both frontend and backend assumptions.
- When changing user fields or schema, check the Cognito sync Lambda too.
