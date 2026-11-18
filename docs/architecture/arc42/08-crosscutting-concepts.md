# 8. Cross-cutting Concepts

| Concern | Where it applies | Rule |
|---|---|---|
| Authentication | Api | Server-side cookie session via ASP.NET Core Identity; the account must be active; lockout after 5 failures for 15 minutes (BR-16); disabling a user or changing a role deletes their sessions at once |
| Authorization | Api | Three independent checks per request: authentication (401), RBAC policy (403), data scope via `AccessScope` global query filter (404 outside scope). Hiding a button is not protection (BR-14) |
| Data scope | Api, Worker | Managers see their unit and everything under it, a P&L at most; Staff see the units of the Manager they work for; Admin reads users, roles, permissions, and the hierarchy only (BR-14) |
| Idempotency | Api, Worker | Syncs upsert by source key and data date; a budget confirm is keyed by its preview key; the same budget file again is `unchanged` (BR-33) |
| Audit | Api, Worker | An interceptor writes who, old value, new value, time, and reason to an append-only log (BR-13) |
| Missing data | Everywhere | `null` / `Unknown`, never 0 (BR-04); every figure carries its source (BR-12); complete months only (BR-28) |
| Caching | Api | `HybridCache`, L1 in-memory; Redis only when the API scales to several instances. Keys include the user's scope; dashboard keys include `dataVersion` |
| Secrets | Worker | Connector credentials: read-only scope (BR-01), write-only after saving and never shown or exported (BR-18), encrypted with Data Protection, decrypted only by the worker |
| Errors | Api | One global `IExceptionHandler` returns `ProblemDetails` (RFC 9457) |

## Frontend

| Concern | Rule |
|---|---|
| Role-based navigation | `RequireRole` and `MainRail` read the role from `AuthContext`; the API still enforces `403` |
| Scope in the URL | `useOrgScope` keeps the selected units in `?scope=` so a link reproduces the view (P2) |
| Missing data | Components render `Unknown` / `No data yet`, never 0; `MockDataBadge` on mock figures (BR-04, BR-12) |
| Configuration | `config/` holds the API prefix, timeout, XSRF names, and every `VITE_*` variable; only `config/env.ts` reads `import.meta.env` |
| API calls | Only `services/` calls the API through one axios instance in `apiClient.ts`, built from `config/api.ts`; flow `Page / Component → Feature Hook → Feature Service → apiClient → API`: `withCredentials`, `XSRF-TOKEN` cookie → `X-XSRF-TOKEN` header, interceptor maps `ProblemDetails` → `ApiError` and `401` → login |
| Tables | One `DataTable` + `Pagination` (10 / 20 / 50 rows) and server-side paging |
