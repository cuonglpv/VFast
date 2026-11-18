# 7. Deployment View

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
            lakeN[("data lake<br/>[technology TBD]")]
        end
        migrate["migration step<br/>[EF migration bundle]<br/>runs before apps start"]
    end

    ci["CI/CD<br/>[build, test, architecture tests]"]
    src["P&L APIs, ILVG, VinSOC<br/>[dev: simulated P&L API;<br/>staging: a P&L test API]"]

    browser -- "HTTPS" --> proxy
    proxy --> webfiles
    proxy -- "/api/*" --> apiN
    apiN --> pg
    workerN --> pg
    workerN -- "raw files" --> lakeN
    workerN -- "read-only" --> src
    ci -- "build and deploy" --> host
    migrate --> pg
```

| Topic | Decision |
|---|---|
| Instances | One Api and one Worker; Hangfire's distributed lock prevents duplicate jobs |
| Migrations | A separate pipeline step before the apps start, never at application startup |
| Environments | dev (Docker Compose: postgres, a local data lake, api, worker, web, a simulated P&L API), staging (a P&L test API), prod |
| Operations | `/health`, structured logs with `request_id` (Serilog / OpenTelemetry), Hangfire dashboard for Admin only, alert when a connector stays `Failed` or `Delayed` for a day |
| Backup targets | RPO ≤ 24 h, RTO ≤ 4 h (assumption, [05 §2](../../05-code-structure.md)) for PostgreSQL; data lake retention to be set with its technology |
