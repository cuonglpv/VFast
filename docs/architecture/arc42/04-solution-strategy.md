# 4. Solution Strategy

| Quality goal | Approach | Details |
|---|---|---|
| Q1 Trustworthy figures | One daily pipeline computes seat status, cost split, and snapshots, then refreshes the views every screen reads; `null` + reason instead of 0 | [§6](06-runtime-view.md), [§8](08-crosscutting-concepts.md) |
| Q2 Data scope | Three checks per request: authentication, RBAC policy, `AccessScope` query filter | [§8](08-crosscutting-concepts.md) |
| Q3 Read-only safety | Only the Worker calls sources, with read-only credentials encrypted by Data Protection; raw responses land in the data lake before processing | [C2](../c4/02-container.md) |
| Q4 Performance | Writes through EF Core, reads through Dapper over materialized views; HybridCache keyed by scope and `dataVersion` | [Code structure §7](../../05-code-structure.md#7-caching) |
| Q5 Maintainability | Monolith with Clean Architecture; modules are folders checked by NetArchTest; one generic ECS client for every P&L | [C3](../c4/03-component.md) |

## Technology decisions

| Area | Choice |
|---|---|
| Shape | One monolith, two processes: `Elms.Api` (users) and `Elms.Worker` (slow jobs), one PostgreSQL, plus a data lake for raw source data |
| Frontend | React SPA organized by feature (`features/<area>`), with every API call in `services/` and reused UI in `shared/`, decomposed from UI demo v90 ([C4 Code](../c4/04-code.md)) |
| Integration | Pull on a schedule (each connector's interval, 6 h by default; ILVG and VinSOC daily) |
| Auth | ASP.NET Core Identity, server-side cookie session |

The reasons and the alternatives are in [§9 Architecture Decisions](09-architecture-decisions.md).
