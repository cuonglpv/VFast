# C4 Level 3 — Component

> **Status:** TARGET · **Audience:** developers

## 1. Elms.Api and Elms.Worker

Both processes are built from the same Clean Architecture layers and run the same handlers. `Controllers/` exist only in the Api and `Jobs/` only in the Worker. Modules are feature folders inside each layer, not separate projects; boundaries are kept by namespaces and architecture tests (NetArchTest).

```mermaid
flowchart TB
    spa["Web Frontend"]
    db[("PostgreSQL 16")]
    lake[("Data Lake")]
    sources["P&L APIs, ILVG, VinSOC"]

    subgraph hosts["Hosts"]
        direction LR
        ctrl["Controllers<br/>[Elms.Api]<br/>/api/v1/module/resource"]
        jobs["Jobs<br/>[Elms.Worker, Hangfire]<br/>SyncSchedulerJob, ConnectorRunJob,<br/>IlvgSyncJob, VinSocSyncJob, DailyPipelineJob,<br/>ImportConfirmJob, MonthCloseJob"]
    end

    subgraph app["Elms.Application"]
        direction TB
        pipe["Pipeline behaviours<br/>logging, validation, authorization"]
        handlers["Command and query handlers<br/>one folder per use case"]
        analytics["Dashboard and Usage queries<br/>read views with Dapper"]
        ingest["Sync run steps<br/>fetch, land raw in data lake, record metadata,<br/>validate, normalize, coverage"]
        ecsval["Contract validator<br/>JSON Schema and rules (BR-17)"]
        ifaces["Interfaces<br/>IAppDbContext, IRawDataStore, ILicenseSource,<br/>IIlvgSource, IVinSocSource"]
    end

    subgraph domain["Elms.Domain"]
        direction TB
        entities["Entities and enums<br/>OrgLevel, Archetype, LicenseType,<br/>SeatStatus, ConnectorStatus"]
        rules["Business rules<br/>SeatStatusRule, AccrualCalculator,<br/>CostAllocator, WasteFlagRule"]
    end

    subgraph infra["Elms.Infrastructure"]
        direction TB
        efctx["AppDbContext<br/>EF Core 10 + Npgsql, audit and scope interceptor"]
        ecshttp["EcsClient<br/>every P&L license API"]
        hr["IlvgClient, VinSocClient"]
        sim["SimulatedSource<br/>mock data for a P&L without an API (BR-12)"]
        lakestore["DataLakeStore<br/>raw file read / write"]
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
    ifaces -. "implemented by" .-> hr
    ifaces -. "implemented by" .-> sim
    ifaces -. "implemented by" .-> lakestore
    lakestore -- "raw files" --> lake
    efctx -- "SQL" --> db
    ecshttp -- "read-only HTTPS" --> sources
    hr -- "read-only HTTPS" --> sources
    entities -. "built on" .-> kernel
    rules -. "built on" .-> kernel
```

Dependency direction: `Api / Worker → Infrastructure → Application → Domain → SharedKernel`. Domain depends on nothing; Application depends on interfaces only; only Infrastructure references EF Core, Npgsql, the HTTP clients, and the data lake store.

Request flow: controller → `Mediator.Send` → behaviours (log, validate, authorize) → handler → `IAppDbContext` (filtered by `AccessScope`) → interceptor writes the audit log. Worker flow: Hangfire job → handler or pipeline step → `ILicenseSource` / `IAppDbContext`.

## 2. Business modules

Eight business modules follow the mind-map branches, plus a shared `audit` module. A module owns its tables (one Postgres schema each) and other modules read them only through a service or a public view.

```mermaid
flowchart LR
    identity["identity<br/>UC08, UC11<br/>accounts, roles, permissions, sessions"]
    organization["organization<br/>UC09, ILVG sync<br/>four-level tree, employees, projects,<br/>Manager and Staff scope, holder identity"]
    catalog["catalog<br/>UC01, UC02<br/>software catalog, licenses, terms,<br/>owner unit, shared licenses"]
    ingestion["ingestion<br/>UC10<br/>connectors, sync runs, coverage,<br/>raw records, budget and purchase imports"]
    usage["usage<br/>UC01, UC03<br/>assignments, usage records, snapshots,<br/>seat status, VinSOC usage"]
    finance["finance<br/>UC05, UC06, UC07<br/>budget versions, purchases, accrual,<br/>rates, cost split"]
    optimization["optimization<br/>UC03<br/>detection, waste flag, waste analysis"]
    analytics["analytics<br/>UC07<br/>read models only"]
    audit["audit (shared)<br/>BR-13<br/>append-only audit log"]

    ingestion -- "normalize into" --> catalog
    ingestion -- "normalize into" --> usage
    ingestion -- "budget, purchases into" --> finance
    finance -. "reads seat counts" .-> usage
    optimization -. "reads only" .-> usage
    optimization -. "reads only" .-> finance
    optimization -. "reads only" .-> catalog
    analytics -. "reads" .-> optimization
    analytics -. "reads" .-> finance
    analytics -. "reads" .-> usage
    analytics -. "reads" .-> catalog
    identity -- "AccessScope" --> organization
```

Dependency rules, enforced by NetArchTest (from [Code structure §4.4](../../05-code-structure.md#44-modules)):

- `analytics` may read every module; no module depends on `analytics`.
- `optimization` reads `usage`, `finance`, and `catalog` and never writes to them.
- `finance` reads seat counts from `usage` to split the cost; `usage` never reads money.
- `ingestion` writes raw data, then calls `catalog`, `usage`, and `finance` to normalize; no business module calls a source directly.
- Only `identity` and `organization` decide access; other modules receive an `AccessScope`.
- Every module writes through the audit interceptor, which is why `audit` has no drawn arrows.

Every P&L answers in the license data contract (ECS), so one client reads every usage connector through `ILicenseSource`: `fetchLicenses`, `fetchTerms`, `fetchHolders`, `fetchActivity`, `fetchUsage(period)`. Each dataset arrives in an envelope that carries `completeness`, `granularity`, and `total_count`. A dataset a P&L cannot supply is `NotSupported` (HTTP 501, `ecs:not-supported`), never an empty list, so "no source" stays distinct from "source reports zero" (BR-04). Details: [Connector standard](../../06-connector-standard.md).

## 3. Web Frontend

```mermaid
flowchart TB
    subgraph app["app/"]
        direction LR
        router["router, paths, RequireRole"]
        layout["layout<br/>MainLayout, Topbar, sidebar"]
    end

    subgraph features["features/ — one folder per business area"]
        direction LR
        auth["auth<br/>UC11"]
        usage["usage<br/>UC03"]
        licenses["licenses<br/>UC01"]
        budget["budget<br/>UC05, UC06"]
        cloud["cloud<br/>UC04"]
        connectors["connectors<br/>UC10"]
        admin["admin<br/>UC08, UC09"]
    end

    subgraph shared["shared/"]
        direction LR
        ui["components<br/>KpiCard, charts, table, filters, feedback"]
        hooks["hooks<br/>useOrgScope, usePagination, useCsvExport"]
        misc["types, utils"]
    end

    config["config/<br/>env.ts, api.ts: API prefix,<br/>XSRF names, timeout"]

    subgraph services["services/"]
        direction LR
        http["apiClient.ts<br/>axios instance: /api/v1, cookie, XSRF,<br/>interceptors → ApiError, 401 → login"]
        svc["&lt;module&gt;/&lt;module&gt;Service.ts<br/>auth, org, usage, license, budget,<br/>cloud, connector, user"]
    end

    apiNode["Elms.Api<br/>[Container]"]

    router -- "lazy-loads pages via index.ts" --> features
    layout --> auth
    features -- "imports" --> shared
    features -- "hooks import a service" --> svc
    shared -- "useOrgScope" --> svc
    svc --> http
    http -- "apiConfig" --> config
    http -- "REST / JSON" --> apiNode

    classDef feat fill:#2F7FC1,stroke:#0F67B1,color:#fff
    classDef sh fill:#94A3B8,stroke:#475569,color:#0F172A
    class auth,usage,licenses,budget,cloud,connectors,admin feat
    class ui,hooks,misc,http,svc,config sh
```

Flow: `Page / Component → Feature Hook → Feature Service → apiClient → ASP.NET Core API`; inside a feature only `hooks/` import a service (`services/<module>/<module>Service.ts → apiClient.ts`). A feature imports `services/` and `shared/`, never another feature; `app/` is the only place that knows every feature. Target tree, routes, and role → feature rules: [Code structure §3](../../05-code-structure.md#3-frontend). Each feature zoomed in: [C4 Code](04-code.md#1-web-frontend). Screen catalog and API calls: [Information architecture](../../04-information-architecture-manager.md).

## 4. PostgreSQL

Not drawn as components: the container is described by its seven table groups (organization and access, software catalog and licenses, collection pipeline, holders and usage, budget and expenses, optimization, audit). See [Database design](../../database/README.md) for the ERDs.

---

[← C2 Container](02-container.md) · [C4 index](README.md) · [C4 Code →](04-code.md)
