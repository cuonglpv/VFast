# Enterprise License Management System (ELMS) — team VFast

ELMS brings the software licenses of every company of the group into one place. Each company connects its providers (Microsoft, Atlassian, Adobe, GitHub, SAP…) through usage connectors; ELMS reads who holds each license and how much is actually used, takes how many seats were bought, for which term, and at what cost from the purchases in SAP, and sets it against the budget plan. Managers see, for their units, the money planned, purchased, used, and wasted — down to each license and each user — **and ELMS never assigns, revokes, buys, or changes anything on a provider**.

## 1. Requirements — Research, Use Cases, and INVEST

Requirements are derived top-down: business problem → stakeholders → goals → license models and data sources → epics (mind map) → use cases → user stories. Each story is reviewed with INVEST and has Given/When/Then acceptance criteria.

### 1.1 Mind map

![ELMS mind map](docs/mindmap.png)

The map has seven branches: **License Management**, **Usage**, **Budget Management**, **Optimization**, **Analytics**, **User & Organization**, and **Connection Management**. Each leaf is a feature area of a use case — several leaves can belong to one use case: bold leaves are Must- and Should-have, plain leaves Could-have. UC10 View My Licenses and UC11 Login / Logout are self-service use cases every role has and are not on the map. Use cases are numbered in the order of the map.

Editable source: [`docs/mindmap/vfast.xmind`](docs/mindmap/vfast.xmind) (open with XMind); `docs/mindmap.png` is exported from it.

### 1.2 Top-down problem analysis

License and usage data are scattered across each provider's admin portal, and every provider counts in its own unit: seats, sessions, devices, cores, tokens, or contract terms. Nobody can say what the company owns, who uses it, or how far reality is from the budget plan.

| Goal | Measured by |
|---|---|
| G1 Centralize licenses | Every license of every company listed with provider, cost, allocated / purchased, and expiry in one list |
| G2 Know who uses what | Every assigned seat has exactly one status over the last 30 days — `Active`, `Inactive`, `No activity`, or `Not monitored` — and every holder a usage frequency |
| G3 Measure automatically | License, assignment, and usage data arrive through usage connectors on a schedule; nobody types them in |
| G4 Express waste as money | Underutilized accounts and their annual cost on one screen |
| G5 Plan and reconcile the budget | Plan, Purchased, and Used compared per unit, license, and month |
| G6 Make waste visible | Waste (the cost of unassigned and inactive seats) shown per unit, license, and month, with the units wasting most first |
| G7 Trustworthy figures | Numbers match across screens; missing data is `Unknown`, never zero |

What makes this project different:

1. **One view from group to user** — the same figures from the group down to a P&L, block, department, project, license, and the people holding it.
2. **Plan, Purchased, Used** — Plan − Purchased is unspent budget; Purchased splits into Used, Wasted, and Not evaluated; each gap is a different problem with a different fix.
3. **Missing data is not guessed** — a failed sync is `Unknown`, never usage 0, so it never creates a false waste finding.
4. **Read-only toward every source** — ELMS shows the evidence; changes to licenses are made at the source, never by ELMS.
5. **One connector contract** — every usage connector, one per company and provider, answers in the same license data contract; nothing enters ELMS without passing its validator.

Full analysis, license-model research, data-source feasibility, scope, and risks: [Top-down research](docs/01-research-top-down.md).

Research on a common connector standard (FOCUS, SCIM 2.0, ISO/IEC 19770, provider APIs), the ECS v1 proposal, and its rollout plan: [Connector standard](docs/06-connector-standard.md).

### 1.3 Use cases

There are four roles: the **Manager** uses the product, **Staff** keep it fed, the **Admin** decides who can do what, and the **Employee** sees their own licenses. One diagram per actor shows every use case it can start:

| | |
|---|---|
| ![Manager](docs/diagrams/out/uc_manager.png) | ![Staff](docs/diagrams/out/uc_staff.png) |
| ![Admin](docs/diagrams/out/uc_admin.png) | ![Employee](docs/diagrams/out/uc_employee.png) |

11 use cases, by mind-map branch. A use case is one large flow of action of one actor; its smaller branches and the cases it handles are flows and alternatives in its specification, not use cases of their own. Manager and Staff work within the units or companies assigned to them, and a Manager can be assigned to the whole group; the Admin sees no license or cost data. Analysis shows complete months only, up to the previous month.

| ID | Use case | What the user can do | Actor |
|---|---|---|---|
| | **License Management** | | |
| UC01 | View License Detail | See every license with its monthly cost, company, allocated / purchased and days to expiry, its term on a validity timeline, and its details; search, filter, sort, page; see who holds it, who is active or inactive, when each last used it and how often; list the terms of the PO lines and those renewing soon | Manager |
| UC02 | Browse License Inventory | See the licenses of a P&L or of any unit, the units that use a license, and the licenses of each provider; Staff also keep the software catalog, map license and application names to it, and mark shared licenses | Manager, Staff |
| | **Usage** | | |
| UC03 | View Plan vs Utilization Balance | Choose the unit to analyse; see its Plan, Purchased and Used, whether it is over budget, and how much of what was bought is used; compare the units below it, read their table and export it; see how often each employee uses each application | Manager |
| | **Budget Management** | | |
| UC04 | Manage Budget Plan | Managers import the budget plan of their units from Excel and see it by month and by version; Staff import the purchases from SAP, enter those made outside it, close the monthly accrual, and keep the exchange rates | Manager, Staff |
| | **Optimization** | | |
| UC05 | Track License Waste | See seats bought but given to nobody and seats not used for 30 days with what they cost; see the units wasting the most money first, those wasting more than 20 % flagged, and what causes it; follow Plan, Used and Wasted month by month, spot units where high spend meets high waste, and see in which months each unit wastes | Manager |
| | **Analytics** | | |
| UC06 | View Dashboards | See licenses, spending against plan with cost per unit and variance, and waste at a glance; read the same figures per license, software, category, provider or license type; look up what each figure means | Manager |
| | **User & Organization** | | |
| UC07 | Manage User Roles and Permissions | Give each user a role and a data scope, disable or re-enable access; grant or remove permissions per role | Admin |
| UC08 | Manage Organization Hierarchy | Review the five-level hierarchy and assign Managers to units | Admin |
| | **Connection Management** | | |
| UC09 | Manage Usage Connectors | See every company's connectors, providers and licenses with their sync status; create, read, edit, and delete a connector; follow sync runs, rerun a period, pause or resume a connector | Staff |
| | **Self-service** | | |
| UC10 | View My Licenses | See the licenses they hold and whether they use them | Everyone |
| UC11 | Login / Logout | Sign in and out, set the password from the link of the account email | Everyone |

Role × feature matrix, business rules, system processes, and the specification of every use case: [Use cases](docs/02-use-cases.md). Features per use case: [Feature list](docs/08-feature-list.md).

### 1.4 Roles and permissions

There are four roles; each account has exactly one. Every account belongs to a real employee and is created from ILVG with the role Employee; Admin then gives the role and scope.

| Role | Who | Responsibility | Data scope |
|---|---|---|---|
| **Manager** | Manager of a unit: the group, a P&L, block, department, or project — **the main user** | Browses licenses and who uses them, analyses usage and waste, imports and changes the budget plan of their units and of every unit under them, reads the dashboards | The units assigned to them and everything under them; the whole group for a Manager of the group |
| **Staff** | License management team member — hands-on work | Sets up and edits usage connectors, watches the syncs, checks what each company's connectors deliver, imports the purchases from SAP and enters those made outside it, runs the monthly accrual, records exchange rates and shared licenses, keeps the software catalog | The companies assigned to them; no usage or waste analysis |
| **Admin** | System operator | Gives each user a role and a data scope, sets the permissions of each role, keeps the organization hierarchy and which Manager owns which unit | Users, roles, permissions, and the hierarchy; no license, usage, budget, or cost data |
| **Employee** | Every employee of the group | Sees the licenses they hold and whether they are recorded as used | Own licenses only |

| Capability | Admin | Manager | Staff | Employee |
|---|---|---|---|---|
| License detail: list, timeline, details, users and usage, terms (UC01) | — | Read, own units | — | — |
| License inventory (UC02) | — | Read, own units | Read, own companies | — |
| License catalog: software, mapping, shared licenses (UC02) | — | Read; the share of shared licenses their units carry | Catalog and shared licenses: create / edit, group level; mapping: own companies | — |
| Plan vs utilization balance: scope, unit comparison, units table and export, employee usage (UC03) | — | Read, own units | — | — |
| Budget plan (UC04) | — | Import and read, own units and every unit under them | — | — |
| Purchases from SAP: PO lines and invoices (UC04) | — | — | Import from SAP / create / edit, own companies | — |
| Monthly accrual (UC04) | — | — | Run / close month, own companies | — |
| Exchange rates (UC04) | — | Read | Create / edit, group level | — |
| License waste: wasted seats, ranking, flag, and analytics (UC05) | — | Read, own units | — | — |
| Dashboards: cost per unit, plan variance, license and provider analysis, metric definitions (UC06) | — | Read, own units | — | — |
| User roles and permissions, organization hierarchy (UC07, UC08) | Edit | — | — | — |
| Usage connectors and sync runs (UC09) | — | — | Create / edit / delete, read / rerun / pause runs, own companies | — |
| My licenses (UC10) | Read own | Read own | Read own | Read own |

- The backend enforces every cell of this table and the data scope; hiding a button in the interface is not enough, and a call outside the role returns `403`.
- ELMS never writes to a provider: "edit" here changes data in ELMS only.
- Every change to connectors, budget imports, purchases, user roles and scopes, the hierarchy, and permissions is recorded with who, old value, new value, and time.

The full role × feature matrix with the business rules: [Use cases](docs/02-use-cases.md#role--feature-matrix).

### 1.5 INVEST requirements

The backlog contains **46 user stories (159 story points)**: 29 Must-have (113 points), 13 Should-have (37), 4 Could-have (9). Each story implements one use case; a use case too large for one story is split into several. Every story passes the INVEST review and has Given/When/Then acceptance criteria with concrete figures.

| Criterion | Meaning in ELMS |
|---|---|
| **Independent** | Each story produces a demonstrable outcome; usage, waste, and dashboard stories run on seeded data labelled as mock, without waiting for the P&L APIs. |
| **Negotiable** | Layout is left to the UI design and may change while outcome, permissions, and business rules stay fixed. |
| **Valuable** | Each story names the benefit for one role: Employee, Staff, Manager, or Admin. |
| **Estimable** | Inputs, outputs, roles, data scope, and failure outcomes are explicit; every story is estimated in points. |
| **Small** | One or more stories per use case; only US18 (budget import with versions and idempotency) reaches 8 points. |
| **Testable** | Every story has observable criteria, including rules that tie figures across use cases. |

```text
License Management     US01–US10 (UC01, UC02)         Manager (US09, US10: Staff)
Usage                  US11–US17 (UC03)               Manager
Budget Management      US18–US22 (UC04)               Manager (US20–US22: Staff)
Optimization           US23–US29 (UC05)               Manager
Analytics              US30–US36 (UC06)               Manager
User & Organization    US37–US39 (UC07, UC08)         Admin
Connection Management  US40–US44 (UC09)               Staff
Self-service           US45, US46 (UC10, UC11)        Every role
```

Backlog, per-story INVEST review, and acceptance criteria: [INVEST requirements](docs/03-invest-requirements.md).

## 2. Database design

The target schema is PostgreSQL, 40 tables in seven groups: organization and access, software catalog and licenses, collection pipeline, holders and usage, budget and expenses, optimization, audit. It follows the business model: a five-level organization from ILVG, one usage connector per company and provider, a license per connector and company mapped to the software catalog, budget versions imported from Excel, purchases (PO lines and invoices) imported from SAP, the cost of each month split into Used, Wasted, and Not evaluated, and BCA usage in its own table. Missing data is `Unknown`, never 0; history is kept as frozen daily snapshots and monthly cost allocations.

![Entity overview](docs/database/diagrams/erd_overview.png)

Entity overview, one ERD per group, a short explanation of every table, rule-to-schema traceability, and the decisions still to confirm (D24–D41): [Database design](docs/database/README.md). Source [`elms.dbml`](docs/database/elms.dbml), reference DDL [`schema.sql`](docs/database/schema.sql), draw.io files in [`docs/database/diagrams/`](docs/database/diagrams/).

## 3. Architecture and Folder Structures

ELMS is designed as one monolith with Clean Architecture, deployed as two processes (API and worker) that share one PostgreSQL database. The API serves users; slow work (connector syncs at each interval, budget and purchase imports, seat status, cost split, detection) runs in the worker through a PostgreSQL-backed job queue, so no Redis or message broker is required.

### 3.1 System context (C4 level 1)

```mermaid
flowchart TB
    users(["Employee / Staff / Manager / Admin"])
    elms["ELMS<br/>[Software system]<br/>Centralizes the licenses of every P&L, measures usage<br/>and waste in money, compares budget with reality"]
    pnl["P&L license APIs<br/>[External systems]<br/>one per company and provider:<br/>licenses, holders, usage"]
    ilvg["ILVG<br/>[External system]<br/>employees, units, projects"]
    bca["BCA<br/>[External system]<br/>application usage on company machines"]
    files["SAP files<br/>[Input]<br/>budget plan; PR, PO, and invoices"]

    users -- "HTTPS, role-based screens" --> elms
    elms -- "reads at each connector's interval<br/>[read-only connectors]" --> pnl
    elms -- "reads daily [read-only]" --> ilvg
    elms -- "reads daily [read-only]" --> bca
    files -. "Managers import the budget, Staff the purchases:<br/>preview, then confirm" .-> elms
```

Four roles use ELMS; each account has exactly one. Each P&L provides an API for its own license data; ELMS reads it through one usage connector per company and provider, at each connector's interval, in the license data contract (ECS), and never changes anything at a source. Employees and units come from ILVG, application usage from BCA, the budget plan from an Excel export of SAP, and the purchases — PO lines for seats and terms, invoices for cost — from another SAP export that Staff import each month, with a purchase made outside SAP entered by hand. Nobody enters licenses, holders, or usage by hand.

### 3.2 Container view (C4 level 2)

```mermaid
flowchart TB
    people(["Employee / Staff / Manager / Admin"])
    providers["P&L license APIs, ILVG, BCA<br/>[External]<br/>read-only APIs"]
    subgraph platform["ELMS [System boundary]"]
        direction TB
        web["Web Frontend<br/>[React + Vite SPA]"]
        api["Elms.Api<br/>[ASP.NET Core 10]<br/>Auth, RBAC, data scope"]
        worker["Elms.Worker<br/>[.NET Worker + Hangfire]<br/>Sync, import, seat status,<br/>cost split, detection"]
        db[("PostgreSQL 16<br/>data, queue, sessions")]
    end
    people --> web
    web -- "REST / JSON, cookie session" --> api
    api --> db
    worker --> db
    worker -- "read-only" --> providers
```

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, TypeScript, MUI v6, Tailwind CSS v4, ApexCharts |
| Backend | ASP.NET Core 10, EF Core + Dapper, Hangfire worker |
| Database | PostgreSQL 16 |

Deeper levels in [C4 Architecture](docs/07-c4-architecture.md): [components of the API, worker, modules, and frontend](docs/07-c4-architecture.md#3-level-3--component), [the sync and daily pipeline](docs/07-c4-architecture.md#5-dynamic-view--the-daily-pipeline), and [deployment](docs/07-c4-architecture.md#6-deployment-view).

### 3.3 Repository layout

```text
VFast/
├─ README.md
├─ docs/
│  ├─ 01 … 04               Research, use cases, INVEST, information architecture
│  ├─ 07, 08, 09            C4 architecture, feature list, data fields research
│  ├─ 05-folder-structure.md
│  ├─ 06-connector-standard.md
│  ├─ 07-c4-architecture.md
│  ├─ database/             elms.dbml, schema.sql, tables.md, ERDs
│  ├─ diagrams/out/         Use case diagrams
│  └─ mindmap/              XMind source
└─ src/
   ├─ frontend/             React SPA
   └─ backend/              .NET solution
```

### 3.4 Frontend

```text
src/frontend/
├─ routes/        paths.ts, router.tsx
├─ layouts/       Header, Sidebar, MainLayout
├─ components/    cards/, layout/, shared charts and icons
├─ sections/      licenses/, budget/  (feature blocks that compose pages)
├─ pages/         licenses/, budget/, analytics/, users/  (one per screen)
├─ types/  utils/  data/  theme/
└─ App.tsx, main.tsx, index.css
```

Call flow: `routes → pages → sections → components → types / utils`.

### 3.5 Backend

```text
ELMS/
├─ Elms.slnx, global.json, Directory.Build.props, Directory.Packages.props
├─ docker-compose.yml
├─ src/
│  ├─ SharedKernel.Domain/            BaseEntity, BaseAuditableEntity, Money
│  ├─ SharedKernel.Application/       Base Command/Query, Behaviours, Exceptions, AccessScope
│  ├─ SharedKernel.Infrastructure/    BaseDbContext, Audit + Scope interceptor
│  ├─ SharedKernel.Api/               BaseApiController, GlobalExceptionHandler
│  ├─ Elms.Domain/
│  │  ├─ Entities/<Module>/           Catalog, Usage, Finance, Optimization...
│  │  ├─ Enums/                       OrgLevel, Archetype, LicenseType, SeatStatus, ConnectorStatus
│  │  └─ Rules/                       SeatStatusRule, AccrualCalculator, CostAllocator, WasteFlagRule
│  ├─ Elms.Application/
│  │  ├─ Interfaces/                  IAppDbContext, ILicenseSource, IIlvgSource, IBcaSource
│  │  ├─ <Module>/<Feature>/          e.g. Catalog/Software, Finance/BudgetImports
│  │  │  └─ Commands/  Queries/  DTO/
│  │  ├─ Analytics/<Dashboard>/Queries/   Read views with Dapper
│  │  ├─ Ingestion/Pipeline/          Steps of a sync run: fetch, validate, normalize, coverage
│  │  └─ ConfigureServices.cs
│  ├─ Elms.Infrastructure/
│  │  ├─ Data/                        AppDbContext, Configurations/, Migrations/
│  │  ├─ Connectors/                  Ecs/ (P&L APIs), Ilvg/, Bca/, Simulated/
│  │  └─ ConfigureServices.cs
│  ├─ Elms.Api/                       Controllers/<Module>/, Program.cs
│  └─ Elms.Worker/                    Program.cs, Jobs/ (sync scheduler, connector run, daily pipeline, month close)
└─ tests/                             Unit, Integration (Testcontainers), Architecture
```

Dependency direction: `Api / Worker → Infrastructure → Application → Domain → SharedKernel`. The eight business modules (`identity`, `organization`, `catalog`, `ingestion`, `usage`, `finance`, `optimization`, `analytics`, plus shared `audit`) are feature folders inside each layer; boundaries are enforced by architecture tests.

Full trees, module table, API conventions, jobs, caching, security, and deployment: [Folder structure and architecture](docs/05-folder-structure.md). The same design as C4 diagrams (context, container, component, daily pipeline, deployment): [C4 Architecture](docs/07-c4-architecture.md).

## Documentation

- [Top-down research](docs/01-research-top-down.md) — problem, stakeholders, goals, license models, data sources, process, epics, scope, risks
- [Use cases](docs/02-use-cases.md) — actors, role × feature matrix, business rules, system processes, 11 use cases
- [INVEST requirements](docs/03-invest-requirements.md) — 46 user stories, INVEST review, acceptance criteria
- [Information architecture](docs/04-information-architecture-manager.md) — screen catalog, navigation by role, screen specifications, UI conventions, screen-to-API mapping
- [Folder structure and architecture](docs/05-folder-structure.md) — solution architecture, frontend structure, backend modules and .NET folder layout, API conventions, jobs, caching, security
- [Connector standard](docs/06-connector-standard.md) — research on FOCUS, SCIM, ISO/IEC 19770 and provider APIs; the ELMS Connector Standard (ECS) v1 proposal, Connector Management use cases, rollout plan
- [C4 Architecture](docs/07-c4-architecture.md) — system context, containers, components, daily pipeline, deployment, cross-cutting concerns
- [Feature list](docs/08-feature-list.md) — features of every use case, by mind-map branch
- [Data fields research](docs/09-data-fields-research.md) — fields each source can return: usage connectors, BCA, ILVG, budget file
- [Database design](docs/database/README.md) — conventions, entity overview, ERD per group, every table explained, rule-to-schema traceability, proposed decisions D24–D41; every field in [Tables and fields](docs/database/tables.md)

## Frontend development

The frontend application, configuration, dependencies and lockfiles are in [src/frontend](src/frontend/README.md). From the repository root, install its dependencies once and start the dev server:

```powershell
npm --prefix src/frontend install
npm run dev
```

`npm run build` and `npm run preview` also work from the repository root. The root scripts forward to `src/frontend`; the build output is `src/frontend/dist/`.
