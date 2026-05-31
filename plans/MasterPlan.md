# MASTER PLAN — City Asset Registry System

> **Version 4.0** — Bun `randomUUIDv7`, structured documentation-first flow, auth-protected Swagger UI, commit and code hygiene rules.

---

## Important Context

This project is inspired by COA audit findings where an LGU's PPE balance was considered unreliable because:
- Complete physical count was not conducted
- Old asset balances were carried forward without itemized physical verification
- Completed projects funded by national government agencies were not recognized as PPE
- Some assets were misclassified
- Depreciation was not always started when assets became available for use
- Inventory and accounting records were not reconciled
- Prior recommendations were not fully implemented

The system must be designed around:
- Reliable asset records
- Evidence-based physical count
- Accountability and audit trails
- Reconciliation between physical records and accounting records
- Document management
- Role-based workflows
- Department-based access control

---

## Scope: Single-Tenant System

**This system is single-tenant.** One LGU uses this system. There is no multi-tenancy, no organization switcher.

Within the LGU, users are grouped by **Departments** (e.g., Office of the Mayor, Office of the City Treasury). Departments are the grouping unit for users, asset ownership, and accountability.

---

# Technology Stack

The project was created using:

```bash
vp create svelte
```

This scaffolded a SvelteKit application managed by VitePlus. **All toolchain commands use the `vp` CLI.** Do not use raw `bun`, `npm`, or `pnpm` commands directly.

## Full Stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit |
| Toolchain | **VitePlus (`vp`)** — unified CLI for install, dev, check, test, run, build |
| Runtime | Node.js (managed by `vp env`, which is **ON**) |
| Package Management | `vp install` / `vp add` / `vp remove` |
| Language | TypeScript (strict) |
| Auth | BetterAuth (email/password only, invite-only) |
| Database | PostgreSQL (primary) + ClickHouse (append-only audit logs) |
| ORM | Drizzle ORM |
| Migrations | Drizzle Kit |
| ID Strategy | **`Bun.randomUUIDv7()` — zero dependency, built into Bun runtime** |
| Seeding | **`drizzle-seed`** official package |
| API Layer | **ElysiaJS** integrated directly into SvelteKit |
| API Versioning | All routes prefixed `/api/v1/` |
| API Docs | `@elysia/openapi` — Swagger UI at `/swagger` (auth-protected) |
| Observability | `@elysia/opentelemetry` — distributed tracing |
| Frontend Type Safety | **Eden Treaty** (`@elysiajs/eden`) |
| Validation | **TypeBox / `Elysia.t`** — do NOT use Valibot or Zod |
| DB → Validation Bridge | `drizzle-typebox` converts Drizzle schemas to TypeBox/Elysia.t models |
| Search | Typesense |
| Document Management | PaperlessNGX (all non-image documents) |
| Image Storage | S3-compatible (images only) |
| Image Serving | ImgProxy (never raw S3 URLs) |
| UI Components | shadcn-svelte |
| Styling | Tailwind CSS |
| Forms | SvelteKit Superforms |
| CI/CD | GitLab CI/CD (using `vp` commands) |
| Deployment | Docker |
| Logging | Grafana Alloy + Loki + Grafana Dashboard |
| Rate Limiting / Caching | Redis |
| Config | Single `.env` file |

---

# CRITICAL: Project Bootstrap Order

Before any implementation begins, the AI agent or developer **must** complete the following steps in order. **Do not write application code until steps 1 and 2 are complete.**

```
Step 1 → Create RULES documents (commit discipline, code hygiene, pre-commit checks)
Step 2 → Create DOCUMENTATION files (tech stack, architecture, validation pattern,
          required packages, RBAC roles/permissions)
Step 3 → Create individual PLAN files (one per system module)
Step 4 → Begin implementation, Phase by Phase
```

This order exists so that any AI agent picking up this project mid-way has the rules and context it needs without having to infer them from code.

---

# Required Output — Full File Structure

When the AI agent begins, it creates files in this exact order:

## Part A: RULES (create first, before anything else)

```
/rules
  COMMIT_DISCIPLINE.md
  CODE_HYGIENE.md
  PRE_COMMIT_CHECKLIST.md
  TESTING_STANDARDS.md
```

## Part B: DOCUMENTATION (create second)

```
/docs
  TECH_STACK.md
  ARCHITECTURE.md
  VALIDATION_PATTERN.md
  REQUIRED_PACKAGES.md
  RBAC_ROLES_AND_PERMISSIONS.md
  API_CONVENTIONS.md
  DATABASE_CONVENTIONS.md
  user-guide.md
  admin-guide.md
  glossary.md
```

## Part C: PLANS (create third, after rules and docs are done)

```
/plans
  00-project-overview.md
  01-viteplus-toolchain.md
  02-environment-and-configuration.md
  03-architecture.md
  04-authentication-and-invitations.md
  05-session-management.md
  06-authorization-rbac.md
  07-departments-and-membership.md
  08-database-schema-plan.md
  09-uuid-strategy.md
  10-asset-domain-model.md
  11-document-storage-paperless-ngx.md
  12-image-storage-s3-imgproxy.md
  13-api-design-elysia.md
  14-swagger-ui.md
  15-typebox-validation-strategy.md
  16-two-step-validation-pattern.md
  17-ui-design-system.md
  18-pages-and-crud-flows.md
  19-forms-validation-and-api-calls.md
  20-draft-save-strategy.md
  21-physical-inventory-workflow.md
  22-project-to-asset-conversion.md
  23-reconciliation-engine.md
  24-coa-findings-and-action-plan-tracker.md
  25-reporting-and-exports.md
  26-audit-logs-clickhouse.md
  27-search-typesense.md
  28-caching-strategy.md
  29-qr-code-strategy.md
  30-dashboard-design.md
  31-http-headers-and-csp.md
  32-rate-limiting.md
  33-testing-strategy.md
  34-gitlab-cicd.md
  35-docker-deployment.md
  36-security-and-data-protection.md
  37-monitoring-loki-grafana.md
  38-seed-data-strategy.md
  39-implementation-roadmap.md
  40-known-limitations-and-future-work.md
```

## Additional root files

```
README.md
.env.example
```

---

# RULES — Content Specification

Each rules file must be written before the first line of application code.

---

## `/rules/COMMIT_DISCIPLINE.md`

### Purpose
Enforces small, atomic, feature-scoped commits so that the project history is readable, reviewable, and rollback-safe.

### Rules

**Every commit must represent the smallest meaningful unit of work that leaves the codebase in a working state.**

One commit per:
- Installed and configured package
- Database schema table or migration
- API endpoint or tightly related group
- UI page or standalone component
- Discrete feature (login, logout, invite, RBAC setup, etc.)

Never mix unrelated concerns in a single commit.

### Good commit examples

```
feat: install and configure tailwindcss
feat: install shadcn-svelte and add login-03 component
feat: install drizzle-orm and configure postgres client
feat: create id utility using Bun.randomUUIDv7
feat: create departments database schema
feat: create assets database schema
feat: add GET /api/v1/assets list endpoint with pagination
feat: add POST /api/v1/assets create endpoint
feat: add asset creation form with typebox validation
feat: add asset creation form draft auto-save
feat: implement RBAC permission check middleware
feat: add login page
feat: add forgot password page
feat: implement user invite flow
feat: implement session expiry on user deactivation
feat: add dashboard summary cards
feat: add dashboard asset map (leaflet + openstreetmap)
fix: handle 422 validation errors on asset create form
fix: correct pagination offset calculation on assets list
chore: pin @sinclair/typebox version in package.json overrides
docs: update README with local dev setup instructions
```

### Bad commit examples — NEVER do this

```
feat: implement auth, assets, dashboard, and reports  ← too many things
feat: various fixes                                   ← not descriptive
wip                                                   ← incomplete and meaningless
update files                                          ← useless
fixed stuff                                           ← no context
```

### Commit message format

Follow Conventional Commits:

```
<type>(<optional scope>): <short description>

Types: feat | fix | chore | docs | refactor | test | style | ci | perf
```

---

## `/rules/CODE_HYGIENE.md`

### Purpose
Defines code quality standards that all contributors (human and AI) must follow.

### Rules

**TypeScript**
- Strict mode is always on (`"strict": true` in `tsconfig.json`)
- No `any` types — use `unknown` and narrow it, or define a proper type
- No `@ts-ignore` — fix the actual type error
- Prefer `type` over `interface` unless extending is needed
- All exported functions must have explicit return types

**Imports**
- Use absolute imports via path aliases (`$lib/...`, `$db/...`) — never `../../../`
- Group imports: external packages first, then internal, then types
- No unused imports — `vp check` will catch these

**File naming**
- Kebab-case for all files: `asset-categories.ts`, `physical-count.svelte`
- Drizzle schema files: `<table-name>.ts` inside `src/db/schema/`
- TypeBox schema files: `<table-name>.typebox.ts` inside `src/db/typebox/`
- Test files: `<name>.test.ts` co-located with the file they test or in `__tests__/`

**Functions**
- One responsibility per function
- Functions longer than 40 lines should be split
- No deeply nested callbacks — use `async/await`
- All async functions must have proper error handling

**Constants**
- No magic numbers or strings — define named constants in a shared constants file
- Environment variables are always read through a validated config module, never `process.env.X` inline

**Comments**
- Write comments for *why*, not *what* — the code explains what
- Do not leave TODO comments without a linked issue or context
- No commented-out dead code — delete it, git has history

**Formatting**
- `vp check --fix` handles formatting automatically via Oxfmt
- Never manually adjust spacing, indentation, or trailing commas — let the formatter do it

---

## `/rules/PRE_COMMIT_CHECKLIST.md`

### Purpose
Defines what must pass before any commit is pushed. This applies equally to human developers and AI agents producing code.

### Mandatory pre-commit steps

Run these commands before every commit, in this order:

```bash
# 1. Format, lint, and type-check in one pass
vp check

# 2. Run the full test suite
vp test

# 3. If both pass, commit
git add <files>
git commit -m "feat: <description>"
```

**A commit must never be made if `vp check` or `vp test` fails.**

If a test or check is failing:
1. Fix the issue first
2. Re-run `vp check` and `vp test`
3. Only commit once both pass

### What `vp check` catches
- Formatting inconsistencies (Oxfmt)
- Lint errors (Oxlint — 600+ ESLint-compatible rules)
- TypeScript type errors (tsgolint)

### What `vp test` catches
- Regressions in existing functionality
- Broken API contracts
- Failed validation schema tests
- Failed RBAC enforcement tests

### Optional pre-commit automation

To run these automatically before every `git commit`, install a commit hook:

```bash
# Using VitePlus commit hooks (see vp docs on commit-hooks)
# Or manually add to .git/hooks/pre-commit:

#!/bin/sh
vp check && vp test
```

If the hook fails, the commit is aborted automatically.

---

## `/rules/TESTING_STANDARDS.md`

### Purpose
Defines how tests are written, organized, and run in this project.

### Test runner

All tests use **`vp test`** (Vitest under the hood). Do not use `bun test`.

```bash
vp test                   # Run all tests once
vp test watch             # Watch mode during development
vp test run --coverage    # With coverage report
```

### Test file location

- Unit tests for a module: `src/<module>/<file>.test.ts`
- Integration tests for an API: `src/api/<route>/<route>.test.ts`
- E2E tests: `tests/e2e/<workflow>.test.ts` (Playwright)

### Test naming

```ts
describe('Asset API', () => {
  describe('POST /api/v1/assets', () => {
    it('creates an asset with valid data', async () => { ... })
    it('returns 422 when required fields are missing', async () => { ... })
    it('returns 403 when user lacks asset:create permission', async () => { ... })
    it('returns 404 when department ID does not exist', async () => { ... })
  })
})
```

### Rules
- Every API endpoint must have tests for: success, validation error (422), auth error (401), RBAC error (403), and not-found (404) where applicable
- RBAC permission checks must have dedicated unit tests
- Do not test implementation details — test behavior and outcomes
- Tests must be independent — no shared mutable state between tests
- Use `drizzle-seed` to seed the test database before test runs

---

# DOCUMENTATION — Content Specification

Each documentation file must be complete and accurate before implementation begins.

---

## `/docs/TECH_STACK.md`

Must document every technology in the stack with:
- What it is
- Why it was chosen
- Version being used
- Official documentation link
- How it integrates with other parts of the stack
- Any known gotchas or constraints

Must explicitly state what is **NOT** used and why:
- ❌ Valibot — replaced by TypeBox/Elysia.t
- ❌ Zod — replaced by TypeBox/Elysia.t
- ❌ `uuidv7` npm package — replaced by `Bun.randomUUIDv7()`
- ❌ XLSX uploads — CSV only
- ❌ Raw S3 signed URLs for serving — replaced by ImgProxy
- ❌ Separate Elysia service — integrated into SvelteKit

---

## `/docs/ARCHITECTURE.md`

Must document:
- System overview diagram (text-based ASCII is fine)
- How SvelteKit and Elysia are integrated
- How BetterAuth mounts into Elysia
- How Eden Treaty connects the frontend to the Elysia API
- How PaperlessNGX and S3/ImgProxy split file storage
- How ClickHouse handles audit logs separately from PostgreSQL
- How Typesense syncs with PostgreSQL
- How Grafana Alloy ingests app log files
- The single-tenant model and department-based scoping

---

## `/docs/VALIDATION_PATTERN.md`

Must document the **two-step validation pattern** in full detail.

### Overview

All validation in this system follows a two-step pattern:

**Step 1 — Format Validation (automatic, handled by Elysia + TypeBox)**
- Validates field types, presence, length, format (UUID, email, etc.)
- Returns HTTP 422 automatically if the input fails
- Defined in the Elysia route's `body`, `query`, or `params` TypeBox schema
- No code needed in the handler for this step

**Step 2 — Business Logic Validation (manual, written in the handler)**
- Validates things that require a database query or business rule
- Returns HTTP 400, 403, 404, or 409 as appropriate
- Written explicitly in the route handler after Step 1 has passed

### Schema sources

TypeBox schemas used for Step 1 come from two places:

1. **`drizzle-typebox`** — auto-generated from Drizzle schema tables
   ```ts
   import { createInsertSchema, createSelectSchema } from 'drizzle-typebox'
   import { assets } from '../schema/assets'

   export const insertAssetSchema = createInsertSchema(assets)
   export const selectAssetSchema = createSelectSchema(assets)
   ```

2. **`Elysia.t` directly** — for query params, path params, or custom request shapes
   ```ts
   import { t } from 'elysia'

   const paginationSchema = t.Object({
     page: t.Optional(t.Number({ minimum: 1, default: 1 })),
     limit: t.Optional(t.Number({ minimum: 1, maximum: 100, default: 25 })),
   })
   ```

### Full route example

```ts
import { Elysia, t } from 'elysia'
import { eq } from 'drizzle-orm'
import { db } from '$db'
import { assets, departments } from '$db/schema'
import { insertAssetSchema } from '$db/typebox/assets.typebox'

const assetRoutes = new Elysia({ prefix: '/api/v1/assets' })
  .post('/', async ({ body, error, store }) => {
    // Step 1 already completed by Elysia — body shape is guaranteed valid here

    // Step 2a: Business logic — does the department exist?
    const dept = await db.query.departments.findFirst({
      where: eq(departments.id, body.departmentId)
    })
    if (!dept) return error(404, { message: 'Department not found' })

    // Step 2b: Business logic — is this asset number already taken?
    const existing = await db.query.assets.findFirst({
      where: eq(assets.assetNumber, body.assetNumber)
    })
    if (existing) return error(409, { message: 'Asset number already in use' })

    // Proceed
    const [asset] = await db.insert(assets).values({
      ...body,
      id: generateId(),
    }).returning()

    return asset
  }, {
    body: insertAssetSchema,
  })
```

---

## `/docs/REQUIRED_PACKAGES.md`

Must be a complete, categorized list of all packages in the project.

Format:

```markdown
## Runtime Dependencies

| Package | Version | Purpose | Install Command |
|---|---|---|---|
| elysia | latest | API framework integrated with SvelteKit | vp add elysia |
| @elysia/openapi | latest | OpenAPI/Swagger doc generation | vp add @elysia/openapi |
| @elysia/opentelemetry | latest | Distributed tracing | vp add @elysia/opentelemetry |
| @elysiajs/eden | latest | Frontend type-safe API client | vp add @elysiajs/eden |
| better-auth | latest | Authentication | vp add better-auth |
| drizzle-orm | latest | ORM | vp add drizzle-orm |
| drizzle-typebox | latest | Drizzle → TypeBox schema bridge | vp add drizzle-typebox |
| @sinclair/typebox | pinned | TypeBox (pin version to match Elysia) | see pinning note |
| postgres | latest | PostgreSQL client for Drizzle | vp add postgres |
| @clickhouse/client | latest | ClickHouse client for audit logs | vp add @clickhouse/client |
| typesense | latest | Search client | vp add typesense |
| ...

## Dev Dependencies

| Package | Version | Purpose | Install Command |
|---|---|---|---|
| drizzle-kit | latest | Migration generator | vp add -D drizzle-kit |
| drizzle-seed | latest | Database seeding | vp add -D drizzle-seed |
| vitest | (via vp) | Testing — do not install separately | included in vp |
| playwright | latest | E2E testing | vp add -D playwright |
| ...

## NOT installed (and why)

| Package | Reason NOT installed |
|---|---|
| uuidv7 | Replaced by Bun.randomUUIDv7() — zero cost, no dependency |
| valibot | Replaced by TypeBox/Elysia.t |
| zod | Replaced by TypeBox/Elysia.t |
| uuid | Replaced by Bun.randomUUIDv7() |
```

---

## `/docs/RBAC_ROLES_AND_PERMISSIONS.md`

Must be a complete, definitive reference for all roles and permissions in the system.

### Roles

| Role ID | Role Name | Description |
|---|---|---|
| `super_admin` | Super Admin | Full access to everything. No restrictions. |
| `system_admin` | System Admin | Can manage users, roles, departments. Cannot delete audit logs. |
| `mayor` | Mayor / Executive Viewer | Read-only across all modules. |
| `city_accountant` | City Accountant | Full access to reconciliation, COA findings, accounting adjustments. |
| `gso_officer` | GSO Officer | Asset CRUD, physical inventory, document management. |
| `engineering_officer` | Engineering Officer | Project creation and conversion, technical validation. |
| `treasurer` | Treasurer | Read access to assets, documents, and financial reports. |
| `department_head` | Department Head | Full access within their department's assets and documents. |
| `inventory_team` | Inventory Team Member | Physical count and inventory operations. |
| `auditor` | Auditor / Read-only | Read-only access across all modules. No writes. |
| `document_manager` | Document Manager | Upload, manage, and delete documents across all departments. |

### Permissions

| Permission Key | Description |
|---|---|
| `asset:create` | Create a new asset record |
| `asset:read` | View asset records |
| `asset:update` | Edit existing asset records |
| `asset:delete` | Soft-delete an asset record |
| `asset:verify` | Mark an asset as physically verified |
| `asset:transfer` | Transfer an asset to another department/office |
| `asset:dispose` | Mark an asset for disposal or as disposed |
| `project:create` | Create a new project record |
| `project:update` | Edit a project record |
| `project:convert_to_asset` | Convert a completed project into a PPE asset record |
| `inventory:create_campaign` | Create a physical inventory campaign |
| `inventory:perform_count` | Perform physical count entries |
| `reconciliation:review` | View reconciliation issues |
| `reconciliation:resolve` | Resolve or close reconciliation issues |
| `documents:upload` | Upload documents to PaperlessNGX |
| `documents:delete` | Delete documents from PaperlessNGX |
| `reports:view` | View reports |
| `reports:export` | Export reports to CSV or PDF |
| `coa_finding:create` | Create a new COA finding record |
| `coa_finding:update` | Update a COA finding or action plan |
| `admin:invite_user` | Invite a new user by email |
| `admin:manage_roles` | Assign or change user roles |
| `admin:manage_departments` | Create, update, or deactivate departments |
| `admin:deactivate_user` | Deactivate a user account |

### Role → Permission Matrix

| Permission | super_admin | system_admin | mayor | city_accountant | gso_officer | engineering_officer | treasurer | dept_head | inventory_team | auditor | document_manager |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| `asset:create` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `asset:read` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `asset:update` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `asset:delete` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `asset:verify` | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `asset:transfer` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `asset:dispose` | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `project:create` | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `project:update` | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `project:convert_to_asset` | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `inventory:create_campaign` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `inventory:perform_count` | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `reconciliation:review` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| `reconciliation:resolve` | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `documents:upload` | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ❌ | ✅ |
| `documents:delete` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| `reports:view` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| `reports:export` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| `coa_finding:create` | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `coa_finding:update` | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `admin:invite_user` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `admin:manage_roles` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `admin:manage_departments` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `admin:deactivate_user` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## `/docs/API_CONVENTIONS.md`

Must document all API conventions so every endpoint is consistent.

### Base prefix
All routes: `/api/v1/<resource>`

### HTTP methods
- `GET` — read, list, search (never mutates)
- `POST` — create
- `PUT` — full update/replace
- `PATCH` — partial update
- `DELETE` — soft delete (hard delete never used for government records)

### Response shape — success
```json
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 25,
    "total": 123
  }
}
```

### Response shape — error
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Asset not found",
    "field": "assetId"
  }
}
```

### HTTP status codes used
| Code | When used |
|---|---|
| 200 | Successful GET, PATCH, PUT |
| 201 | Successful POST (resource created) |
| 204 | Successful DELETE (no body) |
| 400 | Bad request (business logic validation failure) |
| 401 | Not authenticated |
| 403 | Authenticated but lacks permission |
| 404 | Resource not found |
| 409 | Conflict (duplicate, constraint violation) |
| 422 | TypeBox/Elysia format validation failure (auto) |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error |

### Pagination
All list endpoints support offset-based pagination via query params:
- `?page=1&limit=25`
- Max limit: 100
- Page state reflected in URL for shareability

---

## `/docs/DATABASE_CONVENTIONS.md`

Must document all database standards.

### ID columns
- All primary keys are `uuid` type
- UUID v7 generated using `Bun.randomUUIDv7()` via a shared utility function
- See UUID Strategy section for the drizzle-kit compatibility workaround

### Timestamps
- All tables must have `created_at` (timestamp, not null, default now) and `updated_at` (timestamp, not null)
- Tables with soft-delete must have `deleted_at` (timestamp, nullable)
- All timestamps stored as UTC

### Soft deletes
- Government records are NEVER hard-deleted
- Use `deleted_at IS NULL` to filter active records
- Soft-deleted records remain visible to auditors

### Naming
- Table names: plural snake_case (`assets`, `departments`, `coa_findings`)
- Column names: snake_case (`created_at`, `asset_number`, `department_id`)
- Foreign key columns: `<referenced_table_singular>_id` (e.g., `department_id`, `asset_id`)
- Index names: `idx_<table>_<column(s)>`

### Enums
Define as PostgreSQL enums in Drizzle for fields with a fixed set of values.

---

# UUID Strategy — `Bun.randomUUIDv7()`

## Why Bun's built-in

`Bun.randomUUIDv7()` is:
- Built directly into the Bun runtime — zero additional dependency
- Monotonic and time-sortable — ideal for database primary keys and index performance
- Cryptographically secure (uses BoringSSL's CSPRNG for the random bytes)
- Thread-safe and atomic — safe to use across workers in the same process
- Returns a standard UUID v7 string: `"0192ce11-26d5-7dc3-9305-1426de888c5a"`

```ts
import { randomUUIDv7 } from 'bun'

const id = randomUUIDv7()
// => "0192ce11-26d5-7dc3-9305-1426de888c5a"
```

No `vp add uuidv7` needed. No additional package to install or maintain.

## CRITICAL: drizzle-kit Compatibility Workaround

**There is a known issue:** `drizzle-kit generate` runs schema analysis in a Node.js context internally, even when invoked via Bun. If a Drizzle schema file directly imports from `'bun'`, drizzle-kit will throw:

```
Error: Cannot find module 'bun'
```

**The solution** is a thin wrapper utility that isolates the Bun import. Schema files import from this utility instead of from `'bun'` directly:

```ts
// src/db/utils/id.ts
// Isolates Bun's randomUUIDv7 so drizzle-kit can parse schema files
// without hitting the 'bun' module import during static analysis.

export function generateId(): string {
  // At runtime, Bun is always available.
  // The schema files import this function, not 'bun' directly,
  // so drizzle-kit's Node.js-based schema parser doesn't choke.
  return Bun.randomUUIDv7()
}
```

Then in all Drizzle schema files:

```ts
// src/db/schema/assets.ts
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { generateId } from '../utils/id'  // ← import from utility, NOT from 'bun'

export const assets = pgTable('assets', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => generateId()),
  // ...
})
```

This pattern works because:
- drizzle-kit only fails on direct `import { x } from 'bun'` in schema files
- The `$defaultFn` callback is called at runtime by Drizzle, not during drizzle-kit's static schema analysis
- The utility file can import from `'bun'` safely since it's never analyzed by drizzle-kit directly

The `generateId` utility must be created before any schema files are written and documented in `/docs/DATABASE_CONVENTIONS.md`.

---

# ElysiaJS — Swagger UI (Auth-Protected)

## Location

The Swagger UI is served at `/swagger`.

**Access is restricted to authenticated users only.** Unauthenticated requests to `/swagger` are redirected to the login page.

## Why auth-protected

The Swagger UI exposes the full API schema, endpoint list, request/response shapes, and allows live API calls to be made against the running system. In a government system with sensitive asset data, this must not be publicly accessible.

## Implementation

```bash
vp add @elysia/openapi
```

```ts
import { Elysia } from 'elysia'
import { openapi } from '@elysia/openapi'

const app = new Elysia()
  .use(
    openapi({
      path: '/swagger',                // Serve at /swagger
      documentation: {
        info: {
          title: 'City Asset Registry API',
          version: '1.0.0',
          description: 'Internal API for the City Asset Registry System',
        },
        tags: [
          { name: 'Assets', description: 'Asset management endpoints' },
          { name: 'Departments', description: 'Department management' },
          { name: 'Inventory', description: 'Physical inventory campaigns' },
          { name: 'Reconciliation', description: 'Reconciliation engine' },
          { name: 'Documents', description: 'Document management via PaperlessNGX' },
          { name: 'Reports', description: 'Reporting and exports' },
          { name: 'COA Findings', description: 'COA audit findings tracker' },
          { name: 'Admin', description: 'User and role administration' },
        ],
      },
    })
  )
  // Auth guard: must be placed BEFORE .use(openapi())
  // or use Elysia's lifecycle hooks to protect /swagger
  .onBeforeHandle(({ request, error, store }) => {
    if (new URL(request.url).pathname.startsWith('/swagger')) {
      // Check for valid session — redirect or 401 if not authenticated
      if (!store.session) {
        return error(401, { message: 'Authentication required to access API docs' })
      }
    }
  })
```

**Note:** The exact auth guard implementation depends on how BetterAuth session is wired into Elysia context. The session check should use the same session middleware used by all other protected routes — do not implement a separate auth check for `/swagger`.

## What the Swagger UI shows

- All `/api/v1/*` endpoints, auto-documented from TypeBox schemas
- Request body shapes (from `body: t.Object(...)`)
- Query parameter shapes (from `query: t.Object(...)`)
- Response shapes (from Elysia route return types)
- Authentication requirements per endpoint
- Example values where TypeBox schema provides them
- Tags organizing endpoints by domain

## Development vs Production

- In development (`APP_ENV=development`): Swagger UI is accessible at `http://localhost:5173/swagger` after login
- In production: Swagger UI remains auth-protected. Consider adding an additional environment flag (`ENABLE_SWAGGER=true/false`) to fully disable it in production if desired — document this decision in the plan

---

# VitePlus Toolchain — Reference

## `vp env` — ON

`vp env` is enabled. VitePlus manages the Node.js runtime.

```bash
vp env on          # Already enabled
vp env pin lts     # Pin Node.js version to LTS
vp env current     # Show current resolved version
vp env doctor      # Diagnose environment issues
```

## `vp install` — Dependency Management

```bash
vp install                    # Install all from lockfile
vp install --frozen-lockfile  # CI-safe (fail if lockfile changes)
vp add <pkg>                  # Add runtime dependency
vp add -D <pkg>               # Add dev dependency
vp remove <pkg>               # Remove a package
vp update                     # Update dependencies
vp outdated                   # Show available updates
vp why <pkg>                  # Explain why a package is present
```

## `vp check` — Static Analysis

```bash
vp check           # Format + lint + type-check in one pass
vp check --fix     # Auto-fix formatting and autofixable lint errors
```

Required `vite.config.ts` config:

```ts
import { defineConfig } from 'vite-plus'

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
})
```

## `vp test` — Testing

```bash
vp test              # Run once
vp test watch        # Watch mode
vp test run --coverage
```

Test config in `vite.config.ts`:

```ts
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
})
```

## `vp run` — Scripts

```bash
vp run db:migrate
vp run db:seed
vp run db:reset
```

## `vp build` and `vp dev`

```bash
vp dev      # Development server
vp build    # Production build
```

---

# Database Architecture

## Directory Structure

```
src/
  db/
    schema/
      auth.ts
      departments.ts
      assets.ts
      asset-categories.ts
      locations.ts
      offices.ts
      documents.ts
      images.ts
      projects.ts
      inventory.ts
      reconciliation.ts
      coa-findings.ts
      transfers.ts
      maintenance.ts
      disposal.ts
      drafts.ts
      index.ts              # Re-exports all schema tables
    typebox/
      assets.typebox.ts     # createInsertSchema + createSelectSchema
      departments.typebox.ts
      projects.typebox.ts
      ...
      index.ts
    migrations/             # Generated by Drizzle Kit — never edit manually
    seed/
      index.ts              # drizzle-seed entry point
      departments.seed.ts
      assets.seed.ts
      categories.seed.ts
    utils/
      id.ts                 # generateId() wrapper for Bun.randomUUIDv7()
    client.ts               # Drizzle db client instance
    index.ts                # Re-exports everything
```

## ID Generation

All primary keys use `generateId()` from `src/db/utils/id.ts`, which wraps `Bun.randomUUIDv7()`.

**Do not import directly from `'bun'` in schema files.**

## drizzle-typebox + TypeBox Pin

```bash
vp add drizzle-typebox
```

After installing, pin `@sinclair/typebox` to the version used by Elysia:

```bash
grep "@sinclair/typebox" node_modules/elysia/package.json
```

Then in `package.json`:

```json
{
  "overrides": {
    "@sinclair/typebox": "<exact version from above>"
  }
}
```

## drizzle-seed

```bash
vp add -D drizzle-seed
```

All seed data uses `[DEMO]` or `[SAMPLE]` markers. Never use real LGU names or personal data.

---

# API Design — ElysiaJS

## Integration with SvelteKit

Elysia is integrated directly into SvelteKit. No separate service, no separate Docker container, no CORS.

Official docs: https://elysiajs.com/integrations/sveltekit.html

## API Prefix

All routes: `/api/v1/<resource>`

## Plugins

```bash
vp add @elysia/openapi           # Swagger UI at /swagger
vp add @elysia/opentelemetry     # Distributed tracing
vp add @elysiajs/eden            # Frontend type-safe client
```

## BetterAuth Mount

Follow: https://elysiajs.com/integrations/better-auth.html

BetterAuth routes mount under `/api/v1/auth/*`.

## Eden Treaty

```ts
import { treaty } from '@elysiajs/eden'
import type { App } from '../api'

const api = treaty<App>('localhost:3000')

// Type-safe:
const { data, error } = await api.v1.assets.get()
```

All frontend API calls go through Eden Treaty. Never use raw `fetch` to call Elysia routes from SvelteKit components.

---

# Authentication and Sessions

- Email/password only
- No public registration — invite-only
- BetterAuth + Elysia integration

| Setting | Value |
|---|---|
| Session max | 8 hours |
| Inactivity timeout | 2 hours |
| Concurrent sessions | Allowed |
| Login logging | Every attempt (success + failure) with IP + user agent |
| Deactivation | All sessions invalidated immediately server-side |

---

# Rate Limiting

| Endpoint | Limit | Window | Response |
|---|---|---|---|
| Auth endpoints | 5 req | per minute per IP | 429 + `Retry-After` |
| All other endpoints | 20 req | per minute per user | 429 + `Retry-After` |

Redis for rate limit counters. In-process Map acceptable during early development.

---

# HTTP Security Headers and CSP

Set globally in `hooks.server.ts`.

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(self)` |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'nonce-{r}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://<imgproxy>; connect-src 'self' https://<typesense> https://<paperless>; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';` |

---

# Document Storage — PaperlessNGX + S3/ImgProxy

| File Type | Storage | Serving |
|---|---|---|
| PDFs, contracts, CSVs, scanned docs | PaperlessNGX | PaperlessNGX URL |
| Images | S3-compatible | ImgProxy only (never raw S3) |

XLSX not accepted. CSV only for tabular uploads.

File upload security:
- MIME validated server-side
- Size limits: images 10MB, PDFs 50MB, CSVs 5MB
- Extension rules per form context

Signed URLs: 1-day max, file sharing only, every generation logged.

---

# Audit Logs — ClickHouse

Separate ClickHouse database. Append-only.

- No `UPDATE` or `DELETE` ever against audit tables
- Grafana Alloy ingests app log file → Loki → Grafana Dashboard

Each entry: `id, timestamp, actor_user_id, actor_ip, actor_user_agent, action, entity_type, entity_id, before_value, after_value, department_id`

---

# Search and Caching

- **Typesense** — database record search
- **PaperlessNGX REST API** — document content search
- Offset-based pagination with URL-reflected state

| Cache Target | TTL | Invalidation |
|---|---|---|
| Dashboard counters | 5 min | On relevant data change |
| Dropdown options | 15 min | On admin update |

---

# Dashboard Design

**Summary Cards:** Total assets, Unverified assets, Open reconciliation issues, Overdue physical counts, Total users, Online users (last 15 min)

**Risk Indicators:** Oldest unresolved COA findings, Assets missing accountable person, Assets without documents, Completed projects not converted to PPE

**Asset Map:** Leaflet + OpenStreetMap. Clickable markers for assets with GPS. Cached 5 min. "Last updated" shown.

---

# QR Code Strategy

- Generated on creation, even in draft status
- Encodes: `https://<app-domain>/assets/<asset-id>`
- Served via `GET /api/v1/assets/:id/qr-code` as SVG or PNG
- User saves and prints themselves — no built-in print workflow

---

# Forms Architecture

Use SvelteKit Superforms with TypeBox schemas.

**Form states:** Idle → Loading → Success | Validation Error | Server Error | Network Error

**Draft auto-save:** DB-backed (`form_drafts` table). Auto-save debounced at 3 seconds. Survives refresh, network issues, re-login.

---

# Testing

All tests via `vp test` (Vitest). Never `bun test`.

- Unit: TypeBox schemas, RBAC logic
- Integration: Elysia routes using Elysia test utilities
- E2E: Playwright
- Test DB: Separate PostgreSQL seeded with drizzle-seed

---

# GitLab CI/CD

Install VitePlus in pipeline:

```yaml
before_script:
  - curl -fsSL https://vite.plus | bash
  - export PATH="$HOME/.vite-plus/bin:$PATH"
  - vp env on
  - vp install --frozen-lockfile

stages: [check, test, build, docker-build, docker-push, deploy]
# check: vp check
# test:  vp test
# build: vp build
```

Never auto-run `drizzle-kit push` in CI. Migrations are manual on production.

---

# Implementation Roadmap

## Phase 0 — Rules and Documentation (MUST COMPLETE BEFORE CODING)

**Step 0.1 — Create rules (one commit per file):**
```
feat: create /rules/COMMIT_DISCIPLINE.md
feat: create /rules/CODE_HYGIENE.md
feat: create /rules/PRE_COMMIT_CHECKLIST.md
feat: create /rules/TESTING_STANDARDS.md
```

**Step 0.2 — Create documentation (one commit per file):**
```
feat: create /docs/TECH_STACK.md
feat: create /docs/ARCHITECTURE.md
feat: create /docs/VALIDATION_PATTERN.md
feat: create /docs/REQUIRED_PACKAGES.md
feat: create /docs/RBAC_ROLES_AND_PERMISSIONS.md
feat: create /docs/API_CONVENTIONS.md
feat: create /docs/DATABASE_CONVENTIONS.md
```

**Step 0.3 — Create plan files (one commit per file):**
```
feat: create /plans/00-project-overview.md
feat: create /plans/01-viteplus-toolchain.md
... (one commit per plan file)
```

**Step 0.4 — Root files:**
```
feat: create README.md
feat: create .env.example
```

## Phase 1 — Foundation (each step = 1 commit)

- Confirm `vp env on`, pin `.node-version`
- Install and configure Tailwind CSS
- Install shadcn-svelte (login-03, sidebar-08)
- Install Drizzle ORM + Drizzle Kit
- Configure PostgreSQL client (`src/db/client.ts`)
- **Create `src/db/utils/id.ts` with `generateId()` using `Bun.randomUUIDv7()`**
- Install drizzle-seed
- Install ElysiaJS + SvelteKit integration
- Configure `@elysia/openapi` with Swagger UI at `/swagger` (auth-protected)
- Configure `@elysia/opentelemetry`
- Install Eden Treaty
- Install drizzle-typebox + pin `@sinclair/typebox`
- Implement HTTP security headers in `hooks.server.ts`
- Configure `vite.config.ts` (`typeAware: true, typeCheck: true`)
- Set up Docker Compose (all services)
- Create `.env.example`

## Phase 2 — Auth and Departments

- BetterAuth + Elysia integration
- Login endpoint + page
- Session management
- Invite user flow + accept invite page
- Forgot/reset password
- User deactivation + session invalidation
- Department CRUD API + UI
- RBAC middleware

## Phase 3 — Asset Core

- Asset categories, offices, locations (schema + API + UI — each separately)
- Asset schema + migration
- Asset list page with pagination
- Asset create form (TypeBox + draft save)
- Asset edit form
- Asset detail page
- QR code endpoint + display
- Typesense sync

## Phase 4 — Document and Image Storage

- PaperlessNGX REST API integration
- S3 image upload
- ImgProxy serving
- Document metadata + document library page
- MIME + size validation

## Phase 5 — Physical Inventory

- Campaign schema + API + UI
- Physical count screen
- Found-at-station flow
- Missing asset flow

## Phase 6 — Projects and Conversion

- Project schema + API + UI
- Completion workflow
- PPE conversion

## Phase 7 — Reconciliation Engine

- Detection (on-demand)
- Review/resolve workflow

## Phase 8 — COA Findings Tracker

- Findings CRUD (with draft save)
- Action plans + evidence

## Phase 9 — Search and Caching

- Typesense integration + sync
- Dashboard and dropdown caching
- PaperlessNGX document search in UI

## Phase 10 — Dashboard and Reports

- Each dashboard card = 1 commit
- Risk indicators panel
- Asset map (Leaflet)
- Reports + CSV exports

## Phase 11 — Audit Logs

- ClickHouse setup + schema
- Audit log writes
- Grafana Alloy + Loki + Grafana dashboard

## Phase 12 — Deployment

- Dockerfile
- GitLab CI/CD pipeline
- Migration procedures
- Backup procedures

## Phase 13 — Pre-Production Security

- Encryption at rest
- Backup encryption
- Security review
- Load testing

---

# Planning Style Per File

Each plan file must include:

1. **Purpose**
2. **Why it matters**
3. **Requirements** (specific, testable)
4. **Proposed implementation** (concrete code patterns, file paths, commands)
5. **Database tables involved** (if applicable)
6. **API endpoints involved** (if applicable, with `/api/v1/` prefix and Swagger tag)
7. **UI pages involved** (if applicable)
8. **Security considerations**
9. **Edge cases**
10. **Acceptance criteria**
11. **Implementation checklist** (checkbox items, one per commit)

---

# Known Limitations

- Software cannot prove an asset exists without physical inventory
- Software cannot fix inaccurate historical records automatically
- XLSX uploads not supported — CSV only
- Mobile browser not supported — dedicated mobile app uses the API
- Reconciliation engine runs on-demand, not real-time
- Some historical documents may be permanently missing

---

# Pre-Production Security Checklist (Deferred)

- Encryption at rest: S3, PostgreSQL, ClickHouse
- Backup encryption
- Penetration testing / security review
- Disaster recovery plan

---

## Change Log

### v3 → v4

| # | Change | Detail |
|---|---|---|
| 1 | `uuidv7` package removed | Replaced by `Bun.randomUUIDv7()` — zero dependency |
| 2 | `generateId()` utility pattern | Wraps `Bun.randomUUIDv7()` to avoid drizzle-kit `MODULE_NOT_FOUND` bug |
| 3 | drizzle-kit gotcha documented | Known issue: direct `import from 'bun'` in schema files breaks drizzle-kit's Node.js parser |
| 4 | Documentation-first order enforced | Phase 0 requires RULES → DOCS → PLANS before any code |
| 5 | RULES files specified | `COMMIT_DISCIPLINE.md`, `CODE_HYGIENE.md`, `PRE_COMMIT_CHECKLIST.md`, `TESTING_STANDARDS.md` — with full content spec |
| 6 | DOCS files specified | `TECH_STACK.md`, `ARCHITECTURE.md`, `VALIDATION_PATTERN.md`, `REQUIRED_PACKAGES.md`, `RBAC_ROLES_AND_PERMISSIONS.md`, `API_CONVENTIONS.md`, `DATABASE_CONVENTIONS.md` — with full content spec |
| 7 | RBAC matrix added | Full role × permission matrix table in `/docs/RBAC_ROLES_AND_PERMISSIONS.md` |
| 8 | Swagger UI at `/swagger` | Auth-protected, powered by `@elysia/openapi`, with tag organization, dev vs prod notes |
| 9 | `REQUIRED_PACKAGES.md` | Includes explicit "NOT installed and why" table |
| 10 | Phase 0 commit list | Every rule file, doc file, and plan file is its own commit |
