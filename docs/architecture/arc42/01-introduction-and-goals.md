# 1. Introduction and Goals

ELMS (Enterprise License Management System) brings the software licenses of every company of the group, cloud services included, into one place. It reads who holds each license and how much is used from each P&L's license API, takes employees and units from ILVG, application usage from VinSOC, the budget plan and purchases from SAP exports, and shows each Manager **Plan, Spend, and Actual** for their units, with a forecast of where the year will land. **ELMS never assigns, revokes, buys, or pays for anything** (BR-01).

## 1.1 Requirements overview

| Use case | Goal | Actor |
|---|---|---|
| UC01 View License Detail | Every license of my units: cost, allocation, expiry, users | Manager |
| UC02 Maintain License Inventory | Check delivered licenses, keep catalog, shared licenses, cloud accounts | Staff, Manager |
| UC03 Track License Waste | Judge waste from Plan, Spend, Actual, and seat status | Manager |
| UC04 Track Cloud Costs and Usage | Cloud Plan, Spend, Actual by unit, provider, service | Manager |
| UC05 Manage Budget Plan | Plan and cloud budget; purchases imported each month | Manager, Staff |
| UC06 Forecast Spending | Year-end landing and coming bills | Manager |
| UC07 View Dashboards | Licenses, spending, usage at a glance | Manager |
| UC08–UC09 | User accounts and access; organization hierarchy | Admin |
| UC10 Manage Data Connectors | Connect sources, keep syncs healthy | Staff, Manager |
| UC11 Login / Logout | Sign in and out within my own scope | Admin, Manager, Staff |

Details: [Use cases](../../02-use-cases.md) · [INVEST requirements](../../03-invest-requirements.md) · [Feature list](../../08-feature-list.md).

## 1.2 Quality goals

| # | Quality goal | Scenario (short) |
|---|---|---|
| Q1 | Trustworthy figures | Numbers match across screens; missing data is `Unknown`, never 0 (BR-04, G7) |
| Q2 | Confidentiality and data scope | A Manager sees only their unit and below; Staff only their Manager's units; Admin no cost (BR-14) |
| Q3 | Read-only safety | No call changes anything at a source; credentials are write-only (BR-01, BR-18) |
| Q4 | Performance | Dashboards p95 < 1 s, lists p95 < 500 ms |
| Q5 | Maintainability | One monolith, layers enforced by architecture tests; a new P&L needs no new code (one ECS client) |

Full scenarios: [§10 Quality requirements](10-quality-requirements.md).

## 1.3 Stakeholders

| Role | Expectation |
|---|---|
| Manager (one unit: a P&L or below) | Plan / Spend / Actual and waste of their units, in money |
| Staff (license management team, working for one Manager) | Healthy connectors, a clean catalog, purchases and accrual on time |
| Admin | Roles, data scope, organization; no business data |
| P&L IT teams | One license data contract (ECS) to implement, read-only access |
| Development team | Clear boundaries, one stack, docs that match the code |

Source: [Research §2–3](../../01-research-top-down.md).
