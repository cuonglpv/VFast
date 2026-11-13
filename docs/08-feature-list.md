# Feature List

> Design status: TARGET (agreed 13 November 2026)
>
> Implementation status: NOT STARTED

Features of the agreed [use cases](02-use-cases.md), by mind-map branch.

Status: **Kept** — unchanged; **Changed** — changed by this revision; **New** — added by this revision. Source: **D1** Usage & Connector demo, **D2** waste demo, **R** requested on top of a demo, **M** meeting, **UC** existing use cases.

### License Management

| ID | Feature | Use case | Actors | Source | Status |
|---|---|---|---|---|---|
| F01 | License List: monthly cost, company, Allocated / Purchased with rate, days to expiry; "As of" date | UC57 | Manager | D1 | New |
| F02 | License List search (license, provider, company), company filter, expiry filter (0–30, 31–60, > 60 days, expired), applied-filters bar with *Clear filters* | UC57 | Manager | D1 | New |
| F03 | License List sort (expiry, name, monthly cost, allocation rate, purchased quantity) with reverse, sortable headings, paging 10 / 20 / 50 | UC57 | Manager | D1 | New |
| F04 | Validity timeline: six-month window, ‹ Today ›, today line, colour by expiry bucket, final 7 days striped, hover card | UC58 | Manager | D1 | New |
| F05 | License details dialog: cost, start, expiry, expiry status, unallocated or over-allocated quantity | UC59 | Manager | D1 | New |
| F06 | License users: Active / Inactive / Not monitored counts, holder table with last used, days used, frequency band; search, sort, paging, CSV | UC61 | Manager | R | New |
| F07 | License inventory per P&L, grouped by provider, with cost | UC27 | Manager, Staff | UC, D1 | Changed |
| F08 | Licenses per organization unit and units per license | UC28 | Manager | UC | Kept |
| F09 | Shared licenses kept apart from company licenses and budgets | UC47 | Staff | M | New |
| F10 | Providers and their licenses per company, view only, from connectors | UC02 | Manager | UC, M | Changed |
| F11 | Contracts (license terms), view only: start, expiry, auto-renew, cost, renewal filter | UC04 | Manager | UC | Changed |

### Usage

| ID | Feature | Use case | Actors | Source | Status |
|---|---|---|---|---|---|
| F12 | Organization tree Group > Company > Division > Department > Project > License, open / close per node, collapse the whole tree | UC37 | Manager | D1, D2 | New |
| F13 | Tree search that keeps matching nodes and their parents open | UC37 | Manager | D2, D1 v1 | New |
| F14 | Breadcrumb; header company picker with search, tick on the current scope, keyboard | UC37 | Manager | D1, D2 | New |
| F15 | Titles by level; *License Monitoring* at project level | UC37, UC50 | Manager | D1, D2 | New |
| F16 | Scope kept in the page address (shareable link) | UC37 | Manager | D1, D2 | New |
| F17 | Keyboard navigation in the tree | UC37 | Manager | D1 | New |
| F18 | Balance bars: Plan Budget, Purchased Cost, Actual Used | UC08 | Manager | D1, D2 | Changed |
| F19 | Badge "Over budget +X" / "Savings vs budget −X" | UC08 | Manager | D1, D2 | New |
| F20 | Cost utilization donut: Utilized, Wasted, Purchased | UC08 | Manager | D1, D2 | New |
| F21 | Period tabs YTD / Monthly Comparison / Annual Trend; Year and Month filters | UC48, UC49 | Manager | D1, D2 | New |
| F22 | Sort (7 orders) and entity search with "shown / total" | UC48 | Manager | D1, D2 | New |
| F23 | Currency switch USD / VND | UC48 | Manager | D1 | New |
| F24 | Unit comparison chart: cards of 8 units with Plan, Purchased, Wasted totals; Plan beside Purchased split into Used and Wasted; click to go down | UC48 | Manager | D1, D2 | New |
| F25 | Figure card on hover or focus: Plan, Purchased (% of plan), Used and Wasted (% of purchased) | UC48, UC49, UC52–UC54 | Manager | D1 | New |
| F26 | Annual trend cards per unit: monthly Plan beside Purchased split into Used and Wasted, Efficiency, Plan / Used / Wasted totals | UC49 | Manager | D1, D2 | New |
| F27 | Subordinate units table: rank, type, Plan, Purchased, Used, Wasted, Utilization, Variance vs Plan; click to go down | UC50 | Manager | D1, D2 | New |
| F28 | Table paging 10 / 25 / 50 | UC50 | Manager | D1 | New |
| F29 | License drop-down under a P&L (or any unit) row: chevron, same money columns, Wasted Spend per license, waste flag, figure card, opens license details | UC50 | Manager | R | New |
| F30 | CSV export of the listed units (UTF-8 BOM, named by scope, year, mode) | UC51 | Manager | D1, D2 | New |
| F31 | Employee usage from BCA | UC32 | Manager | UC | Kept |

### Budget Management

| ID | Feature | Use case | Actors | Source | Status |
|---|---|---|---|---|---|
| F32 | Excel template download | UC33 | Manager | M | New |
| F33 | Budget import from Excel by the Manager of the unit, with preview, rejection reasons, versions | UC33 | Manager | M | Changed |
| F34 | Monthly budget plan, quantity and amount, version compare | UC05 | Manager | UC | Changed |
| F35 | Cost allocation per unit | UC06 | Manager | UC | Kept |
| F36 | Cost accrual by month with rounding and month close | UC42 | Manager, Staff | M | New |
| F37 | Accrual export for finance | UC42 | Manager, Staff | M | New |
| F38 | Expenses with invoice and CSV import | UC07 | Staff | UC | Kept |
| F39 | Monthly plan variance | UC34 | Manager | UC | Kept |
| F40 | Spending forecast | UC09 | Manager | UC | Kept |

### Optimization

| ID | Feature | Use case | Actors | Source | Status |
|---|---|---|---|---|---|
| F41 | Unused (unassigned) seats with their cost | UC10 | Manager | UC | Changed |
| F42 | Inactive seats, with `Holder moved` and shared accounts listed apart | UC11 | Manager | UC, M | Changed |
| F43 | P&L waste flag in money | UC35 | Manager | UC | Changed |
| F44 | Sidebar shortcut *Xếp hạng lãng phí*: group scope, sorted by waste, scrolled to the waste analysis | UC43 | Manager | D2 | New |
| F45 | Waste ranking: top 10 and "show all", Used / Waste bar, "% chưa khai thác" | UC43 | Manager | D2 | New |
| F46 | Trend line chart: Actual Used and Wasted by month (demo) plus a Plan Budget line (requested), common scale, three-item legend | UC52 | Manager | D1, D2, R | New |
| F47 | Legend toggle and month-to-date mark on the trend | UC52 | Manager | R | New |
| F48 | Waste risk scatter: Purchased × waste rate, median lines, above-median quadrant highlighted, click to go down | UC53 | Manager | D1, D2 | New |
| F49 | Monthly waste-rate heatmap: own year selector (D1), top 12 and "View all", colour scale, future months "–" | UC54 | Manager | D1, D2 | New |

### Analytics

| ID | Feature | Use case | Actors | Source | Status |
|---|---|---|---|---|---|
| F50 | Group overview: every P&L with Plan, Purchased, Used, Waste, waste flag | UC36 | Admin | UC, D1, D2 | Kept |
| F51 | Analysis by license, provider, license type | UC44 | Manager | M | New |
| F52 | Metric definitions catalog and in-place info icons | UC45 | Manager | M | New |
| F53 | License dashboard | UC15 | Manager, Admin | UC | Changed |
| F54 | Financial dashboard | UC16 | Manager, Admin | UC | Kept |
| F55 | Optimization dashboard: waste, unused and inactive seats, flagged P&Ls | UC18 | Manager, Admin | UC | Changed |

### User & Organization

| ID | Feature | Use case | Actors | Source | Status |
|---|---|---|---|---|---|
| F56 | Users from ILVG, one-time password link, disable | UC19 | Admin | UC | Kept |
| F57 | Organization hierarchy, Manager assignment | UC20 | Admin | UC | Kept |
| F58 | Staff assignment to companies (data scope of input users) | UC19, UC21 | Admin | M | New |
| F59 | Roles | UC21 | Admin | UC | Kept |
| F60 | Permission matrix | UC22 | Admin | UC | Kept |

### Connection Management

| ID | Feature | Use case | Actors | Source | Status |
|---|---|---|---|---|---|
| F61 | Connector tiles: Companies, Providers, Licenses, Sync Issues | UC38 | Staff | D1 | New |
| F62 | Connector search, filters (company, provider, status), sort (5 orders) | UC38 | Staff | D1 | New |
| F63 | Tree table Company > Provider > License: coverage, API contact, created, last sync, status; opens matches; paging by company | UC38 | Staff | D1 | New |
| F64 | **+** on a company row opens *New Connector* with the company preselected (latest D1: the company filter preselects it) | UC55 | Staff | D1 v1 | New |
| F65 | Connector form, General: company, provider, API contact and email pre-filled; name generated "<Company> – <Provider> Usage"; sync every 6 hours | UC55 | Staff | D1 | Changed |
| F66 | Connector form, API Connection: full HTTPS API URL, API Key or Bearer Token, masked credential with show / hide | UC55 | Staff | D1 | Changed |
| F67 | Connector licenses: suggestions per provider, chips, duplicate check, at least one | UC55 | Staff | D1 | New |
| F68 | New connector licenses `Pending` until the first sync | UC55 | Staff | D1 | New |
| F69 | Test before save | UC55 | Staff | UC | Kept |
| F70 | Edit connector from the provider row: form filled in, credential optional unless provider or authentication changes | UC60 | Staff | D1 | New |
| F71 | Reconfiguring a connector (company, provider, authentication, API URL) sets its licenses back to `Pending`; kept licenses keep ID and status otherwise | UC60 | Staff | D1 | New |
| F72 | Connector details drawer | UC56 | Staff | D1 v1 | New |
| F73 | Sync monitoring, rerun, pause | UC26 | Staff | UC | Kept |

### Self-service

| ID | Feature | Use case | Actors | Source | Status |
|---|---|---|---|---|---|
| F74 | My licenses across all my emails | UC23 | Everyone | UC, M | Changed |
| F75 | Login / logout | UC24 | Everyone | UC | Kept |

**Count:** 75 features — 15 kept, 14 changed, 46 new.
