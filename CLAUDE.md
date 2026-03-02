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

## Architecture

### Auth Flow (end-to-end)
1. NextAuth 5 (beta) with Cognito OAuth2 provider — configured in `/auth.ts`
2. Middleware (`/proxy.ts`) protects routes, handles maintenance mode, and redirects on token refresh errors
3. Frontend passes `Bearer ${session.accessToken}` to the Go backend
4. Backend validates JWT against Cognito JWKS (`backend/auth/middleware.go`), extracts user ID and groups
5. Admin routes require the "Admin" Cognito group

### Frontend (Next.js App Router)
- **Pages**: `app/` — home, register, rsvp, party-builder, cant-make-it, admin/*, auth/*
- **Server Actions**: pages use server actions that call the Go backend with the Cognito access token via `helpers/Fetch.ts`
- **Styling**: Tailwind CSS 4, Framer Motion for animations
- **Fonts**: Cormorant Garamond + Quicksand (Google Fonts)

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
- **Middleware matcher** in `proxy.ts` excludes auth endpoints, static assets, and public images from protection
