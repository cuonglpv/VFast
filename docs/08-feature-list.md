# Feature List

> Design status: TARGET (agreed 13 November 2026, revised 15 and 16 November 2026)
>
> Implementation status: NOT STARTED

Features of the agreed [use cases](02-use-cases.md), by mind-map branch.

Status: **Kept** — unchanged; **Changed** — changed by this revision; **New** — added by this revision. Source: **D1** Usage & Connector demo, **D2** waste demo, **R** requested on top of a demo, **M** meeting, **UC** existing use cases.

### License Management

| ID | Feature | Use case | Actors | Source | Status |
|---|---|---|---|---|---|
| F01 | License List: monthly cost (accrued from the invoices), company, Allocated / Purchased with rate, days to expiry; "As of" date | UC57 | Manager | D1 | New |
| F02 | License List search (license, provider, company), company filter, expiry filter (0–30, 31–60, > 60 days, expired), applied-filters bar with *Clear filters* | UC57 | Manager | D1 | New |
| F03 | License List sort (expiry, name, monthly cost, allocation rate, purchased quantity) with reverse, sortable headings, paging 10 / 20 / 50 | UC57 | Manager | D1 | New |
| F04 | Validity timeline: six-month window, ‹ Today ›, today line, colour by expiry bucket, final 7 days striped, hover card | UC58 | Manager | D1 | New |
| F05 | License details dialog: cost, start, expiry, expiry status, unallocated or over-allocated quantity | UC59 | Manager | D1 | New |
| F06 | License users: Active / Inactive / Not monitored counts, holder table with last used, days used against working days as a bar; search, sort, paging, CSV | UC61 | Manager | R | New |
| F76 | Software catalog: software, provider, category and subcategory; create, edit, merge | UC01 | Staff | M | New |
| F77 | License and BCA application name mapping to the catalog: *Not mapped* filter, suggestions by provider and name, one mapping for every company; unmapped names under *Uncategorized*; the name SAP uses for a license when it differs from the connector's | UC01 | Staff | M | New |
| F07 | License inventory per P&L, grouped by provider, with cost | UC27 | Manager, Staff | UC, D1 | Changed |
| F08 | Licenses per organization unit and units per license | UC28 | Manager | UC | Kept |
| F09 | Shared licenses (used by two or more companies): owned by the group, planned by the group per P&L, cost charged back to each company by the seats its people hold, unassigned seats in *Unallocated* of the group; *Possibly shared* proposals | UC47 | Staff, Manager | M | New |
| F10 | Providers and their licenses per company, view only, from connectors | UC02 | Manager | UC, M | Changed |
| F11 | Contracts (license terms from the SAP PO lines), view only: PO, start, expiry, quantity, cost, renewal filter | UC04 | Manager | UC | Changed |

### Usage

| ID | Feature | Use case | Actors | Source | Status |
|---|---|---|---|---|---|
| F12 | Organization tree Group > Company > Division > Department > Project > License, with *Unallocated* and *Unknown unit* under each company; open / close per node, collapse the whole tree; starts at the Manager's highest unit, the group for a Manager of the group | UC37 | Manager | D1, D2 | New |
| F13 | Tree search that keeps matching nodes and their parents open | UC37 | Manager | D2, D1 v1 | New |
| F14 | Breadcrumb; header company picker with search, tick on the current scope, keyboard | UC37 | Manager | D1, D2 | New |
| F15 | Titles by level; *License Monitoring* at project level | UC37, UC50 | Manager | D1, D2 | New |
| F16 | Scope kept in the page address (shareable link) | UC37 | Manager | D1, D2 | New |
| F17 | Keyboard navigation in the tree | UC37 | Manager | D1 | New |
| F18 | Balance bars: Plan Budget, Purchased Cost, Actual Used | UC08 | Manager | D1, D2 | Changed |
| F19 | Badge "Over budget +X" / "Savings vs budget −X" | UC08 | Manager | D1, D2 | New |
| F20 | Cost utilization donut: Utilized, Wasted, Not evaluated (when above zero), Purchased | UC08 | Manager | D1, D2 | New |
| F21 | Period tabs YTD / Monthly Comparison / Annual Trend; Year and Month filters; complete months only, up to the previous month | UC48, UC49 | Manager | D1, D2 | New |
| F22 | Sort (7 orders) and entity search with "shown / total" | UC48 | Manager | D1, D2 | New |
| F23 | Currency switch USD / VND | UC48 | Manager | D1 | New |
| F24 | Unit comparison chart: cards of 8 units with Plan, Purchased, Wasted totals; Plan beside Purchased split into Used, Wasted, and Not evaluated (when above zero); click to go down | UC48 | Manager | D1, D2 | New |
| F25 | Figure card on hover or focus: Plan, Purchased (% of plan), Used and Wasted (% of purchased) | UC48, UC49, UC52–UC54 | Manager | D1 | New |
| F26 | Annual trend cards per unit: monthly Plan beside Purchased split into Used, Wasted, and Not evaluated (when above zero), Efficiency, Plan / Used / Wasted totals | UC49 | Manager | D1, D2 | New |
| F27 | Subordinate units table: rank, type, Plan, Purchased, Used, Wasted, Utilization, Variance vs Plan; click to go down | UC50 | Manager | D1, D2 | New |
| F28 | Table paging 10 / 25 / 50 | UC50 | Manager | D1 | New |
| F29 | License heatmap under a P&L row: chevron opens a license × month matrix of waste (rate or cost), figure card per cell; opens license details and works at every level (requested) | UC50 | Manager | D1, R | New |
| F30 | CSV export of the listed units (UTF-8 BOM, named by scope, year, mode) | UC51 | Manager | D1, D2 | New |
| F31 | Employee usage from BCA | UC32 | Manager | UC | Kept |

### Budget Management

| ID | Feature | Use case | Actors | Source | Status |
|---|---|---|---|---|---|
| F32 | Excel template download | UC33 | Manager | M | New |
| F33 | Budget import from Excel by the Manager of the unit or of any larger unit above it, for a target unit and months; preview with rows to add, replace, remove, and reject; versions; idempotent (same file twice changes nothing, confirm applied once); shared licenses planned by the group per P&L or deeper, P&Ls can change their lines; no *Shared* column, a line's license is found by its name in SAP | UC33 | Manager | M | Changed |
| F34 | Monthly budget plan, quantity and amount, version compare | UC05 | Manager | UC | Changed |
| F35 | Cost allocation per unit | UC06 | Manager | UC | Kept |
| F36 | Cost accrual by month with rounding and month close | UC42 | Manager, Staff | M | New |
| F37 | Accrual export for finance | UC42 | Manager, Staff | M | New |
| F38 | Purchases: monthly import of the PR, PO lines, and invoices exported from SAP (PO lines give quantity and term, invoices the cost), idempotent by PO and invoice number; hand entry of a purchase made outside SAP | UC07 | Staff | M | Changed |
| F80 | Exchange rates: rate per currency from a date, rate of the invoice date applied, corrections only for open months | UC62 | Staff | M | New |
| F39 | Monthly plan variance | UC34 | Manager | UC | Kept |
| F40 | Spending forecast | UC09 | Manager | UC | Kept |

### Optimization

| ID | Feature | Use case | Actors | Source | Status |
|---|---|---|---|---|---|
| F41 | Unused (unassigned) seats with their cost | UC10 | Manager | UC | Changed |
| F42 | Inactive seats (30 days without use) with their monthly and yearly cost and a total; `Holder moved` and shared accounts listed apart | UC11 | Manager | UC, M | Changed |
| F43 | P&L waste flag in money: red when Wasted is above 20 % of Purchased | UC35 | Manager | UC | Changed |
| F44 | Sidebar shortcut *Xếp hạng lãng phí*: the Manager's highest unit (the group for a Manager of the group), sorted by waste, scrolled to the waste analysis | UC43 | Manager | D2 | New |
| F45 | Waste ranking: top 10 and "show all", Used / Waste bar, "% chưa khai thác" | UC43 | Manager | D2 | New |
| F46 | Trend line chart: Plan Budget, Actual Used, and Wasted by month (Plan now in D1), common scale, three-item legend, hover anywhere on the Plan line | UC52 | Manager | D1, D2, R | New |
| F47 | Trend follows the search (D1) with "Filtered: n of N units"; legend toggle; the current month is not drawn until it ends | UC52 | Manager | D1, R | New |
| F48 | Waste risk scatter: Purchased × waste rate, median lines, above-median quadrant highlighted, click to go down | UC53 | Manager | D1, D2 | New |
| F49 | Monthly waste-rate heatmap: own year selector (D1), top 12 and "View all", colour scale, current and future months "–" | UC54 | Manager | D1, D2 | New |
| F78 | *Rate / Cost* switch: waste rate or wasted amount in the heatmap (title follows) and in every open license panel, one switch for all | UC54, UC50 | Manager | D1 | New |

### Analytics

| ID | Feature | Use case | Actors | Source | Status |
|---|---|---|---|---|---|
| F50 | Group overview: every P&L with Plan, Purchased, Used, Waste, waste flag | UC36 | Admin | UC, D1, D2 | Kept |
| F51 | Analysis by license, software, category, provider, license type | UC44 | Manager | M | New |
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
| F65 | Connector form, General: company, provider, API contact and email pre-filled; name generated "<Company> – <Provider> Usage"; sync interval typed freely in hours, 6 by default | UC55 | Staff | D1 | Changed |
| F66 | Connector form, API Connection: full HTTPS API URL, API Key or Bearer Token, masked credential with show / hide | UC55 | Staff | D1 | Changed |
| F67 | Connector licenses: suggestions per provider, chips, duplicate check, at least one | UC55 | Staff | D1 | New |
| F68 | New connector licenses `Pending` until the first sync | UC55 | Staff | D1 | New |
| F69 | Test before save | UC55 | Staff | UC | Kept |
| F70 | Edit connector from the provider row: form filled in, credential optional unless provider or authentication changes | UC60 | Staff | D1 | New |
| F71 | Reconfiguring a connector (company, provider, authentication, API URL) sets its licenses back to `Pending`; kept licenses keep ID and status otherwise | UC60 | Staff | D1 | New |
| F79 | Delete a connector: confirmation naming its licenses, sync stops, licenses inactive, collected data kept for past months | UC60 | Staff | M | New |
| F72 | Connector details drawer | UC56 | Staff | D1 v1 | New |
| F73 | Sync monitoring, rerun, change the interval; pause and resume, with `Paused` licenses and every skipped run recorded as a `Paused` sync run | UC26 | Staff | UC | Changed |

### Self-service

| ID | Feature | Use case | Actors | Source | Status |
|---|---|---|---|---|---|
| F74 | My licenses across all my emails | UC23 | Everyone | UC, M | Changed |
| F75 | Login / logout | UC24 | Everyone | UC | Kept |

**Count:** 80 features — 13 kept, 16 changed, 51 new. Feature numbers are kept stable; F76 onward were added in the third revision.
