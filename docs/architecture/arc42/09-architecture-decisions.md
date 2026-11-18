# 9. Architecture Decisions

Short ADRs: each records the decision, the alternative, and when to revisit it. Sources: [Code structure §2](../../05-code-structure.md#2-solution-architecture), [C2](../c4/02-container.md).

| # | Decision | Alternative | Revisit when |
|---|---|---|---|
| ADR-01 | Monolith: one `Elms.Api` + one `Elms.Worker` | Microservices | Several teams edit one codebase, or ingestion needs its own scaling |
| ADR-02 | PostgreSQL for data, queue, and session; no Redis or broker | Add Redis or a broker | The job queue becomes a bottleneck |
| ADR-03 | Scheduled sync at each connector's interval (6 h default) | Realtime events | P&L APIs push changes and users need same-hour numbers |
| ADR-04 | Clean Architecture, modules as folders | Module-first modular monolith | A module must become its own service |
| ADR-05 | EF Core to write, Dapper over views to read | EF Core only | Too many views to keep in sync with the schema |
| ADR-06 | Cookie session | JWT | A mobile app or third-party API is needed |
| ADR-07 | One `AppDbContext`, one schema per module | One DbContext per module | A module is split out |
| ADR-08 | One generic ECS client for every P&L API | One connector per provider | A P&L cannot implement the contract |
| ADR-09 | Frontend organized by feature (`features/<area>` with its pages, components, hooks, types); `shared/` only for what two features use; no imports between features | Layered folders (`pages/`, `sections/`, `components/`) | Features start sharing so much that `shared/` dominates |
| ADR-10 | React Context for session; no global state library | Zustand / Redux | Cross-page client state grows beyond auth and scope |
| ADR-11 | Every API call in `services/` (one axios instance in `apiClient.ts`, one folder per module with its `<module>Service.ts`) that any file imports | An `api.ts` inside each feature | A service grows big enough that one feature owns it alone |
| ADR-12 | axios for HTTP: `withCredentials`, built-in XSRF cookie → header, interceptors for `401` and `ProblemDetails` | `fetch` wrapper, or `openapi-fetch` | Bundle size matters, or the generated typed client replaces hand-written services |
| ADR-13 | Raw source data lands in a data lake first; the worker processes it and writes only the result to PostgreSQL, behind `IRawDataStore` | Raw payloads in PostgreSQL (`raw_records.payload`) | Lake technology chosen; volume or retention outgrows the database |
