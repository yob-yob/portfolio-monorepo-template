# City OS

A production-oriented **multi-tenant SaaS starter** built as a Bun monorepo. City OS integrates authentication, organization management, file storage, and a typed full-stack API so new SaaS products can start from a solid foundation instead of from scratch.

> **Note:** This repository is primarily an educational and reference project for studying modern tooling and patterns. It is intended as a reusable base template for future multi-tenant applications.

> **FYI:** Project is mostly written by Hand... the only time AI has helped me is on the UI design and improvements and project documentation and commit messages... other than that the AI is ALWAYS in `ASK` mode

---

## Overview

City OS demonstrates end-to-end integration of a modern TypeScript stack: a SvelteKit frontend, an Elysia backend, Better Auth for identity and tenancy, Drizzle ORM for PostgreSQL, and S3-compatible storage with presigned uploads. The application is organized around **organizations and teams**, with context-aware layouts that separate guest, onboarding, and authenticated experiences.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Runtime & package manager | [Bun](https://bun.sh) |
| Frontend | [SvelteKit](https://kit.svelte.dev) (Svelte 5), [Tailwind CSS v4](https://tailwindcss.com), [shadcn-svelte](https://shadcn-svelte.com) |
| Backend | [Elysia](https://elysiajs.com) |
| Authentication | [Better Auth](https://www.better-auth.com) (organization plugin, email OTP, Redis session storage) |
| Database | [PostgreSQL](https://www.postgresql.org) + [Drizzle ORM](https://orm.drizzle.team) |
| Email | [Nodemailer](https://nodemailer.com) (SMTP) |
| Storage | S3-compatible object storage via Bun's native S3 client |
| API client | [Eden Treaty](https://elysiajs.com/eden/overview) (end-to-end type safety) |
| Linting & formatting | [Biome](https://biomejs.dev) via [Ultracite](https://ultracite.dev) |

---

## Project Structure

```
city-os/
├── apps/
│   ├── backend/          # Elysia API server (auth, storage, setup, health)
│   └── frontend/         # SvelteKit web application
└── packages/
    ├── auth/             # Better Auth server & client configuration
    ├── database/         # Drizzle schema, migrations, and DB client
    └── mailer/           # SMTP transporter for transactional email
```

---

## Features

### Authentication & Session Management

- Email and password sign-in and sign-out
- Session management with Redis-backed secondary storage and cookie caching
- Forgot-password flow
- First-run **installation wizard** that creates the initial super-admin account when no users exist
- **Onboarding flow** for newly registered users
- Secure **email change** with OTP verification (current email must be verified; OTP stored hashed)
- **Session manager** — view active sessions, identify device/browser, and revoke individual sessions
- Connected accounts UI (OAuth providers not yet enabled)
- Account retention policy page (self-service deletion intentionally disabled pending business rules)

### Multi-Tenant Organizations & Teams

- **Organization switcher** in the application shell
- **Team switcher** with active team context on the session
- Organization selection screen for users with multiple memberships
- Organization settings — **General**
  - Logo upload (S3 presigned URL flow)
  - Organization name update
  - URL slug update
  - Ownership transfer
- Organization settings — **Teams**
  - List all teams in the organization
  - Create and delete teams (with duplicate-name validation)
  - Join, leave, and switch active team
  - Custom team fields: description, color, and creator tracking
- Organization settings — **Members** *(work in progress)*
- Organization settings — **Billing** *(work in progress)*
- Organization settings — **RBAC** *(work in progress)*

### User Profile

- Avatar and display name updates
- Password change
- Email change with SMTP-delivered OTP
- Session list and revocation
- Connected accounts overview
- Organization membership manager

### Backend API

- **Health check** endpoint (`/api/v1`)
- **Setup** endpoints — detect first-run state and complete initial admin registration
- **Onboarding** endpoints — guide new user registration
- **Storage service**
  - Presigned PUT URLs for direct client-side uploads to S3
  - Public file serving via `/storage` with path-based access
  - MIME type validation and versioned URL support
- **OpenAPI documentation** merged with Better Auth's generated schema
- **CORS** enabled for cross-origin frontend development

### Frontend Architecture

- Route groups with dedicated layouts:
  - `(guest)` — login, install, and unauthenticated pages
  - `(screening)` — onboarding and organization selection
  - `(app)` — authenticated application with organization context
- Organization-scoped routing via `[organizationSlug]`
- Breadcrumb navigation composable for settings pages
- Dark mode toggle
- Type-safe backend communication through Eden Treaty

### Developer Experience

- Bun workspaces monorepo with shared packages
- Strict TypeScript across frontend, backend, and packages
- Biome / Ultracite linting and formatting with Husky pre-commit hooks
- Drizzle migrations and Better Auth schema generation scripts
- Compile-ready backend build target (`bun build --compile`)

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (latest)
- PostgreSQL
- Redis (used for Better Auth secondary session storage)
- S3-compatible object storage
- SMTP server (for email OTP and verification)

### Environment Variables

Copy and configure environment variables for the backend. See `apps/backend/.env.example` for the baseline:

| Variable | Description |
| --- | --- |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth |
| `DATABASE_URL` | PostgreSQL connection string |
| `S3_*` | S3 access credentials, endpoint, region, and bucket |
| `SMTP_SERVER_HOST` / `SMTP_SERVER_PORT` | Mail server configuration |
| `SMTP_USERNAME` / `SMTP_PASSWORD` | SMTP credentials |
| `DOMAIN` | Application domain (required in production) |
| `APP_URL` | Public URL used when generating storage paths |

The frontend expects `VITE_PUBLIC_API_URL` (SvelteKit public env) pointing at the backend, e.g. `http://localhost:3000`.

### Install & Run

```bash
# Install dependencies
bun install

# Run database migrations
bun run db:migrate

# Start all workspaces in development mode
bun run dev
```

The backend listens on **port 3000**. The SvelteKit dev server proxies `/api` requests to the backend.

### Useful Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start frontend and backend in parallel |
| `bun run build` | Build all workspaces |
| `bun run db:generate:migrations` | Generate Drizzle migrations |
| `bun run db:migrate` | Apply database migrations |
| `bun run auth:schema:generate` | Regenerate Better Auth Drizzle schema |
| `bun run lint:check` | Run Ultracite / Biome checks |
| `bun run lint:fix` | Auto-fix lint and format issues |

---

## Roadmap

- **Super-admin platform dashboard**
  - View all organizations and users across the platform
  - User banning via Better Auth admin capabilities
- **Organization billing**
  - BTCPay Server integration via a custom Better Auth plugin
  - Tie billing to organization subscriptions
- **Member management** — invitations, roles, and removal flows
- **RBAC** — custom roles and permission enforcement per organization
- **OAuth providers** — enable social sign-in for connected accounts

---

## License

This project is for educational and reference purposes. Use it as a starting point for learning or as a foundation for your own multi-tenant SaaS applications.
