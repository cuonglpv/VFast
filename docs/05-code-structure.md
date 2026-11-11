# 05 — Code structure and solution architecture

Status: **frontend implemented** (`src/frontend`), **backend proposed** (not yet in the repository). The backend design comes from the team's *System Design & Solution Architecture* proposal; items marked *assumption* need team confirmation.

## 1. Repository layout

```text
VFast/
├─ README.md
├─ docs/
│  ├─ 01-research-top-down.md … 04-information-architecture-manager.md
│  ├─ 05-code-structure.md          ← this file
│  ├─ database/
│  │  ├─ elms.dbml                  Database design (source of truth)
│  │  └─ er-diagram.md              ER diagrams in Mermaid, generated from the DBML
│  ├─ diagrams/out/                 Use case diagrams (draw.io, png, svg)
│  └─ mindmap/vfast.xmind           Editable mind map
└─ src/
   ├─ frontend/                     React SPA (implemented)
   └─ backend/                      .NET solution (proposed, see section 4)
```

## 2. Solution architecture (proposed)

One monolith built with Clean Architecture, deployed as two processes (`Elms.Api` and `Elms.Worker`) that share one PostgreSQL database. The API serves users only; every slow operation (provider calls, large CSV imports, detection) is queued and run by the worker. The queue lives in PostgreSQL, so no Redis or message broker is needed.

| Layer | Choice |
|---|---|
| Frontend | React 19, Vite, TypeScript, MUI v6, Tailwind CSS v4, ApexCharts, React Router v7 |
| Backend | ASP.NET Core 10 (.NET 10 LTS), controllers, Command/Query handlers |
| Worker | .NET Worker Service running a Hangfire server |
| Data access | EF Core 10 + Npgsql for writes; Dapper over views for dashboards |
| Database | PostgreSQL 16 |
| Jobs | Hangfire + Hangfire.PostgreSql |
| Connectors | Microsoft Graph SDK + Azure.Identity; `IHttpClientFactory` + Polly |
| Files | S3 or MinIO (invoices up to 10 MB) |
| Auth | ASP.NET Core Identity, server-side cookie session, antiforgery |
| API contract | OpenAPI + Scalar; TypeScript client generated with `openapi-typescript` |
| Libraries | FluentValidation, CsvHelper, Serilog / OpenTelemetry, HybridCache |
| Tests | xUnit, Testcontainers (PostgreSQL), NetArchTest |
| Delivery | Docker (Compose for dev), Nginx or Caddy, GitHub Actions |

### Assumptions (non-functional)

| Property | Target |
|---|---|
| Scale | ~5,000 accounts, 100–300 daily users, ~200 license lines, ~150,000 assignments |
| Latency | Dashboards p95 < 1 s; lists p95 < 500 ms (server-side paging) |
| Freshness | Provider data up to 1 day old; Staff manual edits visible within minutes |
| Availability | 99.5 % in business hours; RPO ≤ 24 h, RTO ≤ 4 h |

### Key decisions

| Decision | Alternative | Revisit when |
|---|---|---|
| Monolith: 1 Api + 1 Worker | Microservices | Several teams edit one codebase, or ingestion needs its own scaling |
| PostgreSQL only (data, queue, session) | Add Redis / broker | The job queue becomes a bottleneck |
| Daily scheduled sync | Realtime events | Providers offer usage webhooks and users need same-day numbers |
| Clean Architecture, modules as folders | Module-first modular monolith | A module must become its own service |
| EF Core to write, Dapper + views to read | EF Core only | Too many views to keep in sync with the schema |
| Cookie session | JWT | A mobile app or third-party API is needed |
| One `AppDbContext`, one schema per module | One DbContext per module | A module is split out |

## 3. Backend modules

Eight modules follow the five mind-map branches, plus two technical modules (`ingestion`, `usage`) where data errors are most likely. A module owns its tables; other modules read them only through a service or a public view.

| Module | Use cases | Owns | Responsibility |
|---|---|---|---|
| `identity` | UC19, UC21, UC22, UC24 | user accounts, roles, permissions, sessions | Login, lockout, RBAC, policies |
| `organization` | UC20 | org units, employees, manager scope | P&L → department tree, email → employee, Manager data scope |
| `catalog` | UC01–UC04 | vendors, products, plans, entitlements, contracts | Catalog, entitlements per archetype, "renewal soon" flags |
| `ingestion` | UC03 (import / manual) | connectors, sync runs, raw records, import batches | Run connectors, CSV import (preview → confirm, all-or-nothing) |
| `usage` | UC10–UC12, UC23 | assignments, usage records, snapshots | Normalize to assignment and usage, daily seat status (BR-03) |
| `finance` | UC05–UC09 | expenses, FX rates, budget plans and lines, periods | Cost normalization (BR-05), allocation (BR-06), reconciliation (BR-09), forecast (BR-11) |
| `optimization` | UC10–UC14 | detection results, recommendations | Daily detection, savings, recommendation lifecycle |
| `analytics` | UC15–UC18, UC23 | read models only | Dashboard API reading views |
| `audit` (shared) | BR-15 | audit logs | Who, old value, new value, time, reason for every change |

Dependency rules (enforced by NetArchTest):

- `analytics` may read every module; no module depends on `analytics`.
- `optimization` reads `usage`, `finance`, `catalog` and never writes to them.
- `ingestion` writes raw data, then calls `usage` and `catalog` to normalize; no business module calls a provider directly.
- Only `identity` and `organization` decide access; other modules receive an `AccessScope`.

Request flow: Controller (`Mediator.Send`) → pipeline behaviours (logging, validation, authorization) → handler → `IAppDbContext` (filtered by `AccessScope`) → interceptor writes the audit log.

Connectors are plugins implementing one interface: `fetchEntitlements`, `fetchAssignments`, `fetchActivity`, `fetchUsage(period)`, `fetchCost(period)`. A method a provider does not support returns `NotSupported`, never an empty list, so "no source" stays distinct from "source reports zero".

## 4. Backend structure (proposed, .NET 10)

Four projects plus a shared kernel. Modules are feature folders inside each layer, not separate projects; boundaries are kept by namespaces and architecture tests.

```text
src/backend/
├─ src/
│  ├─ SharedKernel/                 Base entities, result types, ICurrentUser
│  ├─ Elms.Domain/
│  │  ├─ Entities/<Module>/         Catalog, Usage, Finance, Optimization, ...
│  │  ├─ Enums/                     Archetype, SeatStatus, RecommendationStatus
│  │  └─ Rules/                     SeatStatusRule, CostNormalizer, CostAllocator
│  ├─ Elms.Application/
│  │  ├─ Interfaces/                IAppDbContext, IProviderConnector, IFileStorage
│  │  ├─ <Module>/<Feature>/        e.g. Catalog/Products, Finance/BudgetPlans
│  │  │  └─ Commands/  Queries/  DTO/
│  │  ├─ Analytics/Queries/         Read views with Dapper
│  │  ├─ Ingestion/Pipeline/        Steps of the daily job
│  │  └─ ConfigureServices.cs       AddApplication()
│  ├─ Elms.Infrastructure/
│  │  ├─ Data/                      AppDbContext, Configurations/, Migrations/
│  │  ├─ Connectors/MicrosoftGraph/, Storage/
│  │  └─ ConfigureServices.cs       AddInfrastructure(config)
│  ├─ Elms.Api/                     Controllers/, Program.cs
│  └─ Elms.Worker/                  Program.cs, Jobs/DailyPipelineJob.cs
└─ tests/                           Unit, Integration (Testcontainers), Architecture
```

Dependency direction: `Api / Worker → Infrastructure → Application → Domain → SharedKernel`. Application talks to the database only through `IAppDbContext`.

Conventions:

- One folder per use case: `Elms.Application/<Module>/<Feature>/{Commands,Queries,DTO}`; command/query and handler share one file.
- Pure business rules (BR-03, BR-05, BR-06, BR-09) live in `Elms.Domain/Rules` for easy unit tests.
- One EF configuration file per entity in `Data/Configurations/<Module>/`; an interceptor writes `audit_logs` before/after values.
- Class names PascalCase English; columns `snake_case` via `EFCore.NamingConventions`.
- No lazy loading; use `.Select(...)` or `Include`; read-only queries use `AsNoTracking()`.
- Business constraints live in the database: check constraints, unique indexes, `Restrict` foreign keys (master data is never deleted, BR-15).
- One global `IExceptionHandler` returns `ProblemDetails`; controllers do not catch.
- Check licenses before choosing MediatR / AutoMapper; free alternatives are Mediator (source generator) and Mapperly.

## 5. API conventions

| Item | Rule |
|---|---|
| URL | `/api/v1/<module>/<resource>`, plural kebab-case nouns, e.g. `/api/v1/catalog/products` |
| Business actions | `POST` to a sub-resource, e.g. `POST /optimization/recommendations/{id}/accept`, `POST /ingestion/imports/{id}/confirm` |
| Lists | `page`, `pageSize` (max 100), `sort`, typed filters; returns `{ items, page, pageSize, total }` |
| Errors | `ProblemDetails` (RFC 9457): 400 validation, 401, 403, 404 (outside scope), 409 (duplicate, wrong state, write conflict) |
| Concurrency | Optimistic, PostgreSQL `xmin`; the second writer gets 409 |
| Idempotency | Confirming an import is keyed by `import_batch_id`; repeats write nothing |
| Data types | ISO 8601 dates; money as `amount` + `currency`; missing data is `null` with a reason, never `0` (BR-04) |
| Dashboards | Every response carries `dataDate` and the data source (BR-14) |

## 6. Background jobs (Hangfire, in `Elms.Worker`)

| Job | Trigger | Work |
|---|---|---|
| `DailyPipelineJob` | 02:00 daily | Sync each source, seat status, cost, detection, refresh views |
| `ImportConfirmJob` | Staff confirms an import | Write the whole file in one transaction |
| `RecomputeLineJob` | Staff edits an entitlement / import done | Recompute one line, `REFRESH MATERIALIZED VIEW CONCURRENTLY` |
| `RenewalFlagJob` | Daily | Flag "Renewal soon" and "Notice period passed" (UC04) |

All jobs are idempotent (upsert by source key + data date), retried (Polly for provider calls, Hangfire up to 3 times), and never overlap. When retries run out the source is marked `failed` and its figures are `Unknown`, not `0`. Jobs run as `SystemUser`, so the audit actor is `system`.

## 7. Caching

`HybridCache` in the Application layer; L1 in-memory first, Redis as L2 only when the API scales to several instances.

| Data | Key | TTL | Invalidated when |
|---|---|---|---|
| Permission matrix | `perm:{role}` | 10 min | Admin edits permissions |
| User `AccessScope` | `scope:{userId}` | 10 min | Role, managed units, or org tree change |
| Reference data | `ref:{type}` | 30 min | Staff / Admin write |
| Dashboard results | `dash:{name}:{scopeHash}:{filter}:{dataVersion}` | 1 h | `dataVersion` increments |

Keys always include the user's scope (BR-16). `dataVersion` is a counter in the database, bumped whenever a job refreshes the views, so all dashboards show the same version of the numbers (G7). API responses use `Cache-Control: private, no-store`.

## 8. Authorization and security

Three independent checks per request (hiding a button is not protection, BR-16):

1. **Authentication** — session cookie, user must be `ACTIVE`; otherwise 401.
2. **RBAC** — `[Authorize(Policy = "budget.plan:write")]` per endpoint, matched against role permissions; otherwise 403.
3. **Data scope** — an `AccessScope` (role, units including child departments, employee id) is applied by a global query filter; out-of-scope records return 404.

Also: Employees get a dedicated DTO (`/api/v1/me/licenses`) with no price or cost; login uses ASP.NET Core Identity with lockout after 5 failures for 15 minutes (BR-18); cookies are `HttpOnly`, `Secure`, `SameSite=Lax` with a CSRF token; sessions are stored server-side so disabling a user revokes them immediately; connector credentials are read-only scope, encrypted with Data Protection, and only the worker can decrypt them. Postgres Row-Level Security is planned after the MVP.

## 9. Deployment

A reverse proxy (Nginx or Caddy) serves the SPA and forwards `/api/*` to `Elms.Api` on the same domain, so no CORS is needed. One Api and one Worker instance; Hangfire's distributed lock prevents duplicate jobs. Migrations run as a separate pipeline step (EF migration bundle) before the apps start, never at application startup. Environments: dev (Docker Compose: postgres, minio, api, worker, web), staging (Microsoft 365 developer tenant), prod. Operations: `/health`, structured logs with `request_id`, Hangfire dashboard (Admin only), alert when a source fails two days in a row.

## 10. Frontend structure (implemented)

React 19 + Vite + TypeScript, MUI v6 and Tailwind CSS v4, routing with React Router v7. Mock data is used until the backend exists.

```text
src/frontend/
├─ index.html, main.tsx, App.tsx      Entry point and provider tree (theme, router)
├─ index.css, portal.css              Tailwind v4 @theme tokens and portal styles
├─ vite.config.ts, tsconfig*.json     Build and TypeScript config
├─ routes/                            paths.ts (typed URL constants), router.tsx
├─ layouts/                           Header, Sidebar, MainLayout (app shell)
├─ components/
│  ├─ layout/                         Shell pieces shared with layouts/
│  ├─ cards/                          KpiCard
│  ├─ LicenseHealthCharts.tsx         ApexCharts widgets
│  └─ PortalIcon.tsx
├─ sections/                          Feature blocks that compose pages
│  ├─ licenses/                       LicenseListSection, LicenseDetailDrawer
│  └─ budget/                         BudgetKpiSection, BudgetRenewalsDrawerSection
├─ pages/                             One folder per screen
│  ├─ licenses/                       LicenseManagementPage, LicenseDetailPage
│  ├─ budget/                         BudgetAnalyticsPage
│  ├─ analytics/                      GeneralAnalyticsPage
│  └─ users/                          UserManagementPage
├─ types/                             license.ts, budget.ts, user.ts
├─ utils/                             formatCurrency, formatDate, calculations, licenseCsv
├─ data/                              licenses.tsx (mock data)
└─ theme/                             MUI theme and design tokens
```

Each folder has a barrel `index.ts`. Composition order: `pages` → `sections` → `components`. Routes (`routes/paths.ts`):

| Path | Screen |
|---|---|
| `/manager/licenses` | License management |
| `/manager/licenses/:licenseId` | License detail |
| `/manager/analytics` | General analytics |
| `/manager/analytics/budget` | Budget analytics |
| `/admin/users` | User management |

Note: `src/frontend/README.md` still describes alias folders (`layout/`, `page/`, `componant/`, `section/`, `route/`) that are not in the repository; `layouts/` and `components/layout/` both exist today. Align the two when the frontend is next refactored.

## 11. Database

The schema is in [`database/elms.dbml`](database/elms.dbml) (37 tables, 19 enums, 7 table groups; PostgreSQL). ER diagrams per group: [`database/er-diagram.md`](database/er-diagram.md). The backend maps each module to a Postgres schema (`catalog`, `usage`, `finance`, `optimization`, `org`, `ingestion`, `audit`) and keeps money as `numeric`, with `NULL` meaning Unknown.
