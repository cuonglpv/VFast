# Feature List

> Design status: TARGET (November 2026)
>
> Implementation status: NOT STARTED

Features of the [use cases](02-use-cases.md), by mind-map branch and use case. Each feature is derived from a flow or a rule of the use case specification, not from a screen: when a screen changes, the use case is updated first and this list follows it.

### License Management

| ID | Feature | Use case | Flow | Actors |
|---|---|---|---|---|
| F01 | License list: name, provider, company, monthly cost accrued from the invoices, allocated / purchased with the allocation rate, expiry date and days to expiry with its bucket, data date | UC01 | Main | Manager |
| F02 | License list search (license, provider, company), filters (company, expiry bucket), sort (expiry, name, monthly cost, allocation rate, purchased quantity), count of matches, clear filters | UC01 | Main | Manager |
| F03 | Validity of each license term over a period moved back and forth: today, expiry bucket, final 7 days, terms running past or outside the period | UC01 | A | Manager |
| F04 | License details: cost, start, expiry, expiry status, allocated / purchased, unallocated or over-allocated quantity | UC01 | B | Manager |
| F05 | License users: seat counts (allocated, active, inactive, not monitored, unallocated) as filters; holders with emails, unit, status, last used, days used against working days or `Not tracked`; period choice; search, sort, CSV export; shared and service accounts apart; `Holder moved` | UC01 | C | Manager |
| F06 | License terms from the SAP PO lines: PO, start, expiry, quantity, cost; filter by vendor, company, renewal within 30 or 60 days | UC01 | D | Manager |
| F07 | License inventory per unit, grouped by provider, with purchased, assigned, used, cost, status, and expiry | UC02 | Main | Manager, Staff |
| F08 | Units per license, with their share | UC02 | A | Manager, Staff |
| F09 | Providers with their licenses and the companies using each; quantities per license only | UC02 | B | Manager, Staff |
| F10 | Software catalog: software, provider, category, subcategory; create, edit, merge | UC02 | C | Staff |
| F11 | License name mapping to the catalog: names not mapped, suggestion by provider and name, one mapping for every company; unmapped names under *Uncategorized*; the SAP name of a license | UC02 | D | Staff |
| F12 | BCA application name mapping to the catalog | UC02 | E | Staff |
| F13 | Shared licenses: *possibly shared* proposals, confirmation makes the group the owner, charge-back per company by the seats its people hold, unassigned seats in *Unallocated* of the group; open months only | UC02 | F | Staff; Manager reads its share |

### Usage

| ID | Feature | Use case | Flow | Actors |
|---|---|---|---|---|
| F14 | Plan, Purchased, and Used of the scope on one scale; over or under budget with the amount; utilization with Used, Wasted, Not evaluated | UC03 | Main | Manager |
| F15 | Period: year to date, one month, or a year; complete months only, up to the previous month | UC03 | Main, B | Manager |
| F16 | Scope over the hierarchy Group > P&L > Block > Department > Project > License, with *Unallocated* and *Unknown unit*; search a unit; path back to the group; starts at the Manager's highest unit; limited to the Manager's units | UC03 | A | Manager |
| F17 | Scope shareable as a link | UC03 | A | Manager |
| F18 | Comparison of the units below: Plan beside Purchased split into Used, Wasted, Not evaluated; search with count; order (waste, name, plan, used, utilization); year; currency VND or USD; select a unit to go down | UC03 | B | Manager |
| F19 | Figure card of a unit and period: Plan, Purchased (% of plan), Used and Wasted (% of purchased) | UC03, UC05 | B | Manager |
| F20 | Annual trend per unit: monthly Plan beside Purchased split, utilization for the year, year totals | UC03 | B | Manager |
| F21 | Table of the units below: rank, level, Plan, Purchased, Used, Wasted, utilization, variance vs plan (licenses planned above left out) | UC03 | C | Manager |
| F22 | Waste per license and month for a unit, as a rate or in money; license rows add up to the unit; shared licenses marked; open a license | UC03 | C | Manager |
| F23 | Export of the units listed, with the license rows opened, readable in Excel with Vietnamese text | UC03 | C | Manager |
| F24 | Employee usage from BCA: members, applications, days used, last used; filters; per employee and per application; applications without a license | UC03 | D | Manager |

### Budget Management

| ID | Feature | Use case | Flow | Actors |
|---|---|---|---|---|
| F25 | Budget plan Excel template | UC04 | Main | Manager |
| F26 | Budget import for a target unit and months, by the Manager of the unit or of any larger unit; preview with rows to add, replace, remove, and reject; a new version on confirm; only the licenses in the file change; idempotent (BR-33); a line's license found by its SAP name | UC04 | Main | Manager |
| F27 | Shared licenses planned by the group per P&L or deeper; P&L Managers change the lines of their units | UC04 | Main | Manager |
| F28 | Monthly plan, quantity and amount, grouped by P&L, block, or project; version compare; lines marked with the import that changed them | UC04 | A | Manager |
| F29 | Purchases: monthly import of the PR, PO lines, and invoices exported from SAP, idempotent by PO and invoice number; preview; hand entry of a purchase made outside SAP and its invoice | UC04 | B | Staff |
| F30 | Monthly accrual of each term from its invoices, rounding to the thousand VND, month close, export for finance | UC04 | C | Staff |
| F31 | Exchange rates per currency from a date; rate of the invoice date applied; corrections only for open months | UC04 | D | Staff |

### Optimization

| ID | Feature | Use case | Flow | Actors |
|---|---|---|---|---|
| F32 | Unassigned seats with their monthly and yearly cost and a total | UC05 | Main | Manager |
| F33 | Inactive seats (30 days without use) with their monthly and yearly cost and a total; leavers, `Holder moved`, shared and service accounts apart | UC05 | A | Manager |
| F34 | Units ranked by Wasted: Purchased split into Used and Wasted, waste rate; first 10, all on request | UC05 | B | Manager |
| F35 | Waste flag above 20 % of Purchased, wherever the unit appears, with the units and licenses that cause it | UC05 | B, C | Manager |
| F36 | Ranking by waste from the Manager's highest unit | UC05 | Trigger | Manager |
| F37 | Monthly trend of Plan, Used, and Wasted on one scale, over the units listed after the search, with their count; current month left out | UC05 | D | Manager |
| F38 | Units placed by Purchased and waste rate against the medians; high spend with high waste highlighted | UC05 | E | Manager |
| F39 | Waste per unit and month of a chosen year, first 12 units, all on request | UC05 | F | Manager |
| F40 | One choice between waste rate and wasted amount for the waste per unit and per license | UC05, UC03 | F | Manager |

### Analytics

| ID | Feature | Use case | Flow | Actors |
|---|---|---|---|---|
| F41 | License dashboard: totals, by category, type, and provider; purchased, assigned, used; expiring within 30 days; top applications by holder status | UC06 | Main | Manager |
| F42 | Financial dashboard: yearly spend, spend by month, plan against actual | UC06 | Main | Manager |
| F43 | Optimization dashboard: waste, utilization, Not evaluated, unassigned and inactive seats, flagged units | UC06 | Main | Manager |
| F44 | Cost per unit: per license total cost, seats, cost per seat, cost per unit; cost per department | UC06 | A | Manager |
| F45 | Monthly plan variance with year-to-date total and the licenses that explain it | UC06 | B | Manager |
| F46 | Analysis by license, software, category, provider, license type; split by unit; two periods; export | UC06 | C | Manager |
| F47 | Metric definitions: formula, unit, source, period rule, exclusions; available wherever the metric appears | UC06 | D | Manager |

### User & Organization

| ID | Feature | Use case | Flow | Actors |
|---|---|---|---|---|
| F48 | Accounts from ILVG: one per employee with the role Employee, one-time password link by email, leavers disabled | UC07 | System | System |
| F49 | Role and data scope per user (Manager units, Staff companies); disable and re-enable access | UC07 | Main | Admin |
| F50 | Roles with their users | UC07 | A | Admin |
| F51 | Permissions per role and feature, read or write, changed with a reason | UC07 | B | Admin |
| F52 | Organization hierarchy, Manager assignment, corrections, inactive units, unmatched codes | UC08 | Main | Admin |

### Connection Management

| ID | Feature | Use case | Flow | Actors |
|---|---|---|---|---|
| F53 | Connector overview: number of companies, providers, licenses, and sync issues | UC09 | Main | Staff |
| F54 | Connectors per company, provider, and license with coverage, API contact, created, last sync, status; search, filters (company, provider, status), order | UC09 | Main | Staff |
| F55 | Create a connector: company, provider, API contact and email, HTTPS API URL, API key or bearer token, sync interval in hours (6 by default), at least one license; name generated; licenses `Pending` until the first sync | UC09 | A | Staff |
| F56 | Connection test before save | UC09 | A, B | Staff |
| F57 | Edit a connector: credential kept unless provider or authentication changes; reconfiguring sets its licenses back to `Pending` | UC09 | B | Staff |
| F58 | Delete a connector: confirmation naming its licenses, sync stops, licenses inactive, collected data kept for past months | UC09 | B | Staff |
| F59 | Connector details without the credential | UC09 | C | Staff |
| F60 | Sync monitoring: runs with records received, accepted, rejected; reasons; run now, rerun a period; pause and resume, every skipped run recorded as `Paused` | UC09 | D | Staff |

### Self-service

| ID | Feature | Use case | Flow | Actors |
|---|---|---|---|---|
| F61 | My licenses across all my emails | UC10 | Main | Everyone |
| F62 | Login / logout, starting point by role | UC11 | Main | Everyone |
| F63 | Set and reset the password with a one-time link to the account email | UC11 | A | Everyone |

**Count:** 63 features.
