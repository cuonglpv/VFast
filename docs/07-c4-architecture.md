# 07 — C4 Architecture

The C4 model describes a system at four zoom levels. Each level answers one question for one audience:

| Level | Diagram | Question it answers | Audience |
|---|---|---|---|
| 1 | System Context | Who uses ELMS and which other systems does it touch? | Everyone, including non-technical readers |
| 2 | Container | What are the deployable parts and how do they talk? | Developers, operations |
| 3 | Component | How is one container built inside? | Developers |
| 4 | Code | How is a component implemented? | Developers (see the repository, not this file) |

Two supplementary views follow the four levels: a **dynamic view** (the daily pipeline) and a **deployment view**.

Diagrams use Mermaid flowcharts so they render in GitLab Markdown. Notation: a person is a rounded shape, an external system is grey, the system boundary is a dashed frame, and every arrow is labelled with what flows and over which protocol.

## 1. Level 1 — System Context

ELMS is one system. It reads license, assignment, usage, and cost data from software providers, combines it with data entered by the license team, and shows managers where money is wasted. It never changes anything on a provider (BR-01).

```mermaid
flowchart TB
    employee(["Employee<br/>Sees own licenses<br/>and whether they are used"])
    staff(["Staff<br/>Sets up connectors, maintains catalog,<br/>entitlements, contracts, expenses"])
    manager(["Manager<br/>Plans budget, reviews waste,<br/>decides on recommendations"])
    admin(["Admin<br/>Users, P&Ls, departments,<br/>roles, permissions"])

    elms["ELMS<br/>Enterprise License Management System<br/>[Software system]<br/>Centralizes licenses, measures usage and cost,<br/>compares budget with reality, recommends savings"]

    providers["Software providers<br/>[External systems]<br/>Microsoft 365 / Entra ID, Google, Adobe, JetBrains,<br/>OpenAI, Anthropic, AWS, VPN and license servers"]
    files["ECS and CSV files<br/>[Input]<br/>ECS files for file connectors,<br/>CSV templates for manual import"]

    employee -- "Views own licenses<br/>[HTTPS]" --> elms
    staff -- "Sets up connectors, enters<br/>and imports license data<br/>[HTTPS]" --> elms
    manager -- "Plans budget, decides<br/>[HTTPS]" --> elms
    admin -- "Manages access<br/>[HTTPS]" --> elms
    elms -- "Reads licenses, assignments, usage, cost<br/>[read-only connectors, ECS]" --> providers
    staff -. "Uploads<br/>[ECS or CSV file]" .-> files
    files -. "Preview, then confirm" .-> elms

    classDef person fill:#0F67B1,stroke:#0B4F8A,color:#fff
    classDef system fill:#1E3A5F,stroke:#0F172A,color:#fff
    classDef external fill:#94A3B8,stroke:#475569,color:#0F172A
    class employee,staff,manager,admin person
    class elms system
    class providers,files external
```

### People

| Person | Role in ELMS | Data scope |
|---|---|---|
| Employee | `EMPLOYEE` — every employee | Own licenses only, without price or cost |
| Staff | `STAFF` — license management team | Every license and expense; sets up and monitors connectors; no budget, no dashboards |
| Manager | `MANAGER` — manager of a P&L or department | Only the units assigned to them |
| Admin | `ADMIN` — system operator | Access settings only; sees connector status, counts, and error codes, but no license, budget, or cost data (BR-16) |

Each account has exactly one role (BR-17). The full capability matrix is in [Use cases](02-use-cases.md).

### External systems

| System | What ELMS takes | Delivery | Automation (from [research §4.4](01-research-top-down.md)) |
|---|---|---|---|
| Microsoft 365 / Entra ID | Plans and quantities, assigned licenses, activity, last sign-in | Adapter over Microsoft Graph, read-only | High (first connector) |
| Usage and cost APIs of OpenAI, Anthropic | Token / credit consumption, cost | Adapter over the provider API, read-only | High |
| AWS, Azure, Google Cloud | Cost (FOCUS export) | Adapter or file | High |
| License servers, VPN | Peak concurrent sessions (denials are not collected in v1) | Adapter reading logs, or an agent inside the company | Medium |
| MDM / endpoint agents | Devices | File or adapter | Low |
| Inventory scripts, contracts | Cores, deployed units, contract terms | ECS file, or manual entry | Very low |
| In-house applications, resellers, local vendors | Their own license data | Native ECS endpoint, where ELMS can require it | Depends on the provider |

Every connector hands ELMS data in the ELMS Connector Standard (ECS, see the [Connector standard proposal](06-connector-standard.md), BR-19), delivered one of three ways: **native** (the provider exposes an ECS endpoint), **adapter** (ELMS writes a connector that maps the provider's own API to ECS), or **file** (an ECS file uploaded in UC26). One validator checks all three. A license line without a connector is filled by Staff through manual entry or CSV import (UC03), so a provider is never left out.

### Out of scope at this level

ELMS does not assign or revoke licenses on a provider, does not buy or cancel contracts, and does not send e-mail or chat notifications ([research §7](01-research-top-down.md)).

## 2. Level 2 — Container

A container is something that runs or stores data. ELMS is one monolith deployed as **two processes** that share **one PostgreSQL database**. The API serves users; every slow operation (provider calls, large imports, detection) is queued in PostgreSQL and run by the worker, so no Redis or message broker is required.

```mermaid
flowchart TB
    users(["Employee / Staff / Manager / Admin"])
    providers["Software providers<br/>[External systems]<br/>Microsoft Graph and other APIs, read-only"]

    subgraph elms["ELMS [System boundary]"]
        direction TB
        proxy["Reverse proxy<br/>[Nginx or Caddy]<br/>Serves the SPA, forwards /api/* (same domain, no CORS)"]
        web["Web Frontend<br/>[React 19, Vite, TypeScript, MUI v6]<br/>Screens by role, dashboards,<br/>connector management, imports"]
        api["Elms.Api<br/>[ASP.NET Core 10]<br/>Authentication, RBAC, data scope,<br/>commands and queries"]
        worker["Elms.Worker<br/>[.NET Worker Service + Hangfire server]<br/>Provider sync, ECS validation,<br/>file and CSV import confirm,<br/>detection, view refresh"]
        db[("PostgreSQL 16<br/>[Database]<br/>Business data, Hangfire job queue,<br/>server-side sessions. 39 tables, 7 groups")]
    end

    users -- "HTTPS" --> proxy
    proxy -- "static files" --> web
    web -- "REST / JSON<br/>[cookie session, CSRF token]" --> api
    api -- "SQL (EF Core writes,<br/>Dapper reads over views)" --> db
    api -- "enqueue jobs" --> db
    worker -- "SQL, dequeue jobs" --> db
    worker -- "read-only connector calls<br/>[HTTPS, Polly retry]" --> providers

    classDef person fill:#0F67B1,stroke:#0B4F8A,color:#fff
    classDef container fill:#2F7FC1,stroke:#0F67B1,color:#fff
    classDef store fill:#475569,stroke:#0F172A,color:#fff
    classDef external fill:#94A3B8,stroke:#475569,color:#0F172A
    class users person
    class proxy,web,api,worker container
    class db store
    class providers external
```

### Containers

| Container | Technology | Responsibility |
|---|---|---|
| Web Frontend | React 19, Vite, TypeScript, MUI v6, Tailwind CSS v4, ApexCharts, React Router v7 | Role-based screens, dashboards, connector set-up and sync monitoring (UC03, UC25, UC26), CSV and ECS file upload with preview |
| Elms.Api | ASP.NET Core 10 (.NET 10 LTS), controllers, command/query handlers | Serves users only: three checks per request (authentication, RBAC, data scope), validation, audit |
| Elms.Worker | .NET Worker Service, Hangfire server | Runs every slow job and validates ECS payloads; the only process that calls providers and decrypts connector credentials |
| PostgreSQL 16 | PostgreSQL, Hangfire.PostgreSql | One database for business data, the job queue, and sessions; one schema per module (see [`elms.dbml`](database/elms.dbml)) |
| Reverse proxy | Nginx or Caddy | Serves the SPA and forwards `/api/*` to `Elms.Api` on the same domain |

### Relationships

| From → To | Protocol | Carries |
|---|---|---|
| Browser → Reverse proxy | HTTPS | Page loads and API calls |
| Web Frontend → Elms.Api | REST / JSON, `HttpOnly` `Secure` `SameSite=Lax` cookie, CSRF token | Every business request; OpenAPI contract with a generated TypeScript client |
| Elms.Api → PostgreSQL | SQL over Npgsql | Writes through EF Core; dashboard reads through Dapper over views; enqueue of jobs |
| Elms.Worker → PostgreSQL | SQL over Npgsql | Reads and writes data; dequeues jobs |
| Elms.Worker → Providers | HTTPS (native ECS endpoints, provider APIs and SDKs through adapters, `IHttpClientFactory` + Polly) | Read-only calls; credentials are read-only scope and encrypted with Data Protection |

The API never calls a provider, and the worker never serves a user request.

### Decisions behind this level

| Decision | Alternative | Revisit when |
|---|---|---|
| One monolith, two processes | Microservices | Several teams edit one codebase, or ingestion needs its own scaling |
| PostgreSQL only (data, queue, session) | Add Redis or a message broker | The job queue becomes a bottleneck |
| Daily scheduled sync | Realtime events | Providers offer usage webhooks and users need same-day numbers |
| Cookie session | JWT | A mobile app or third-party API is needed |

Non-functional assumptions: about 5,000 accounts, 100–300 daily users, about 200 license lines, about 150,000 assignments; dashboards p95 under 1 s; provider data up to 1 day old; 99.5 % availability in business hours. Source: [05 §2](05-folder-structure.md).

## 3. Level 3 — Component

### 3.1 Elms.Api and Elms.Worker

Both processes are built from the same Clean Architecture layers and run the same handlers. `Controllers/` exist only in the Api and `Jobs/` only in the Worker. Modules are feature folders inside each layer, not separate projects; boundaries are kept by namespaces and architecture tests (NetArchTest).

```mermaid
flowchart TB
    spa["Web Frontend"]
    db[("PostgreSQL 16")]
    providers["Software providers"]

    subgraph hosts["Hosts"]
        direction LR
        ctrl["Controllers<br/>[Elms.Api]<br/>/api/v1/module/resource"]
        jobs["Jobs<br/>[Elms.Worker, Hangfire]<br/>DailyPipelineJob, ImportConfirmJob,<br/>RecomputeLineJob, RenewalFlagJob"]
    end

    subgraph app["Elms.Application"]
        direction TB
        pipe["Pipeline behaviours<br/>logging, validation, authorization"]
        handlers["Command and query handlers<br/>one folder per use case"]
        analytics["Dashboard queries<br/>read views with Dapper"]
        ingest["Ingestion pipeline steps<br/>fetch, validate, store raw, normalize"]
        ecsval["ECS validator<br/>JSON Schema and rules (BR-19)"]
        ifaces["Interfaces<br/>IAppDbContext, IProviderConnector"]
    end

    subgraph domain["Elms.Domain"]
        direction TB
        entities["Entities and enums<br/>Archetype, SeatStatus, RecommendationStatus"]
        rules["Business rules<br/>SeatStatusRule, CostNormalizer, CostAllocator"]
    end

    subgraph infra["Elms.Infrastructure"]
        direction TB
        efctx["AppDbContext<br/>EF Core 10 + Npgsql, audit and scope interceptor"]
        ecshttp["EcsHttpConnector<br/>native ECS endpoints"]
        ecsfile["EcsFileReader<br/>ECS files uploaded in UC26"]
        adapters["Adapters<br/>Microsoft Graph, Google, OpenAI,<br/>Anthropic, FOCUS exports"]
    end

    kernel["SharedKernel.*<br/>Domain, Application, Infrastructure, Api<br/>BaseEntity, Money, AccessScope, BaseDbContext, GlobalExceptionHandler"]

    spa -- "REST / JSON" --> ctrl
    ctrl -- "Mediator.Send" --> pipe
    jobs -- "Mediator.Send / pipeline" --> pipe
    jobs --> ingest
    pipe --> handlers
    pipe --> analytics
    handlers --> rules
    handlers --> entities
    handlers --> ifaces
    analytics --> ifaces
    ingest --> ifaces
    ingest --> ecsval
    ifaces -. "implemented by" .-> efctx
    ifaces -. "implemented by" .-> ecshttp
    ifaces -. "implemented by" .-> ecsfile
    ifaces -. "implemented by" .-> adapters
    efctx -- "SQL" --> db
    ecshttp -- "read-only HTTPS" --> providers
    adapters -- "read-only" --> providers
    entities -. "built on" .-> kernel
    rules -. "built on" .-> kernel
```

Dependency direction: `Api / Worker → Infrastructure → Application → Domain → SharedKernel`. Domain depends on nothing; Application depends on interfaces only; only Infrastructure references EF Core, Npgsql, and the Graph SDK.

Request flow: controller → `Mediator.Send` → behaviours (log, validate, authorize) → handler → `IAppDbContext` (filtered by `AccessScope`) → interceptor writes the audit log. Worker flow: Hangfire job → handler or pipeline step → `IProviderConnector` / `IAppDbContext`.

### 3.2 Business modules

Eight business modules follow the six mind-map branches, plus a shared `audit` module. A module owns its tables (one Postgres schema each) and other modules read them only through a service or a public view.

```mermaid
flowchart LR
    identity["identity<br/>UC19, UC21, UC22, UC24<br/>accounts, roles, permissions, sessions"]
    organization["organization<br/>UC20<br/>P&L → department tree,<br/>employees, manager scope"]
    catalog["catalog<br/>UC01–UC04<br/>vendors, products, plans,<br/>entitlements, contracts"]
    ingestion["ingestion<br/>UC03 (connector, import, manual), UC25, UC26<br/>connectors, sync runs,<br/>raw records, import batches"]
    usage["usage<br/>UC10–UC12, UC23<br/>assignments, usage records,<br/>daily snapshots, seat status"]
    finance["finance<br/>UC05–UC09<br/>expenses, FX rates, budgets,<br/>cost allocation, forecast"]
    optimization["optimization<br/>UC10–UC14<br/>detection results,<br/>recommendations"]
    analytics["analytics<br/>UC15–UC18, UC23<br/>read models only"]
    audit["audit (shared)<br/>BR-15<br/>append-only audit log"]

    ingestion -- "normalize into" --> usage
    ingestion -- "normalize into" --> catalog
    optimization -. "reads only" .-> usage
    optimization -. "reads only" .-> finance
    optimization -. "reads only" .-> catalog
    analytics -. "reads" .-> optimization
    analytics -. "reads" .-> finance
    analytics -. "reads" .-> usage
    analytics -. "reads" .-> catalog
    identity -- "AccessScope" --> organization
```

Dependency rules, enforced by NetArchTest (from [05 §4.1](05-folder-structure.md)):

- `analytics` may read every module; no module depends on `analytics`.
- `optimization` reads `usage`, `finance`, and `catalog` and never writes to them.
- `ingestion` writes raw data, then calls `usage` and `catalog` to normalize; no business module calls a provider directly.
- Only `identity` and `organization` decide access; other modules receive an `AccessScope`.
- Every module writes through the audit interceptor, which is why `audit` has no drawn arrows.

Connectors are plugins behind one interface, `IProviderConnector`: `fetchEntitlements`, `fetchAssignments`, `fetchActivity`, `fetchUsage(period)`, `fetchCost(period)`. What they return is the ELMS Connector Standard (ECS): six datasets (`entitlements`, `subjects`, `assignments`, `activity`, `usage`, `costs`) inside an envelope that carries `completeness`, `granularity`, and `total_count`. A dataset a provider cannot supply is `NotSupported` (HTTP 501, `ecs:not-supported`), never an empty list, so "no source" stays distinct from "source reports zero" (BR-04). Details: [Connector standard](06-connector-standard.md).

### 3.3 Web Frontend

```mermaid
flowchart TB
    router["routes<br/>paths.ts, router.tsx"]
    pages["pages<br/>licenses, budget, analytics, users"]
    sections["sections<br/>licenses (list, detail drawer),<br/>budget (KPI, renewals drawer)"]
    components["components<br/>KpiCard, charts, StatusBadge, tooltips"]
    layouts["layouts<br/>Header, Sidebar, MainLayout"]
    data["data<br/>repositories calling the Elms.Api REST endpoints"]
    shared["types, utils, theme"]

    router --> layouts
    router --> pages
    pages --> sections
    sections --> components
    pages --> data
    sections --> data
    components --> shared
    sections --> shared
```

Call flow: `routes → pages → sections → components → types / utils`. Screens: `/manager/licenses`, `/manager/licenses/:licenseId`, `/manager/analytics`, `/manager/analytics/budget`, `/admin/users`. Screen details are in [Information architecture](04-information-architecture-manager.md).

### 3.4 PostgreSQL

Not drawn as components: the container is described by its seven table groups (organization and access, license catalog, collection pipeline, holders and usage, budget and expenses, optimization, audit). See [Database design](database/README.md) for the ERDs.

## 4. Level 4 — Code

C4 level 4 is left to the source, because a code-level diagram drawn by hand goes stale quickly.

| Component | Where to look |
|---|---|
| Frontend components | `src/frontend/` (one barrel `index.ts` per folder) |
| Backend solution layout | [05 §4.2](05-folder-structure.md); the solution lives in `src/backend/` |
| Entities and fields | [`database/tables.md`](database/tables.md), [`database/elms.dbml`](database/elms.dbml) |
| Reference DDL | [`database/schema.sql`](database/schema.sql) |
| Pure business rules | `Elms.Domain/Rules` (BR-03 seat status, BR-05 cost normalization, BR-06 allocation, BR-09 reconciliation) |

## 5. Dynamic view — the daily pipeline

`DailyPipelineJob` runs at 02:00 every day in `Elms.Worker`. It is the main way provider data enters ELMS and the reason dashboards show one consistent version of the numbers (G7).

```mermaid
sequenceDiagram
    autonumber
    participant H as Hangfire (Worker)
    participant C as Connector
    participant V as ECS validator
    participant P as Provider (read-only)
    participant D as PostgreSQL
    participant A as Elms.Api
    participant M as Manager

    H->>D: Dequeue DailyPipelineJob (distributed lock)
    loop each data source
        H->>C: fetchEntitlements / fetchAssignments / fetchActivity / fetchUsage / fetchCost
        C->>P: read-only call (Polly retry)
        alt success
            P-->>C: records
            C->>V: validate against ECS (schema, total_count, duplicates)
            V->>D: store raw_records, then normalize (upsert by source key + data date)
            V->>D: collection_coverage = complete or partial
        else retries exhausted, or validation fails the run
            C->>D: sync_runs = failed, nothing written, figures stay Unknown (never 0)
        end
    end
    H->>D: compute seat status (BR-03), effective cost (BR-05), allocation (BR-06)
    H->>D: run detection (unused, inactive, overuse, leaver)
    H->>D: REFRESH MATERIALIZED VIEW CONCURRENTLY, bump dataVersion
    M->>A: open dashboard
    A->>D: read views (Dapper), scoped to the Manager's units
    A-->>M: figures with dataDate and data source (BR-14)
```

Other jobs: `ImportConfirmJob` writes a confirmed CSV or ECS file in one transaction; `RecomputeLineJob` recomputes one entitlement line after an edit; `RenewalFlagJob` flags "Renewal soon" and "Notice period passed" (UC04). Records that fail a check are rejected one by one, with the reason kept in `raw_records.normalize_error`; a record count that does not match `total_count` fails the whole run. All jobs are idempotent, never overlap, and run as `SystemUser`, so the audit actor is `system`.

## 6. Deployment view

```mermaid
flowchart TB
    browser["User browser"]

    subgraph env["Environment: dev / staging / prod"]
        direction TB
        subgraph host["Host or Docker Compose"]
            direction TB
            proxy["reverse-proxy<br/>[Nginx or Caddy]"]
            webfiles["web<br/>[static SPA build]"]
            apiN["api<br/>[Elms.Api, 1 instance]"]
            workerN["worker<br/>[Elms.Worker, 1 instance]"]
            pg[("postgres<br/>[PostgreSQL 16]")]
        end
        migrate["migration step<br/>[EF migration bundle]<br/>runs before apps start"]
    end

    ci["GitLab CI/CD<br/>[CI: build, test, architecture tests]"]
    prov["Providers<br/>[staging: Microsoft 365 developer tenant]"]

    browser -- "HTTPS" --> proxy
    proxy --> webfiles
    proxy -- "/api/*" --> apiN
    apiN --> pg
    workerN --> pg
    workerN -- "read-only" --> prov
    ci -- "build and deploy" --> host
    migrate --> pg
```

| Topic | Decision |
|---|---|
| Instances | One Api and one Worker; Hangfire's distributed lock prevents duplicate jobs |
| Migrations | A separate pipeline step before the apps start, never at application startup |
| Environments | dev (Docker Compose: postgres, api, worker, web), staging (Microsoft 365 developer tenant), prod |
| Operations | `/health`, structured logs with `request_id` (Serilog / OpenTelemetry), Hangfire dashboard for Admin only, alert when a source fails two days in a row |
| Backup targets | RPO ≤ 24 h, RTO ≤ 4 h (assumption, [05 §2](05-folder-structure.md)) |

## 7. Cross-cutting concerns

| Concern | Where it applies | Rule |
|---|---|---|
| Authentication | Api | Server-side cookie session via ASP.NET Core Identity; the account must be `ACTIVE`; lockout after 5 failures for 15 minutes (BR-18); disabling a user or changing a role deletes their sessions at once |
| Authorization | Api | Three independent checks per request: authentication (401), RBAC policy (403), data scope via `AccessScope` global query filter (404 outside scope). Hiding a button is not protection (BR-16) |
| Data scope | Api, Worker | Managers see only their P&Ls or departments; Employees get a dedicated DTO without price or cost; Admin sees connector status only, not record contents or connector settings (BR-16) |
| Audit | Api, Worker | An interceptor writes who, old value, new value, time, and reason to an append-only log (BR-15) |
| Missing data | Everywhere | `null` / `Unknown`, never 0 (BR-04); every figure carries source and confidence (BR-14) |
| Caching | Api | `HybridCache`, L1 in-memory; Redis only when the API scales to several instances. Keys include the user's scope; dashboard keys include `dataVersion` |
| Secrets | Worker | Connector credentials: read-only scope (BR-01), write-only after saving and never shown or exported (BR-20), encrypted with Data Protection, decrypted only by the worker |
| Errors | Api | One global `IExceptionHandler` returns `ProblemDetails` (RFC 9457) |

**Related:** [Connector standard](06-connector-standard.md) · [Folder structure and architecture](05-folder-structure.md) · [Database design](database/README.md) · [Use cases](02-use-cases.md)
