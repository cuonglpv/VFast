# 3. Context and Scope

## 3.1 Business context

ELMS sits between three roles and five data sources; every source is read, never written. The diagram, people table, and external-system table are the C4 Level 1 view: **[C1 System Context](../c4/01-system-context.md)**.

| Partner | Input to ELMS | Output from ELMS |
|---|---|---|
| Manager | Budget plan file (SAP Excel), cloud budget | Plan / Spend / Actual, waste, forecast of their units |
| Staff | Connectors, catalog, purchases file, exchange rates | Sync health, inventory |
| Admin | Roles, scope, Manager assignments | Users, organization |
| P&L license APIs | Licenses, terms, holders, activity, usage (ECS) | Read-only calls |
| ILVG | Employees, units, projects, transfers | Read-only calls |
| VinSOC | Application usage per employee and day | Read-only calls |

## 3.2 Technical context

| Channel | Protocol | Notes |
|---|---|---|
| Browser → ELMS | HTTPS; REST / JSON with cookie session and CSRF token | Same domain via reverse proxy, no CORS |
| ELMS → P&L APIs, ILVG, VinSOC | HTTPS, read-only, retry with Polly | Only `Elms.Worker` calls out |
| SAP → ELMS | Excel upload, preview, confirm | Idempotent by preview key (BR-33) |

## 3.3 Out of scope

ELMS does not assign, revoke, buy, or cancel anything at a provider, does not let anyone type licenses, holders, or usage by hand, and does not send e-mail or chat notifications ([Research §7](../../01-research-top-down.md)).
