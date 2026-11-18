# 2. Architecture Constraints

## 2.1 Technical

| Constraint | Background |
|---|---|
| Frontend: React 19, Vite, TypeScript, MUI v6, Tailwind CSS v4, ApexCharts, React Router v7, axios | Team skills; already used in `src/frontend` |
| Backend: ASP.NET Core 10 (.NET 10 LTS), EF Core 10 + Npgsql, Dapper, Hangfire | Team skills, LTS support |
| Database: PostgreSQL 16 (data, job queue, sessions); raw source data in a data lake (technology TBD) | No Redis or broker; raw data kept apart from processed data |
| Delivery: Docker (Compose in dev), Nginx or Caddy, GitHub Actions | Simple self-hosted deployment |
| API contract: OpenAPI; TypeScript client generated with `openapi-typescript` | Frontend and backend stay in sync |

## 2.2 Organizational and data

| Constraint | Background |
|---|---|
| Every connection is read-only; credentials are write-only | BR-01, BR-18 |
| Each P&L provides its own API in the license data contract (ECS) | BR-17, [Connector standard](../../06-connector-standard.md) |
| The organization has exactly four levels, taken from ILVG | BR-19 |
| A holder is a person, matched to ILVG by employee code, else by email | BR-25 |
| Budget plan and purchases arrive as SAP Excel exports in the ELMS template | No direct SAP integration in the MVP |
| Each account has exactly one role | BR-15 |

## 2.3 Conventions

- Documentation: arc42 + C4 (Mermaid), English, one source of truth per fact; rules referenced by `BR-xx`, use cases by `UCxx`.
- Code: Clean Architecture on the backend, feature folders on the frontend ([Code structure](../../05-code-structure.md)).
- API: `/api/v1/<module>/<resource>`, `ProblemDetails` errors ([Code structure §5](../../05-code-structure.md#5-api-conventions)).
