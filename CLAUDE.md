# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack wedding RSVP application: Next.js frontend, Go/Gin backend, PostgreSQL database, AWS Cognito auth, and a Lambda for Cognito-to-DB user sync.

## Commands

### Frontend (root directory)
- **Dev**: `yarn dev` (Next.js 16 with Turbopack)
- **Build**: `yarn build`
- **Lint**: `yarn lint` (ESLint)

### Backend (`backend/`)
- **Run**: `cd backend && go run wedding.go`
- **Build**: `cd backend && go build ./...`
- **Database**: `cd backend && docker-compose up` (PostgreSQL 17.4 on port 5432)

No test suite is configured for either frontend or backend.

## Deployment

Deployed on a single **AWS EC2 t3.micro** instance. No CI/CD — manual deploy via SSH.

### Deploy
```bash
ssh -i ~/Downloads/hwl.pem ubuntu@3.150.189.231 "bash ~/Hwl-Wedding-Web/scripts/deploy.sh dev"
```

This pulls the specified branch, rebuilds backend (Go) and frontend (Next.js), and restarts both systemd services.

### Infrastructure
- **Nginx** terminates SSL (Let's Encrypt) and reverse-proxies to Next.js (:3000) and Go (:8090)
- **Nginx config**: `/etc/nginx/conf.d/site.conf` — includes increased `proxy_buffer_size 16k` for auth cookie headers
- **Systemd services**: `wedding-frontend`, `wedding-backend` (defined in `scripts/systemd/`)
- **PostgreSQL 17** runs locally on the EC2 instance (migrated from Aurora Serverless)
- **Domain**: `thehowles.love` (frontend), `api.thehowles.love` (backend)

### Scripts (`scripts/`)
- `deploy.sh [branch]` — pull, build, restart services
- `install-services.sh` — one-time systemd service setup
- `setup-local-pg.sh` — one-time PostgreSQL installation
- `migrate-aurora-to-local.sh` — data migration from Aurora

## Architecture

### Auth Flow (end-to-end)
1. NextAuth 5 (beta) with Cognito OAuth2 provider — configured in `/auth.ts`
2. PKCE cookie uses explicit non-prefixed name to work behind nginx SSL termination
3. Auth callback route catches PKCE errors and redirects to fresh sign-in (`app/api/auth/[...nextauth]/route.ts`)
4. Middleware (`/proxy.ts`) protects routes, handles maintenance mode, and redirects on token refresh errors
5. Frontend passes `Bearer ${session.accessToken}` to the Go backend
6. Backend validates JWT against Cognito JWKS (`backend/auth/middleware.go`), extracts user ID and groups
7. Admin routes require the "Admin" Cognito group

### Frontend (Next.js App Router)
- **Pages**: `app/` — home, register, rsvp, party-builder, cant-make-it, admin/*, auth/*
- **Admin pages**: dashboard (stats overview), guest list, party detail, allergies list
- **Server Actions**: pages use server actions that call the Go backend with the Cognito access token via `helpers/Fetch.ts`
- **Styling**: Tailwind CSS 4, Framer Motion for animations
- **Fonts**: Cormorant Garamond + Quicksand (Google Fonts)
- **Helpers**: `helpers/allergies.ts` filters out "none"/"N/A" entries from allergy data

### Backend (Go/Gin)
Follows controller → service → repository layering:
- `routes/routes.go` — all route definitions, auth middleware applied globally
- `controller/` — HTTP handlers for users and parties
- `services/` — business logic (user creation with address/contact/attendance)
- `repositories/` — PostgreSQL queries via pgx/v5 connection pool
- `models/` — structs and DTOs
- `auth/` — Cognito JWKS init + JWT validation middleware
- `SQL/` — database schema/migrations

### Lambda (`lambdas/UpdateUser/`)
Cognito post-signup trigger that syncs user attributes into PostgreSQL. Connects via AWS Secrets Manager for RDS credentials.

## Key Patterns

- **API calls from frontend**: Server actions in page files → `helpers/Fetch.ts` builds GET options with auth header → `fetch(process.env.BACKEND_URL + path, options)`
- **Admin authorization**: Frontend checks `session.groups.includes("Admin")` via `helpers/Auth.ts`; backend checks groups extracted from JWT claims
- **Admin data**: Single backend endpoint `GET /admin/allpartyinfo` returns all parties with nested user/people data
- **Middleware matcher** in `proxy.ts` excludes auth endpoints, static assets, and public images from protection
