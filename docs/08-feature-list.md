# Feature List

> Design status: TARGET (November 2026)
>
> Implementation status: NOT STARTED

Features of the [use cases](02-use-cases.md), by mind-map branch and use case.

Source: **D1** Usage & Connector demo, **D2** waste demo, **R** requested on top of a demo, **M** meeting, **UC** use case analysis.

### License Management

| ID | Feature | Use case | Actors | Source |
|---|---|---|---|---|
| F01 | License List: monthly cost (accrued from the invoices), company, Allocated / Purchased with rate, days to expiry; "As of" date | UC01 | Manager | D1 |
| F02 | License List search (license, provider, company), company filter, expiry filter (0–30, 31–60, > 60 days, expired), applied-filters bar with *Clear filters* | UC01 | Manager | D1 |
| F03 | License List sort (expiry, name, monthly cost, allocation rate, purchased quantity) with reverse, sortable headings, paging 10 / 20 / 50 | UC01 | Manager | D1 |
| F04 | Validity timeline: six-month window, ‹ Today ›, today line, colour by expiry bucket, final 7 days striped, hover card | UC01 | Manager | D1 |
| F05 | License details dialog: cost, start, expiry, expiry status, unallocated or over-allocated quantity | UC01 | Manager | D1 |
| F06 | Contracts (license terms from the SAP PO lines), view only: PO, start, expiry, quantity, cost, renewal filter | UC01 | Manager | UC |
| F07 | License users: Active / Inactive / Not monitored counts, holder table with last used, days used against working days as a bar; search, sort, paging, CSV | UC02 | Manager | R |
| F08 | License inventory per P&L, grouped by provider, with cost | UC03 | Manager, Staff | UC, D1 |
| F09 | Licenses per organization unit and units per license | UC03 | Manager | UC |
| F10 | Providers and their licenses per company, view only, from connectors | UC03 | Manager | UC, M |
| F11 | Software catalog: software, provider, category and subcategory; create, edit, merge | UC04 | Staff | M |
| F12 | License and BCA application name mapping to the catalog: *Not mapped* filter, suggestions by provider and name, one mapping for every company; unmapped names under *Uncategorized*; the name SAP uses for a license when it differs from the connector's | UC04 | Staff | M |
| F13 | Shared licenses (used by two or more companies): owned by the group, planned by the group per P&L, cost charged back to each company by the seats its people hold, unassigned seats in *Unallocated* of the group; *Possibly shared* proposals | UC05 | Staff, Manager | M |

### Usage

| ID | Feature | Use case | Actors | Source |
|---|---|---|---|---|
| F14 | Organization tree Group > Company > Division > Department > Project > License, with *Unallocated* and *Unknown unit* under each company; open / close per node, collapse the whole tree; starts at the Manager's highest unit, the group for a Manager of the group | UC06 | Manager | D1, D2 |
| F15 | Tree search that keeps matching nodes and their parents open | UC06 | Manager | D2, D1 v1 |
| F16 | Breadcrumb; header company picker with search, tick on the current scope, keyboard | UC06 | Manager | D1, D2 |
| F17 | Titles by level; *License Monitoring* at project level | UC06, UC09 | Manager | D1, D2 |
| F18 | Scope kept in the page address (shareable link) | UC06 | Manager | D1, D2 |
| F19 | Keyboard navigation in the tree | UC06 | Manager | D1 |
| F20 | Balance bars: Plan Budget, Purchased Cost, Actual Used | UC07 | Manager | D1, D2 |
| F21 | Badge "Over budget +X" / "Savings vs budget −X" | UC07 | Manager | D1, D2 |
| F22 | Cost utilization donut: Utilized, Wasted, Not evaluated (when above zero), Purchased | UC07 | Manager | D1, D2 |
| F23 | Period tabs YTD / Monthly Comparison / Annual Trend; Year and Month filters; complete months only, up to the previous month | UC08 | Manager | D1, D2 |
| F24 | Sort (7 orders) and entity search with "shown / total" | UC08 | Manager | D1, D2 |
| F25 | Currency switch USD / VND | UC08 | Manager | D1 |
| F26 | Unit comparison chart: cards of 8 units with Plan, Purchased, Wasted totals; Plan beside Purchased split into Used, Wasted, and Not evaluated (when above zero); click to go down | UC08 | Manager | D1, D2 |
| F27 | Figure card on hover or focus: Plan, Purchased (% of plan), Used and Wasted (% of purchased) | UC08, UC18 | Manager | D1 |
| F28 | Annual trend cards per unit: monthly Plan beside Purchased split into Used, Wasted, and Not evaluated (when above zero), Efficiency, Plan / Used / Wasted totals | UC08 | Manager | D1, D2 |
| F29 | Subordinate units table: rank, type, Plan, Purchased, Used, Wasted, Utilization, Variance vs Plan; click to go down | UC09 | Manager | D1, D2 |
| F30 | Table paging 10 / 25 / 50 | UC09 | Manager | D1 |
| F31 | License heatmap under a P&L row: chevron opens a license × month matrix of waste (rate or cost), figure card per cell; opens license details and works at every level (requested) | UC09 | Manager | D1, R |
| F32 | CSV export of the listed units (UTF-8 BOM, named by scope, year, mode) | UC09 | Manager | D1, D2 |
| F33 | Employee usage from BCA | UC10 | Manager | UC |

### Budget Management

| ID | Feature | Use case | Actors | Source |
|---|---|---|---|---|
| F34 | Excel template download | UC11 | Manager | M |
| F35 | Budget import from Excel by the Manager of the unit or of any larger unit above it, for a target unit and months; preview with rows to add, replace, remove, and reject; versions; idempotent (same file twice changes nothing, confirm applied once); shared licenses planned by the group per P&L or deeper, P&Ls can change their lines; no *Shared* column, a line's license is found by its name in SAP | UC11 | Manager | M |
| F36 | Monthly budget plan, quantity and amount, version compare | UC11 | Manager | UC |
| F37 | Cost accrual by month with rounding and month close | UC12 | Manager, Staff | M |
| F38 | Accrual export for finance | UC12 | Manager, Staff | M |
| F39 | Purchases: monthly import of the PR, PO lines, and invoices exported from SAP (PO lines give quantity and term, invoices the cost), idempotent by PO and invoice number; hand entry of a purchase made outside SAP | UC13 | Staff | M |
| F40 | Exchange rates: rate per currency from a date, rate of the invoice date applied, corrections only for open months | UC14 | Staff | M |
| F41 | Spending forecast | UC15 | Manager | UC |

### Optimization

| ID | Feature | Use case | Actors | Source |
|---|---|---|---|---|
| F42 | Unused (unassigned) seats with their cost | UC16 | Manager | UC |
| F43 | Inactive seats (30 days without use) with their monthly and yearly cost and a total; `Holder moved` and shared accounts listed apart | UC16 | Manager | UC, M |
| F44 | P&L waste flag in money: red when Wasted is above 20 % of Purchased | UC17 | Manager | UC |
| F45 | Sidebar shortcut *Xếp hạng lãng phí*: the Manager's highest unit (the group for a Manager of the group), sorted by waste, scrolled to the waste analysis | UC17 | Manager | D2 |
| F46 | Waste ranking: top 10 and "show all", Used / Waste bar, "% chưa khai thác" | UC17 | Manager | D2 |
| F47 | Trend line chart: Plan Budget, Actual Used, and Wasted by month (Plan now in D1), common scale, three-item legend, hover anywhere on the Plan line | UC18 | Manager | D1, D2, R |
| F48 | Trend follows the search (D1) with "Filtered: n of N units"; legend toggle; the current month is not drawn until it ends | UC18 | Manager | D1, R |
| F49 | Waste risk scatter: Purchased × waste rate, median lines, above-median quadrant highlighted, click to go down | UC18 | Manager | D1, D2 |
| F50 | Monthly waste-rate heatmap: own year selector (D1), top 12 and "View all", colour scale, current and future months "–" | UC18 | Manager | D1, D2 |
| F51 | *Rate / Cost* switch: waste rate or wasted amount in the heatmap (title follows) and in every open license panel, one switch for all | UC18, UC09 | Manager | D1 |

### Analytics

| ID | Feature | Use case | Actors | Source |
|---|---|---|---|---|
| F52 | Cost allocation per unit | UC19 | Manager | UC |
| F53 | Monthly plan variance | UC19 | Manager | UC |
| F54 | License dashboard | UC19 | Manager | UC |
| F55 | Financial dashboard | UC19 | Manager | UC |
| F56 | Optimization dashboard: waste, unused and inactive seats, flagged P&Ls | UC19 | Manager | UC |
| F57 | Analysis by license, software, category, provider, license type | UC20 | Manager | M |
| F58 | Metric definitions catalog and in-place info icons | UC21 | Manager | M |

### User & Organization

| ID | Feature | Use case | Actors | Source |
|---|---|---|---|---|
| F59 | Accounts from ILVG: one per employee with the role Employee, one-time password link by email, leavers disabled | UC22 | System | UC |
| F60 | Role and data scope per user (Manager units, Staff companies); disable and re-enable access | UC22 | Admin | UC |
| F61 | Permission matrix | UC22 | Admin | UC |
| F62 | Organization hierarchy, Manager assignment | UC23 | Admin | UC |

### Connection Management

| ID | Feature | Use case | Actors | Source |
|---|---|---|---|---|
| F63 | Connector tiles: Companies, Providers, Licenses, Sync Issues | UC24 | Staff | D1 |
| F64 | Connector search, filters (company, provider, status), sort (5 orders) | UC24 | Staff | D1 |
| F65 | Tree table Company > Provider > License: coverage, API contact, created, last sync, status; opens matches; paging by company | UC24 | Staff | D1 |
| F66 | **+** on a company row opens *New Connector* with the company preselected (latest D1: the company filter preselects it) | UC24 | Staff | D1 v1 |
| F67 | Connector form, General: company, provider, API contact and email pre-filled; name generated "<Company> – <Provider> Usage"; sync interval typed freely in hours, 6 by default | UC24 | Staff | D1 |
| F68 | Connector form, API Connection: full HTTPS API URL, API Key or Bearer Token, masked credential with show / hide | UC24 | Staff | D1 |
| F69 | Connector licenses: suggestions per provider, chips, duplicate check, at least one | UC24 | Staff | D1 |
| F70 | New connector licenses `Pending` until the first sync | UC24 | Staff | D1 |
| F71 | Test before save | UC24 | Staff | UC |
| F72 | Edit connector from the provider row: form filled in, credential optional unless provider or authentication changes | UC24 | Staff | D1 |
| F73 | Reconfiguring a connector (company, provider, authentication, API URL) sets its licenses back to `Pending`; kept licenses keep ID and status otherwise | UC24 | Staff | D1 |
| F74 | Delete a connector: confirmation naming its licenses, sync stops, licenses inactive, collected data kept for past months | UC24 | Staff | M |
| F75 | Connector details drawer | UC24 | Staff | D1 v1 |
| F76 | Sync monitoring, rerun, change the interval; pause and resume, with `Paused` licenses and every skipped run recorded as a `Paused` sync run | UC25 | Staff | UC |

### Self-service

| ID | Feature | Use case | Actors | Source |
|---|---|---|---|---|
| F77 | My licenses across all my emails | UC26 | Everyone | UC, M |
| F78 | Login / logout | UC27 | Everyone | UC |
| F79 | Forgot password: a new one-time link to the account email | UC27 | Everyone | UC |

**Count:** 79 features.
