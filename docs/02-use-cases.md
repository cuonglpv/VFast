# Actors, Roles, Business Rules, and Use Cases

> Design status: TARGET (revised business model, November 2026)
>
> Implementation status: NOT STARTED

System: **Enterprise License Management System (ELMS)**, built by team VFast. Use cases follow the seven branches of the [mind map](mindmap.png): License Management, Usage, Budget Management, Optimization, Analytics, User & Organization, Connection Management.

**What changed in this revision.** ELMS no longer enters or grants licenses. Each P&L exposes a license API that ELMS calls; actual usage comes from BCA, employees and units from ILVG, and the monthly budget plan from SAP. Views are built on three figures — Plan, Purchased, Used — over a fixed hierarchy, Group > P&L > Block > Department > Project. Use cases are written at use-case level; processing details still open are listed in [Open decisions](#open-decisions).

**Second revision (13 Nov 2026), from the UI demos and the latest meeting.** Figures are in money as well as quantity (BR-05); waste is Purchased − Used, always shown next to Plan (BR-24). Connectors are set up per company and provider, and input users see only their own company (BR-16). The budget plan is imported from Excel (BR-08). Adds cost accrual with rounding (UC42), waste analysis (UC43), analysis by license and provider (UC44), metric definitions (UC45), holder identity for transfers and group mailboxes (BR-27, BR-28), and shared licenses (UC47). The feature list is in [Feature list](08-feature-list.md).

**Use cases follow the UI demos.** Where a demo exists, the use case describes that screen as the demo shows it: **D1** — `VFast_Usage_Connector_Management (5).html`, the latest version (menus *License List*, *Usage*, *Connector Management*; it opens on License List); parts that only the earlier version (1) had are marked *D1 v1*; **D2** — `vfast_dashboard_waste_analytics.html` (menus *Tổng quan chi phí & sử dụng* and *Xếp hạng lãng phí*). D1 and D2 show the same Usage screen with its waste analysis; D2 also ranks units by waste. Behaviour requested on top of a demo is marked *(requested, not in the demo)*; behaviour a business rule requires but the demo lacks is marked *(not in the demo)*. Use cases without a demo screen are kept and marked *Demo: none yet*; the demos only add use cases and correct existing ones.

## Actors / roles

| Actor | Description |
|---|---|
| `EMPLOYEE` | Every employee of the group. Only sees the licenses they hold and whether they are recorded as used |
| `STAFF` | Member of the license management team; does the hands-on work: sets up and edits usage connectors, watches the syncs, checks what each company's connectors deliver, runs the monthly accrual, records expenses and shared licenses. Assigned to one or more companies (P&Ls) and sees only those; a Staff member at group level sees every company. Does not analyse usage or waste |
| `MANAGER` | **The main user.** Manager of a unit at any level below the group (P&L, block, department, or project). For that unit and everything under it: browses licenses and who uses them, analyses usage and waste, sets up and follows the budget plan |
| `ADMIN` | Runs the system — users, roles, permissions, the organization hierarchy, and which Manager owns which unit — and watches the group from above: the group overview and the dashboards, read-only. Does not work inside a unit's data |
| Usage connectors | One connector per company and provider (Microsoft, Atlassian, Adobe…), answering in the license data contract. Returns the licenses of that provider the company uses, with holders and usage |
| BCA | Usage tracking on company machines. Returns how often each member uses each application |
| ILVG | Internal application. Returns employees and the unit each belongs to |
| Budget Excel | The yearly budget plan by month, exported from SAP into the ELMS Excel template and imported per company |

Every account belongs to a real employee, so View My Licenses and Login / Logout belong to every role.

**Organization.** The hierarchy is fixed: **Group > P&L > Block > Department > Project** (BR-21). In this document a *unit* is a node at any of these levels. A Manager is assigned to one or more units and sees them and everything under them.

## Role × feature matrix

| Mind-map branch | Feature | Admin | Manager | Staff | Employee |
|---|---|---|---|---|---|
| License Management | License list, validity timeline, license details, license users (UC57–UC59, UC61) | | ✓ own units | | |
| | Providers and licenses, contracts, licenses by organization (UC02, UC04, UC28) | | ✓ own units | | |
| | License inventory by P&L (UC27) | | ✓ own units | ✓ own companies | |
| | Shared licenses (UC47) | | | ✓ group level | |
| Usage | Organization scope, Plan vs utilization balance, unit comparison, annual trend, units table, CSV export, employee usage (UC37, UC08, UC48–UC51, UC32) | | ✓ own units | | |
| Budget Management | Budget import, monthly plan, cost allocation, plan variance, forecast (UC33, UC05, UC06, UC34, UC09) | | ✓ own units | | |
| | Cost accrual (UC42) | | read, own units | ✓ own companies | |
| | Expense management (UC07) | | | ✓ own companies | |
| Optimization | Unused and inactive detection, P&L waste flag, waste ranking, trend, risk distribution, heatmap (UC10, UC11, UC35, UC43, UC52–UC54) | | ✓ own units | | |
| Analytics | Group overview (UC36) | ✓ | | | |
| | License, financial, optimization dashboards (UC15, UC16, UC18) | ✓ whole group | ✓ own units | | |
| | License and provider analysis, metric definitions (UC44, UC45) | | ✓ own units | | |
| User & Organization | Users, organization hierarchy, roles, permissions (UC19–UC22) | ✓ | | | |
| Connection Management | Usage connectors: list, create, edit, details; sync monitoring (UC38, UC55, UC60, UC56, UC26) | | | ✓ own companies | |
| Self-service | My licenses, login / logout (UC23, UC24) | ✓ | ✓ | ✓ | ✓ |

**In short:** the Manager uses the product; Staff keeps it fed; Admin runs it and sees the group from above; the Employee sees their own licenses. Menus and buttons are hidden when the user lacks permission, but the API enforces every rule in this table; a URL outside the role returns `403`.

## Business rules

Rule numbers are kept from the previous model so references stay valid; BR-21 to BR-23 are new, and BR-24 to BR-30 come from the second revision.

| ID | Rule |
|---|---|
| BR-01 | ELMS is read-only toward every source: usage connectors, BCA, ILVG. It never grants, assigns, revokes, buys, or renews a license; "Assigned" is data read from a P&L. |
| BR-02 | A license has one **license type**: `monthly`, `yearly`, or `usage_based`, reported by the P&L. Each type has its own actual-usage table; a new type later is a new table. |
| BR-03 | Every assigned seat has exactly one status: `Active`, `Inactive`, `No activity`, or `Not monitored` (no usage source). A paid seat without a holder is `Unassigned`. |
| BR-04 | Missing data is `Unknown`, never 0. `Not monitored` is never counted as `Inactive` or as waste. |
| BR-05 | **Money and quantity.** Every figure has an amount and, where it applies, a quantity. Analysis screens show amounts by default, in VND or USD at the user's choice; quantities are shown per license, never added across licenses of different units of measure. Each amount keeps its original currency; the exchange rate used is shown. |
| BR-06 | Cost allocation (UC06, carried over): the cost of a license is split evenly over its seats; each seat counts toward the unit of its holder. |
| BR-07 | **Over-allocation:** a license is `Over-allocated` when the quantity allocated exceeds the quantity purchased (BR-34). Detecting a shortage beyond that is parked with UC12. |
| BR-08 | **The budget plan is imported from Excel**, in the ELMS template, by month. Each line carries the P&L, block code, project code, project name, license, planned quantity, and planned amount. The Manager of a unit sets up its plan by importing the file; ELMS does not write the plan otherwise. Importing a month again replaces it and keeps the earlier version. |
| BR-09 | **Three figures per unit and period:** **Plan** (budget), **Purchased** (bought), **Used** (the value of what is actually used: purchased cost × utilization). Monitoring and variance compare them month by month, year to date, and year by year. |
| BR-10 | Expenses (UC07, carried over): an expense has a date, amount, currency, license, unit, and an optional invoice file. |
| BR-11 | A forecast (UC09, carried over) is a projection, never presented as an actual figure. |
| BR-12 | **Detection runs on the collected data.** Unused = `Unassigned` seats; inactive = `Inactive` + `No activity`; overuse per BR-07. A result shows its evidence and data date. |
| BR-14 | **Real data first.** Every figure carries its source (`connector`, `bca`, `ilvg`, `budget_excel`, `mock`). Mock data is used only for a source that cannot deliver yet, is labelled as mock on every screen, and is never mixed into a real figure. |
| BR-15 | Every change to connectors, budget imports, users, the hierarchy, roles, and permissions is recorded with who, old value, new value, and time. |
| BR-16 | **Data scope comes from the server on every request.** A Manager reads the units assigned to them and everything under those units. Admin reads the group only through the group overview and the dashboards (UC36, UC15, UC16, UC18), as totals per P&L, never a unit's licenses or people. Staff see the connectors and license data of the companies they are assigned to — **an input user sees only their own company** — but no usage or waste analysis and no employee usage; group-level Staff see every company. An Employee sees only their own licenses. |
| BR-17 | Each account has exactly one role: Admin, Manager, Staff, or Employee. Permissions are granted to roles. The last active Admin cannot be disabled or lose the Admin role. |
| BR-18 | Wrong credentials show one generic message; 5 failed attempts in a row lock login for 15 minutes; passwords are stored hashed; the session lives in an `HttpOnly`, `Secure` cookie. |
| BR-19 | Every usage connector answers in the **license data contract** (system process). A validator checks every run: a record that fails is rejected with its reason; a run that fails writes nothing and the period stays `Unknown` (BR-04). |
| BR-20 | A connection is saved only after its test passes with read-only credentials. Credentials are write-only: never shown, exported, or logged. |
| BR-21 | **The hierarchy is fixed:** Group > P&L > Block > Department > Project. Levels cannot be added, removed, or reordered. Units come from ILVG. Every figure of a unit is the sum of the units under it. |
| BR-22 | **Waste flag:** a unit that wastes licenses is shown in red, at every level and in every view. A unit with missing data is `Not evaluated`, never red and never "no waste". |
| BR-23 | **Employee usage** is kept in its own table, per employee, application, and period, separate from the license usage tables, so later services and functions can use it. It is read only by the Managers of the employee's units. |
| BR-24 | **Waste = Purchased − Used**, per unit, license, and period. Unspent budget (Plan − Purchased) is not waste; it is its own indicator. Every waste view shows Plan, Purchased, and Used together, so a unit is judged on all three. |
| BR-25 | **Accrual:** the cost of a license term is spread over the months of the term. Monthly amounts may be rounded; the rounding difference goes to the last month of the term, so the months always add up to the cost. |
| BR-26 | **Shared license** (one license used across the group): kept on its own, not linked to a company's licenses or to budget lines, and not counted in any company's waste. *(Meaning to be confirmed, open decision 7.)* |
| BR-27 | **A holder is a person, not an email.** Holders are matched to the ILVG employee; one employee can have several emails over time. After a transfer, usage and cost count toward the old unit up to the transfer date and the new unit after it. A license still held by an old email of a transferred employee is flagged `Holder moved` for review. |
| BR-28 | **Account type:** each license account is `Personal`, `Shared` (group mailbox), or `Service`. A shared or service account counts toward the unit that owns it; its usage is judged at account level and never attributed to an individual. These accounts are listed separately in waste and inactive-usage views. |
| BR-29 | **Every metric is defined.** Each metric has a published definition — formula, unit, source, period, and what it excludes — shown in the app wherever the metric appears. Metrics are available along every dimension: organization level, license, provider, license type, and period. |
| BR-30 | *(Parked with UC12.)* **Planned top-up:** a top-up for a license in a coming month is read from the budget plan (BR-08). Until it is purchased the shortage stays visible as `Top-up planned`; once the purchase appears in the connector data, the shortage closes. |
| BR-31 | **Periods.** Year to date runs from January to the current month; a past year has 12 months. Months after the current month are never shown or offered. |
| BR-32 | **Connector status per license:** `Pending` — never synced (every license of a new connector starts here); `Active` — last sync on schedule; `Delayed` — last sync older than its schedule; `Failed` — last run failed. *Sync issues* = `Delayed` + `Failed`. Editing a connector's company, provider, authentication, or API URL sets all its licenses back to `Pending` and clears its last sync; other edits keep each license's status. |
| BR-33 | **Expiry.** Days to expiry = expiry date − today. Buckets: `≤ 30 days` (urgent), `31–60 days` (warning), `> 60 days`, `Expired`; the final 7 days of a term are marked. A license term without a start date runs one year back from its expiry. |
| BR-34 | **Allocation rate** = Allocated (assigned) ÷ Purchased. Above 100 % the license is over-allocated (BR-07). Allocation does not measure usage: a seat can be allocated and unused (UC11). |
| BR-35 | **Usage frequency** of a license holder over a period (last 30 days by default): *Days used* = days with activity in the license (connector) or the application (BCA, BR-23). Bands, as a share of working days: `Frequent` ≥ 50 %, `Occasional` 1–49 %, `None` 0 %; no usage source → `Not tracked`, never `None` (BR-04). *Thresholds to be confirmed (open decision 21).* |

## Use case diagrams

One diagram per actor. Sources (draw.io) are in [`diagrams/out/`](diagrams/out/); the PNG and SVG files are exported from them.

> The four diagrams below still show the previous model. They are redrawn after this use case list is agreed.

### Employee

![Employee use cases](diagrams/out/uc_employee.png)

### Staff

![Staff use cases](diagrams/out/uc_staff.png)

### Manager

![Manager use cases](diagrams/out/uc_manager.png)

### Admin

![Admin use cases](diagrams/out/uc_admin.png)

### Use case list

Existing use cases keep their numbers; new ones start at UC27, and UC42–UC47 come from the second revision. UC03 Manage License Entitlements is removed: licenses are no longer entered in ELMS.

The agreed use cases, by mind-map branch. *Demo:* D1 latest Usage & Connector demo, D1 v1 its earlier version, D2 waste demo, R requested on top of a demo, — no screen yet.

| ID | Use case | What the user can do | Actors | Demo |
|---|---|---|---|---|
| | **License Management** | | | |
| UC57 | View License List | See every license of the group with its monthly cost, company, allocated / purchased and days to expiry; search, filter by company and expiry, sort, page | Manager | D1 |
| UC58 | View License Validity Timeline | See each license term on a six-month timeline, move it month by month or back to today, spot licenses about to expire | Manager | D1 |
| UC59 | View License Details | Open a license: cost, start and expiry, unallocated or over-allocated seats | Manager | D1 |
| UC61 | View License Users and Activity | See who holds a license, who is active or inactive, when each last used it and how often; filter, search, export | Manager | R |
| UC02 | View Providers and Licenses | See the providers the group buys from and, per provider, its licenses and the companies using them | Manager | — |
| UC04 | View Contracts | See license terms — start, expiry, auto-renew, cost — and those renewing within 30 or 60 days | Manager | — |
| UC27 | View License Inventory by P&L | Pick a P&L and see every license it reports, grouped by provider | Manager, Staff | — |
| UC28 | View Licenses by Organization | Pick any unit and see its licenses, or pick a license and see which units use it | Manager | — |
| UC47 | Manage Shared Licenses | Record licenses shared across the group and keep them out of company figures | Staff | — |
| | **Usage** | | | |
| UC37 | Navigate Organization Scope | Choose the company or unit to analyse from the tree or the company picker; go down and back up the hierarchy | Manager | D1, D2 |
| UC08 | View Plan vs Utilization Balance | See Plan, Purchased and Used of the scope, whether it is over budget, and how much of what was bought is used | Manager | D1, D2 |
| UC48 | Compare Subordinate Units | Compare the units below the scope year to date or for a month; sort, search, switch currency | Manager | D1, D2 |
| UC49 | View Annual Trend by Unit | See each unit month by month over the year, with its efficiency | Manager | D1, D2 |
| UC50 | View Subordinate Units Table | Read every unit's Plan, Purchased, Used, Wasted, utilization and variance; open a P&L to see the same figures per license | Manager | D1, D2, R |
| UC51 | Export Usage Report | Download the units listed, with their figures, as CSV | Manager | D1, D2 |
| UC32 | Track Employee Usage | See how often each employee uses each application | Manager | — |
| | **Budget Management** | | | |
| UC33 | Import Budget Plan from Excel | Download the template, upload the budget plan of their units, check the preview, confirm | Manager | — |
| UC05 | View Monthly Budget Plan | See the plan by month and compare it with earlier versions | Manager | — |
| UC06 | Allocate License Cost | See the cost of each license split over the units that hold it | Manager | — |
| UC42 | Accrue License Cost | Spread license costs over the months of their terms, review rounding, close the month | Staff; Manager reads | — |
| UC07 | Manage Expenses | Record license expenses with their invoice, or import them from CSV | Staff | — |
| UC34 | Track Monthly Plan Variance | See how actual spending moves away from plan month by month | Manager | — |
| UC09 | Forecast License Spending | See the projected year-end spending against plan | Manager | — |
| | **Optimization** | | | |
| UC10 | Detect Unused Licenses | See seats bought but not given to anyone, and what they cost | Manager | — |
| UC11 | Detect Inactive Usage | See seats given to people who do not use them | Manager | — |
| UC35 | Flag P&L Waste | See which P&Ls waste licenses (in red) and what causes it | Manager | — |
| UC43 | Rank Units by Waste | See the units wasting the most money first | Manager | D2 |
| UC52 | Track Plan, Usage and Waste Trend | Follow Plan, Used and Wasted month by month on one chart | Manager | D1, D2, R |
| UC53 | View Waste Risk Distribution | Spot units where high spend meets high waste | Manager | D1, D2 |
| UC54 | View Monthly Waste Heatmap | See in which months each unit wastes, for any year | Manager | D1, D2 |
| | **Analytics** | | | |
| UC36 | View Group Overview | See every P&L of the group on one screen with its waste flag | Admin | D1, D2 |
| UC44 | Analyze by License and Provider | Read the same figures per license, provider or license type instead of per unit | Manager | — |
| UC45 | View Metric Definitions | Look up what each figure means and how it is computed | Manager | — |
| UC15 | View License Dashboard | See license counts, allocation and expiries at a glance | Manager; Admin (overview) | — |
| UC16 | View Financial Dashboard | See spending by month and unit, plan against actual, and the forecast | Manager; Admin (overview) | — |
| UC18 | View Optimization Dashboard | See waste, unused and inactive seats, and flagged P&Ls at a glance | Manager; Admin (overview) | — |
| | **User & Organization** | | | |
| UC19 | Manage Users | Create accounts for employees, reset passwords, disable accounts | Admin | — |
| UC20 | Manage Organization Hierarchy | Review the five-level hierarchy and assign Managers to units | Admin | — |
| UC21 | Manage Roles | Give each user one of the four roles | Admin | — |
| UC22 | Manage Permissions | Grant or remove permissions per role | Admin | — |
| | **Connection Management** | | | |
| UC38 | View Usage Connectors | See every company's connectors, providers and licenses with their sync status; search, filter, sort | Staff | D1 |
| UC55 | Create Usage Connector | Connect a company's provider: contact, API URL, credential, licenses | Staff | D1 |
| UC60 | Edit Usage Connector | Change a connector's settings or licenses, keeping or replacing its credential | Staff | D1 |
| UC56 | View Connector Details | Read a connector's settings and its licenses' status | Staff | D1 v1 |
| UC26 | Monitor Data Synchronization | Follow sync runs, see failures, rerun a period, pause a connector | Staff | — |
| | **Self-service** | | | |
| UC23 | View My Licenses | See the licenses they hold and whether they use them | Everyone | — |
| UC24 | Login / Logout | Sign in and out | Everyone | — |

**Retired:** UC03 Manage License Entitlements — licenses are no longer entered in ELMS; UC29–UC31 usage per license type — folded into the Usage screen (UC50 *License Monitoring*, UC61); UC17 Compliance Dashboard — compliance is out of scope; UC39 License Data Contract, UC40 BCA, UC41 ILVG, UC25 Map Connection Data, UC46 Resolve Holder Identity — handled by the system, not by a user (see [System processes](#system-processes)); UC01 Software Catalog — ELMS has no *software* level, only provider and license (UC02); UC13 Optimize License Cost, UC14 Manage Recommendations — ELMS does not track actions on licenses.

**Parked:** UC12 Detect License Shortage and Overuse — there is no defined way yet to detect a shortage beyond allocated > purchased, which the License List already shows (UC57, BR-34).

Money is in scope (BR-05).

## Use cases

### License Management

ELMS shows the licenses each P&L reports; nobody enters or grants a license in ELMS (BR-01).

#### UC27 View License Inventory by P&L

- **Actor:** Manager (own units), Staff (own companies — to check what the connectors deliver)
- **Main flow:** choose a P&L → table of every license it reports, grouped by provider (License, Provider, License type, Purchased, Assigned, Used, Purchased cost, Status, Expiry date, Data date) → search, filter by license type, provider, status → open a license: its fields from the connector, holders, and the units it belongs to
- **Alternative:** the P&L has no connector or no successful run → "No data yet", never an empty inventory (BR-04); a license not yet linked to the catalog → shown with the name the P&L gave and marked "Not mapped"; a figure the P&L does not report → `Unknown`
- **Result:** read-only; one list of what a P&L uses, without visiting the P&L

#### UC28 View Licenses by Organization

- **Actor:** Manager (own units)
- **Main flow:** choose a unit at any level (P&L, block, department, project) → licenses used by that unit (License, Provider, License type, Purchased, Assigned, Used, Cost) → open a license to see its split over the units below → switch to the opposite view: choose a license → which P&Ls, blocks, departments, and projects use it
- **Alternative:** a license or holder that cannot be placed in a unit → counted under "Unknown unit" of the nearest known level, so totals still add up (BR-21); a Manager choosing a unit outside their scope → `403`
- **Result:** read-only; every license is visible per company, block, department, and project

#### UC47 Manage Shared Licenses

- **Actor:** Staff (group level)
- **Main flow:** table of shared licenses — licenses used across the group rather than bought by one company (License, Provider, Quantity, Cost, Companies using it, Term) → create or edit a shared license → see which companies and holders use it → see its usage and waste on its own
- **Alternative:** a shared license also reported by a company connector → listed as "Also reported by <company>" for Staff to decide, never counted twice; a budget line linked to it → refused (BR-26)
- **Result:** shared licenses are visible but stay out of company figures, company budgets, and company waste (BR-26); the meaning of "shared license" is still to be confirmed (open decision 7)

#### UC57 View License List

- **Actor:** Manager (own units)
- **Demo:** D1 menu *License List* — the screen D1 opens on
- **Main flow:**
  - Header: *License List* with the total number of licenses, and "As of <date>" — the date of the data shown.
  - One row per license: logo, **license name** (opens UC59 with its users, UC61), **monthly cost** ("$4,125 / mo"), **company**; **Allocated / Purchased** — "420 / 500", the allocation rate and a bar (BR-34); **Expires in** — a coloured badge ("12 days", "Today", "8 days ago") and the expiry date (BR-33); the validity timeline (UC58).
  - Search *Search license or provider…* — matches license, provider, and company. Filters: *All companies*; *All expiry dates*, *Expires in 0–30 days*, *31–60 days*, *after 60 days*, *Expired*.
  - Sort by Expiry date (default, soonest first), License name, Monthly cost, Allocation rate, Purchased quantity; a button reverses the order; the License, Allocated / Purchased, and Expires in headings sort too, and a second click reverses.
  - With a search or filter on, a bar reads "n of N licenses match your filters" with *Clear filters*.
  - Paging: *Rows per page* 10, 20, 50; "Showing 1–10 of 24 licenses".
  - Legend: *Expires in ≤ 30 days*, *31–60 days*, *More than 60 days*, *Expired*, *Final 7 days*.
- **Alternative:** nothing matches → "No licenses found — Try a different search or clear the filters" with *Clear filters*; allocated above purchased → the allocation shows in red, "exceeds purchased quantity" (BR-07); a Manager or Staff → only licenses of their units or companies (BR-16); demo data → labelled (BR-14, the demo shows "Demo data")
- **Result:** read-only; one list of every license with what it costs a month, how much of it is allocated, and when it expires

#### UC58 View License Validity Timeline

- **Actor:** Manager (own units)
- **Demo:** D1 column *License validity* of the License List
- **Main flow:**
  - Each row of UC57 has a bar from the start to the end of the license term, on a six-month axis with month labels and a *Today* line.
  - The bar colour follows the expiry bucket (BR-33); the final 7 days are striped.
  - ‹ and › move the window one month back or forward; *Today* returns to the current window.
  - A term that runs past the window shows "Continues"; a term outside the window shows "Ended before this period" or "Starts after this period".
  - Hover or focus a bar → license, company, monthly cost, Allocated / Purchased, allocation rate, expiry date, time remaining. Selecting a bar opens UC59.
- **Alternative:** the table is wider than the screen → the timeline scrolls sideways
- **Result:** read-only; shows at a glance which licenses expire soon and which renewals overlap

#### UC59 View License Details

- **Actor:** Manager (own units)
- **Demo:** D1 dialog *License details*
- **Main flow:** select a license name or its timeline bar → dialog with logo, license name, provider; Company, Monthly cost, Start date, Expiry date, Expiry status (badge), Unallocated quantity — or Over-allocated quantity when allocated exceeds purchased; Allocated / Purchased with the bar → note "Allocated quantity represents assigned licenses. Actual usage is tracked separately in Usage." → below it, the users of the license (UC61) *(requested, not in the demo)* → Close, Esc, or a click outside
- **Alternative:** —
- **Result:** read-only; for the inventory per P&L see UC27, for money see the Usage screen

#### UC61 View License Users and Activity

- **Actor:** Manager (own units)
- **Demo:** none — *requested on top of D1 License List*
- **Trigger:** select a license in the License List (UC57) — its name or timeline bar; the users open in the license details (UC59). The same list opens from a license row of *License Monitoring* (UC50).
- **Main flow:**
  - **Summary:** Allocated, **Active**, **Inactive** (`Inactive` + `No activity`), **Not monitored**, and Unallocated seats (BR-03). Each count is a filter.
  - **Period:** last 30 days (default), last 90 days, or the current month.
  - **Table**, one row per holder: Employee (name, every email they hold, BR-27); Company and unit (Block › Department › Project); Status — Active, Inactive, No activity, Not monitored; **Last used** (date and "n days ago"); **Days used** in the period; **Frequency** — `Frequent`, `Occasional`, `None`, or `Not tracked`, with a bar of days used against working days (BR-35); Assigned since.
  - Search by name, email, or unit; sort by last used (default, oldest first), days used, name; paging 10 / 20 / 50; export CSV.
  - Select an employee → their usage across applications (UC32).
- **Alternative:**
  - a shared mailbox or service account → listed under *Shared & service accounts*, judged at account level, never as an inactive person (BR-28);
  - a holder whose unit changed and whose old email still holds the seat → marked `Holder moved` (BR-27);
  - an email not matched to an employee → shown as the email, "Unknown employee", to be corrected at the source;
  - a license without usage source → every holder `Not monitored`, frequency `Not tracked` (BR-04);
  - a usage-based license → the consumers (users, API keys, projects) with their consumption instead of days used;
  - allocated above purchased → the holders beyond the purchased quantity are marked (BR-34);
  - a Manager → only holders in their units; the others counted as "Outside your scope: n" (BR-16);
- **Result:** read-only; the counts equal Allocated in UC57; the inactive holders feed UC11

#### UC02 View Providers and Licenses

- **Actor:** Manager (own units)
- **Main flow:** list of the providers the connectors report — Microsoft, Atlassian, Adobe… (Provider, Licenses, Companies, Purchased, Allocated, Monthly cost) → search → open a provider: its licenses, and for each license the companies that use it → open a license (UC59)
- **Alternative:** a provider without licenses in the period → not listed; the same license reported under two names → listed twice until the names match at the source
- **Result:** read-only; providers and licenses are never created or edited in ELMS (BR-01)

#### UC04 View Contracts

- **Actor:** Manager (own units)
- **Main flow:** list of license terms as the connectors report them (License, Vendor, Company, Start, Expiry or renewal date, Auto-renew, Cost) → filter by vendor, company, renewal within 30 / 60 days → open a term: the license details (UC59)
- **Alternative:** a field the connector does not report (auto-renew, notice period) → "—", never guessed
- **Result:** read-only; contracts are not created or edited in ELMS (BR-01); expiry dates drive the License List (UC57, BR-33)

### Usage

One screen in both demos — D1 menu *Usage*, D2 menu *Tổng quan chi phí & sử dụng* — built on the organization tree and shown in money. Figures (BR-09, BR-24): **Plan Budget**; **Purchased Cost**; **Actual Used** — the license value of what is actually used, computed from usage telemetry, not an extra fee; **Wasted** = Purchased − Used; **Utilization rate** = Used ÷ Purchased; **Variance vs plan** = Purchased − Plan. Unspent budget is not waste. Periods follow BR-31. Every panel works on the scope chosen in UC37 and lists the units one level below it.

#### UC37 Navigate Organization Scope

- **Actor:** Manager (own units)
- **Demo:** D1 sidebar *Usage* with its tree; D2 sidebar *Phạm vi phân tích › Cơ cấu tổ chức*
- **Main flow:**
  - Open Usage → the scope is the Manager's highest assigned unit; a Manager of several P&Ls starts from the list of those P&Ls.
  - The sidebar tree lists Group > Company > Division > Department > Project > License; each node opens and closes with its chevron. The *Usage* menu button collapses or opens the whole tree.
  - Search in the tree (D2 *Tìm công ty con…*; D1 v1 *Search company or unit…*) → the tree keeps the matching nodes and opens their parents. D1 (latest) has no search in the tree; it searches in the header picker instead.
  - Select a node → it becomes the scope, every panel recalculates, and the page returns to the top.
  - The breadcrumb shows the path from the group; each ancestor is a link.
  - **Company picker** in the page header (D1): the button shows the current scope; it opens a list of the group and every company with a search box *Search company…*, a tick on the current one, and "n organizations available". ↓ moves into the list, Enter picks the first match, Home / End jump, Esc or a click outside closes. D2 uses a plain drop-down of the group and its companies.
  - The scope is kept in the page address, so a copied link opens the same scope.
  - Keyboard in the tree: ↑ / ↓ move between nodes, → / ← open, close, or go to the parent; Esc closes the tree.
- **Titles by level:** group — page *License Cost & Efficiency Analytics*, panel *Subsidiary Analytics*, table *Subordinate Subsidiaries*; company, division, department — the unit name, *<unit> Analytics*, *Subordinate Divisions / Departments / Projects*; project — panel **License Monitoring**, table *Subordinate Licenses*.
- **Alternative:** no match → "No matching company or unit" (tree) or "No matching companies" (picker); a Manager → the tree starts at their assigned units, nothing above them is shown or reachable (BR-16, `403`); a license selected as scope → the balance shows that license, and the panels below have nothing to list
- **Result:** read-only; one scope drives the whole Usage screen (UC08, UC48–UC51) and the waste analysis (UC43, UC52–UC54)

#### UC08 View Plan vs Utilization Balance

- **Actor:** Manager (own units)
- **Demo:** D1 *Plan vs. Utilization Balance* and *Cost Utilization Rate*; D2 *Cân đối kế hoạch và sử dụng* and *Tỷ lệ khai thác chi phí*
- **Main flow:**
  - For the scope and the period of UC48 (year to date by default, the chosen month, or the year):
  - **Balance:** three bars on one scale — Plan Budget, Purchased Cost, Actual Used — each with its amount.
  - **Badge:** Purchased above Plan → "Over budget +X"; otherwise "Savings vs budget −X". D2 adds a pill with the number of subordinate units ("31 công ty con").
  - **Utilization donut:** the share of Purchased that is used, "n % utilized", with the amounts Utilized, Wasted, and Purchased.
- **Alternative:** no plan for the scope → Plan "Not planned" and no badge; Purchased missing or zero → rate "—"; a missing figure → `Unknown`, never 0 (BR-04)
- **Result:** read-only; the figures of a unit equal the sum of the units under it (BR-21)

#### UC48 Compare Subordinate Units

- **Actor:** Manager (own units)
- **Demo:** D1 tabs *Year-to-Date (YTD)* and *Monthly Comparison*; D2 *Lũy kế từ đầu năm* and *So sánh theo tháng*
- **Main flow:**
  - Choose the tab: **YTD** (January to the current month) or **Monthly Comparison** (shows the *Month* selector).
  - Filters: *Year* (2023–2026), *Month*, *Sort by* — Waste high → low (default), Name A → Z, Name Z → A, Waste low → high, Plan Budget high → low, Actual Used high → low, Efficiency low → high — and *Currency* USD or VND (D1; D2 shows billion VND).
  - Search *Search entity name…*; a counter shows "shown / total".
  - The chart shows one column group per subordinate unit, eight units per card ("Group 01–08"); each card heads with its totals — Plan, Purchased, Wasted. Per unit: a Plan bar beside a Purchased bar split into Used and Wasted (D1 v1 drew Plan beside Used only). Legend: Plan Budget, Actual Used, Wasted; D2 adds a subtitle with the period, e.g. "Lũy kế 01–11/2026 · So sánh giữa các công ty".
  - Hover or focus a unit → a card with the period and four figures with their ratios: **Plan Budget**; **Purchased** and its % of plan; **Actual Used** and its % of purchased; **Wasted** and its % of purchased. Click its name, logo, or bars → go one level down (UC37).
- **Alternative:** nothing matches the search → "No units match the selected filter"; a month after the current month → not offered (BR-31)
- **Result:** read-only; search, sort, year, month, and currency also apply to UC49, UC50, UC51 and the waste panels (UC43, UC52–UC54)

#### UC49 View Annual Trend by Unit

- **Actor:** Manager (own units)
- **Demo:** D1 tab *Annual Trend*; D2 *Xu hướng cả năm*
- **Main flow:** choose the tab → one card per subordinate unit → per month from January to the current month: Plan beside Purchased split into Used and Wasted (D1 v1: Plan beside Used); hover or focus a month for the same figure card as UC48 → the card header shows the unit (link, goes one level down) and its **Efficiency** for the year (Used ÷ Purchased) → the footer shows the year's Plan, Used, and Wasted → hover a month for its figures
- **Alternative:** a past year → 12 months; nothing matches the search → empty message as in UC48
- **Result:** read-only; shows which units drift away from plan during the year

#### UC50 View Subordinate Units Table

- **Actor:** Manager (own units)
- **Demo:** D1 *Subordinate Subsidiaries*; D2 *Xếp hạng chi phí theo đơn vị*
- **Main flow:**
  - The units one level below the scope, in the order and with the search of UC48.
  - Columns: rank; **Entity / Unit** (logo, name, type — Subsidiary, Division, Department, Project, License); **Plan Budget**; **Purchased Cost**; **Actual Used**; **Wasted Spend**; **Utilization Rate** (bar and %); **Variance vs Plan** (+ in red when over plan, − in green when under).
  - Click a unit name → go one level down (UC37). At project scope the rows are the project's licenses (*License Monitoring*).
  - Paging (D1): *Rows per page* 10, 25, or 50; "Showing 1–10 of 31 entities"; Prev, page numbers, Next. D2 lists every row with "Hiển thị n đơn vị · Bấm vào đơn vị để đi sâu".
- **Flow A — license drop-down per unit** *(requested, not in the demo)*:
  - In *Subordinate Subsidiaries*, each P&L row gets an expand control (chevron) before its name. Selecting the row or the chevron opens a drop-down under it; selecting it again closes it; several P&Ls can be open at once. The P&L name stays the link that goes one level down (UC37).
  - The drop-down lists the licenses of that P&L for the period — one row per license: logo, license name, Provider, License type, then the **same columns as the P&L row**: Plan Budget, Purchased Cost, Actual Used, **Wasted Spend** (Purchased − Used of that license, BR-24), Utilization Rate, Variance vs Plan — so the money each license wastes reads directly under its P&L.
  - Hover or focus a license row → the figure card of UC48 for that license. Each license row carries its own waste flag (BR-22).
  - License rows follow the period, currency, and search of the table; default order Wasted Spend high → low. The license rows add up to the P&L row (BR-21). More than 10 licenses → the first 10 and "Show all (n)". Drop-down rows do not count toward *Rows per page*.
  - Selecting a license row opens its details and users (UC59, UC61). The same drop-down works at every level: in a P&L, each division expands into its licenses; and so on.
  - Export CSV includes the license rows of the P&Ls that are open (UC51).
- **Alternative:** nothing matches → "No matching results found"; a P&L without licenses in the period → its drop-down says "No licenses in this period"; a license with a missing figure → `Unknown` in that cell and the unit row marked "Totals incomplete"; a license name that matches no connector license → its reported name, marked "Not mapped"; shared licenses → never in a P&L drop-down (BR-26)
- **Result:** read-only; from the group, one step shows how much money each license of each P&L wastes

#### UC51 Export Usage Report

- **Actor:** Manager (own units)
- **Demo:** D1 *Export CSV*; D2 *Xuất CSV*
- **Main flow:** select Export → a CSV of the units listed for the scope, after search and sort, all pages: Entity / Unit, Type, Period, Plan Budget, Purchased Cost, Actual Used, Wasted Spend (in the chosen currency), Utilization Rate (%) → file name `vfast_<scope>_<year>_<mode>.csv`, UTF-8 with BOM so Excel shows Vietnamese
- **Alternative:** license rows open in UC50 flow A → included under their unit *(requested, not in the demo)*
- **Result:** the file matches what the screen lists

#### UC32 Track Employee Usage

- **Actor:** Manager (own units)
- **Demo:** none yet
- **Main flow:** choose a unit and a period → table of members (Employee, Unit, Application, Days used, Last used) from BCA → filter by application, unit, or frequency of use → open an employee: the applications they use and the licenses they hold → open an application: who uses it and how often
- **Alternative:** a member with no machine reporting to BCA → "Not tracked", never "not used" (BR-04); an application in use without a license reported by the P&L → listed as "No license reported"; a license holder with no use of the application → listed as a candidate for UC11
- **Result:** read-only; kept in its own table for later services and functions (BR-23); the fields are fixed when the BCA API is known

### Budget Management

The plan is imported from Excel (BR-08); the Usage screen compares it with what was purchased and used (UC08, BR-09).

#### UC33 Import Budget Plan from Excel

- **Actor:** Manager (own units)
- **Main flow:** download the ELMS Excel template → fill it from SAP → upload it for a company and a month or a year → preview the lines (P&L, Block code, Project code, Project name, License, Month, Planned quantity, Planned amount, Currency) with rows to add, replace, and reject → confirm → import history (who, when, file, rows)
- **Alternative:** a unit outside the Manager's scope → refused (BR-16); a row whose P&L, block, or project is not in the hierarchy → rejected with the reason, the file is not imported until it is fixed or the row is left out on purpose; a month already imported → replaced, the earlier version is kept (BR-08); a license name the connectors do not report → kept and marked "Not mapped"
- **Result:** the Plan figure of BR-09, per unit, license, and month, in quantity and amount, with source `budget_excel` (BR-14); a budget line is never linked to a shared license (BR-26)

#### UC05 View Monthly Budget Plan

- **Actor:** Manager (own units)
- **Main flow:** choose a fiscal year and a unit → plan by month (License, Planned quantity and amount per month, Year total) → group by P&L, block, or project → compare with the previous version of the plan
- **Alternative:** a unit without a plan → "Not planned", never 0; a plan changed by a new import → the changed lines are marked with the import that changed them
- **Result:** read-only; the plan is changed only by an Excel import (UC33)

#### UC06 Allocate License Cost

- **Actor:** Manager (own units)
- **Main flow:** choose period → table per license: total cost, seats, cost per seat, cost per unit → chart of cost per department → open a license to see which holders carry its cost
- **Alternative:** a license shared by several units → split by holders (BR-06)
- **Result:** the sum over all units equals the total cost

#### UC42 Accrue License Cost

- **Actor:** Staff (own companies) runs it; Manager reads it for their units
- **Main flow:** choose a company and a month → the system spreads the cost of every license term over its months (BR-25) → table (License, Term, Term cost, Accrued this month, Accrued to date, Remaining) → review the rounding applied → close the month → export the accrual for finance
- **Alternative:** a term that starts or ends mid-month → accrued by days in that month; a cost that changes mid-term (top-up, downgrade) → the rest of the term is re-spread from the change; a closed month → not recalculated, the difference goes into the next open month
- **Result:** monthly accrued cost per license and unit, summing exactly to the term cost; it feeds Purchased in monthly views (UC08, UC34)

#### UC07 Manage Expenses

- **Actor:** Staff (own companies)
- **Main flow:** expense table (Date, License, Vendor, Unit, Amount, Currency, Invoice) → add an expense with an optional invoice file → edit → import expenses from a CSV template
- **Alternative:** amount ≤ 0 or unknown license → field errors; invalid CSV row → whole file rejected
- **Result:** BR-10

#### UC34 Track Monthly Plan Variance

- **Actor:** Manager (own units)
- **Main flow:** choose a unit and a year → for each month: Plan, Purchased, Used, and the variance of actual against plan → chart of the variance by month → year-to-date total → list the licenses that explain most of a month's variance
- **Alternative:** a month without a plan or without actual data → no variance for that month, marked "Not planned" or `Unknown`; a month still running → marked "Month to date"
- **Result:** read-only; shows how actual moved away from the plan month by month

#### UC09 Forecast License Spending

- **Actor:** Manager (own units)
- **Main flow:** choose unit and fiscal year → actual by month and forecast for the remaining months → forecast year-end against the plan → upcoming renewals
- **Alternative:** too little history → forecast labelled "low confidence"
- **Result:** read-only; forecast and actual are never mixed in one figure (BR-11)

### Optimization

#### UC10 Detect Unused Licenses

- **Actor:** Manager (own units)
- **Main flow:** list of licenses with `Unassigned` seats (P&L, License, Purchased, Assigned, Unassigned, Cost of unassigned seats, Data date) sorted by unassigned seats → filter by unit → open the license and its users (UC59, UC61)
- **Alternative:** Assigned is `Unknown` → license excluded and counted as "Not evaluated"
- **Result:** BR-12; nothing changes at the P&L or the provider

#### UC11 Detect Inactive Usage

- **Actor:** Manager (own units)
- **Main flow:** list of seats in `Inactive` or `No activity` (Employee, Unit, License, Status, Last used) → filter by license, unit, status → open the license and its users (UC59, UC61)
- **Alternative:** `Not monitored` licenses excluded and counted separately (BR-04); a holder not matched to an employee → shown under "Unknown unit"; a holder who has left the company → listed as `Leaver`; a license left on the old email of a transferred employee → listed as `Holder moved` (BR-27); shared and service accounts → listed apart, never as an inactive person (BR-28)
- **Result:** BR-03, BR-12

#### UC35 Flag P&L Waste

- **Actor:** Manager (own units)
- **Main flow:** list of P&Ls with their waste status → a P&L that wastes licenses is shown in red (BR-22) → open a P&L: the figures behind the flag (Plan, Purchased, Used, Waste) and the blocks, departments, projects, and licenses that cause it, each with its own flag → the same flag is shown wherever the unit appears (UC37, UC50, UC53)
- **Alternative:** a P&L with missing data → `Not evaluated`, never red and never "no waste"; a P&L whose figures are mock data → flag shown with the mock label (BR-14)
- **Result:** read-only; one answer per P&L to "is it wasting licenses"; the ratio and threshold are an [open decision](#open-decisions)

**Waste analysis.** The section below the unit comparison — D1 *Waste Analytics* (trend, risk distribution, heatmap), D2 *Phân tích lãng phí* (the same plus the waste ranking) — and, in D2, the sidebar item **Xếp hạng lãng phí**, which sets the scope to the group, sorts by waste, and scrolls to this section. Every panel uses the scope of UC37, the period and search of UC48, and the units one level below the scope; a subtitle states the period ("Lũy kế 01–11/2026"). Waste per BR-24.

#### UC43 Rank Units by Waste

- **Actor:** Manager (own units)
- **Demo:** D2 *Đơn vị lãng phí nhiều nhất*
- **Main flow:** units sorted by Waste, high to low; the first 10, then "Xem tất cả (n)" / "Thu gọn" → per unit: logo, name, a bar on a common scale showing its Purchased split into Used and Waste, the Waste amount, and "n % chưa khai thác" (Waste ÷ Purchased) → hover: "<unit>: X lãng phí trên Y đã mua" → click → go one level down (UC37)
- **Alternative:** nothing matches → "Không có đơn vị phù hợp"; a unit without data → `Not evaluated`, never 0 % (BR-04)
- **Result:** read-only; the units wasting the most money come first

#### UC52 Track Plan, Usage and Waste Trend

- **Actor:** Manager (own units)
- **Demo:** D1 *Usage & Waste Trend · <year>*; D2 *Xu hướng sử dụng & lãng phí · <year>*
- **Main flow:**
  - One line chart, one point per month from January to the current month (BR-31). D1 sums the subordinate units listed after the search of UC48; D2 charts the scope itself.
  - The demo draws two lines: **Actual Used** (with a shaded area) and **Wasted**. **A third line, Plan Budget, is required** *(requested, not in the demo)*:
    - the planned amount of each month from the budget import (UC33, latest version), summed over the same units as the other two lines;
    - drawn in the Plan colour of UC48, with its own points; the legend lists three lines — Plan Budget, Actual Used, Wasted — and the title reads *Plan, Usage & Waste Trend · <year>*;
    - the vertical scale covers all three lines, so Plan above Used shows the unused budget and Wasted shows the money lost on what was bought.
  - Hover or focus a point → the figure card of UC48 for that month: Plan, Purchased (% of plan), Used and Wasted (% of purchased) — D1 shows this; D2 shows only the month's value. Hiding a line from the legend *(requested, not in the demo)*.
  - The current month is marked "Month to date": Plan is the full month, Used and Waste so far.
- **Alternative:** a month without a plan → the Plan line has a gap, not 0, and the tooltip says "Not planned"; a month without data → `Unknown`, no point drawn
- **Result:** read-only; shows month by month whether usage keeps up with the plan and where waste grows

#### UC53 View Waste Risk Distribution

- **Actor:** Manager (own units)
- **Demo:** D1 *Waste Risk Distribution*; D2 *Phân bố rủi ro lãng phí*
- **Main flow:** a scatter chart, one dot per subordinate unit: horizontal axis Purchased cost, vertical axis waste rate (%) → dashed lines at the median Purchased and the median waste rate → the top-right quadrant, *Chi phí cao · Tỷ lệ cao*, is shaded and its dots highlighted (D1 legend: *Business Units*, *Above Median Cost & Waste*) → dot size grows with the Waste amount → axes in the chosen currency ("Purchased Cost (USD million)", "Waste Rate (%)") → hover or focus: the figure card of UC48 → click, Enter, or Space on a dot → go one level down (UC37)
- **Alternative:** nothing matches → "Không có đơn vị phù hợp"
- **Result:** read-only; points to the units where high spend meets high waste

#### UC54 View Monthly Waste Heatmap

- **Actor:** Manager (own units)
- **Demo:** D1 *Monthly Waste Rate · <year>*; D2 *Tỷ lệ lãng phí theo tháng · <year>*
- **Main flow:** D1 has its own *Year* selector for the heatmap, independent of the year of UC48 → rows = subordinate units sorted by that year's Waste, high to low, the first 12 then "View all (n)" / "Show less" (D2 "Xem tất cả" / "Thu gọn") → columns Jan–Dec (T1–T12) → each cell shows the waste rate of that month, coloured on the scale *Ít lãng phí → Nhiều lãng phí* → hover or focus a cell: the figure card of UC48 for that unit and month → click a unit → go one level down (UC37)
- **Alternative:** a month not yet reached → "–" (*Future period* / *Chưa đến kỳ*); a month without data → `Not evaluated`
- **Result:** read-only; shows when in the year each unit wastes

### Analytics

#### UC36 View Group Overview

- **Actor:** Admin
- **Demo:** D1, D2 — the Usage screen at group scope, read-only for Admin: the balance (UC08) and one row per P&L, without going down into a P&L
- **Main flow:** one row or card per P&L of the group: Plan, Purchased, Used, Waste, utilization, and the waste flag — red when the P&L wastes licenses (UC35) → group totals → sort by waste → choose month or year; going down into a P&L is for its Manager (UC37)
- **Alternative:** a P&L without a connection or without data → shown as "No data yet", not left out; a P&L on mock data → labelled (BR-14)
- **Result:** read-only; amounts in VND or USD (BR-05); the whole group on one screen

#### UC44 Analyze by License and Provider

- **Actor:** Manager (own units)
- **Main flow:** choose a dimension — license, provider, or license type — and a period → per item: Plan, Purchased, Used, Waste, utilization, number of companies and holders → open an item: its split by company, block, department, and project → compare two periods → export CSV
- **Alternative:** a license reported under two names → listed under each name; amounts in several currencies → converted, the rate shown (BR-05)
- **Result:** read-only; the same metrics as the organization view, along the license axis (BR-29); which further dimensions the business wants is still to be confirmed (open decision 13)

#### UC45 View Metric Definitions

- **Actor:** Manager
- **Main flow:** catalog of metrics (Plan, Purchased, Used, Waste, Utilization rate, Variance against plan, Unspent budget, Shortage, Accrued cost…) → each with formula, unit, data source, period rule, and what it excludes → the same definition opens from the info icon beside the metric on any screen
- **Alternative:** a metric computed on mock or partial data → its definition says so (BR-14)
- **Result:** one definition per metric across the product (BR-29)

#### UC15 View License Dashboard

- **Actor:** Manager (own units), Admin (whole group, overview)
- **Main flow:** total licenses, licenses by category, license type, and provider, Purchased vs Assigned vs Used per license, licenses expiring within 30 days, top applications by holders split into `Active`, `Inactive`, `No activity` → choose a unit → click to open a license
- **Alternative:** no data → "No data yet", never zeros
- **Result:** read-only; counts match UC27

#### UC16 View Financial Dashboard

- **Actor:** Manager (own units), Admin (whole group, overview)
- **Main flow:** total yearly spend, spend by month, spend by unit (UC06), plan against actual (UC08), forecast year-end (UC09) → choose year and unit
- **Result:** read-only

#### UC18 View Optimization Dashboard

- **Actor:** Manager (own units), Admin (whole group, overview)
- **Main flow:** waste and utilization, unassigned seats, inactive seats, P&Ls flagged for waste → choose a unit
- **Alternative:** no usage data → "Not evaluated yet"
- **Result:** read-only; figures match UC10, UC11, UC35, UC43

### User & Organization

#### UC19 Manage Users

- **Actor:** Admin
- **Main flow:** user table (Name, Email, Role, Unit, Managed units, Status, Last login) → create an account for an employee known from ILVG: role → the system shows a one-time link to set the password → edit → reset password → disable or re-enable
- **Alternative:** email already exists → open that account; disabling oneself or the last active Admin → refused (BR-17); an employee who has left according to ILVG → account disabled automatically
- **Result:** disabling ends open sessions at once and never deletes the account; employees and their units come from ILVG (system process), not from manual entry

#### UC20 Manage Organization Hierarchy

- **Actor:** Admin
- **Main flow:** tree of the group in its five fixed levels: Group > P&L > Block > Department > Project (BR-21) → see each unit with its code, name, and source → assign Managers to a unit at any level → correct a unit that ILVG placed wrongly, with a reason → mark a unit inactive
- **Alternative:** adding, removing, or reordering a level → not possible; a unit under a parent of the wrong level → refused; a code from the budget plan or a connector that matches no unit → listed as "Unmatched" for Admin to link; a unit with members or an active plan → cannot be marked inactive
- **Result:** the hierarchy drives data scope (BR-16), roll-up of every figure, and the drill-down (UC37)

#### UC21 Manage Roles

- **Actor:** Admin
- **Main flow:** the four roles with their description and number of users → change the role of a user → see users per role
- **Alternative:** removing the Admin role from the last active Admin → refused; a Manager without a managed unit → warning that they will see no data
- **Result:** one role per account (BR-17)

#### UC22 Manage Permissions

- **Actor:** Admin
- **Main flow:** permission matrix (feature × role, read or write) → view the effective permissions of a role → grant or remove a permission for Manager, Staff, or Employee → save with a reason
- **Alternative:** removing a permission Admin needs to manage permissions → refused; giving Employee access to another person's usage → refused (BR-16)
- **Result:** permissions are per role (BR-17); every change recorded (BR-15)

### Connection Management

ELMS reads four kinds of source and writes to none of them (BR-01): usage connectors per company and provider, BCA, ILVG, and the budget Excel file (UC33). Fields each source can return: [Data fields research](07-data-fields-research.md).

#### UC38 View Usage Connectors

- **Actor:** Staff (own companies)
- **Demo:** D1 *Connector Management*
- **Main flow:**
  - Tiles: **Companies**, **Providers**, **Licenses**, **Sync Issues** (licenses `Delayed` or `Failed`, BR-32).
  - Search *Search company, provider, license…* — matches company ID and name, provider, connector ID, API contact and email, license name and ID.
  - Filters: *All companies*, *All providers*, *All statuses* (`Active`, `Delayed`, `Failed`, `Pending`). Sort: Name A–Z, Name Z–A, Most providers, Most licenses, Recent sync.
  - Tree table *Company / Provider / License*, columns Coverage, API Contact, Created, Last Sync, Status:
    - **Company** row — logo, tag *Company*, coverage "n providers · m licenses", API contact with an email link, Last Sync = the latest of its connectors. *D1 v1:* **+** to add a connector for this company.
    - **Provider** row — one connector: provider logo, tag *Provider*, coverage "m licenses", API contact, Created, Last Sync, column *Action* with **Edit** (UC60). *D1 v1:* **⋯** for details (UC56).
    - **License** row — name, tag *License*, Last Sync, status pill. *D1 v1:* **⋯** for details.
  - Company and provider rows open and close; a search or filter opens the rows that match.
  - Paging by company: 5, 8, or 10 per page; "1–8 of 10 companies".
- **Alternative:** nothing matches → "No matching results"; a connector never synced → Last Sync "—"; a company outside the Staff member's scope → not listed (BR-16)
- **Result:** read-only; shows, per company, which providers and licenses feed ELMS and which are in trouble

#### UC55 Create Usage Connector

- **Actor:** Staff (own companies)
- **Demo:** D1 *New Connector* dialog
- **Main flow:**
  - Open *New Connector*; the company filter of UC38, if set, preselects the company (*D1 v1:* also **+** on a company row).
  - **General:** Company\*, Provider\*, API Contact\* (up to 100 characters) and Contact Email\* (up to 160), both pre-filled with the company's API contact.
  - **API Connection:** API URL\* — the full HTTPS address of the usage endpoint, e.g. `https://api.provider.com/v1/usage`; Authentication\* — *API Key* or *Bearer Token*; the credential field follows it (API Key or Access Token), masked, with a show / hide toggle.
  - **Licenses\*:** type or pick a name — suggestions are the licenses already known for that provider — then *Add* or Enter; each license shows as a chip that can be removed. A name typed but not added is added on save.
  - *Create Connector* → the connector is named "<Company> – <Provider> Usage" and syncs every 6 hours; it appears under its company, opened; the list is filtered to that company; its licenses are `Pending` until the first sync (BR-32); "Connector created".
- **Removed from the form since D1 v1:** Connector Name (now generated), Sync Frequency (fixed at every 6 hours — whether it should be chosen again is open decision 18), Header Name, Usage Endpoint (now part of the API URL), and the authentication kinds OAuth 2.0, Basic Auth, None.
- **Alternative:** no license → "At least one license is required."; a license already added (case-insensitive) → "License already selected"; a required field empty, an invalid email, or a URL that is not HTTPS → field error; Cancel, Esc, or a click outside → closes without saving and clears the credential; Tab stays inside the dialog; test of the connection before saving *(not in the demo, required by BR-20)*
- **Result:** one connector per company and provider; the credential is never stored in clear, shown again, or logged (BR-20)

#### UC60 Edit Usage Connector

- **Actor:** Staff (own companies)
- **Demo:** D1 **Edit** on a provider row → dialog *Edit Connector*
- **Main flow:** the form of UC55 opens filled with the connector: company, provider, API contact and email, API URL, authentication, and its licenses as chips; the credential field is empty → change fields, add or remove licenses → *Save Changes* → "Connector updated"
- **Alternative:** provider and authentication unchanged → the credential is optional, "Leave blank to keep current credential"; provider or authentication changed → a new credential is required; company, provider, authentication, or API URL changed → every license goes back to `Pending` and the last sync is cleared (BR-32); otherwise a kept license keeps its ID and status, and an added license starts `Pending`; deleting a connector *(not in the demo, open decision 15)*; test of the connection before saving *(not in the demo, required by BR-20)*
- **Result:** the connector is updated; the old credential is never shown (BR-20)

#### UC56 View Connector Details

- **Actor:** Staff (own companies)
- **Demo:** D1 v1 *Connector Details* drawer — the latest D1 has no details view; its provider row offers Edit (UC60) instead
- **Main flow:** **⋯** on a provider or license row → drawer with the provider; Company, Connector ID, API Contact, Email, Created, Last Sync (date and time), Sync Frequency, number of Licenses, API Base URL and Authentication type — never the credential → *Licenses*: each with its ID and status → *Contact*: email link → Close or Esc
- **Alternative:** pause and run now *(not in the demo)* — they are in UC26; editing is UC60; deleting is open (open decision 15)
- **Result:** read-only

#### UC26 Monitor Data Synchronization

- **Actor:** Staff (own companies)
- **Main flow:** connection table (Source, P&L, Status, Schedule, Last run) → run table (Source, Data period, Status, Records received, accepted, rejected, Duration) → open a run: what is complete, partial, or failed, with the reason → Staff: rejected records with the check that failed → run now, or rerun a failed period → pause or resume a connection, change its schedule, replace its credentials
- **Alternative:** a run failed → nothing written, the period stays `Unknown` (BR-04, BR-19); the same period run twice → replaced, no duplicate; no successful run for 3 days → marked "Stale"; credentials replaced → the test must pass before they are saved (BR-20)
- **Result:** read and rerun only; ELMS never writes to a source (BR-01)

### Self-service

#### UC23 View My Licenses

- **Actor:** Employee, Staff, Manager, Admin
- **Main flow:** table of licenses the user holds, across all their emails (License, Provider, P&L, Assigned date, Status, Last used, Expiry date) → rows in `Inactive` or `No activity` carry a note that the seat may be reviewed → sort
- **Alternative:** no license → "You have no licenses assigned"; login email not matched → empty table with a hint to contact Admin; `Not monitored` → "Not tracked"
- **Result:** own rows only; another user's data returns `404`

#### UC24 Login / Logout

- **Actor:** Employee, Staff, Manager, Admin
- **Main flow:** email and password → system checks credentials and status → session created → default screen by role (Manager: Usage at their unit; Staff: Connector Management; Admin: Group Overview; Employee: My Licenses) → logout destroys the session
- **Alternative:** wrong credentials → generic message; 5 failures → locked 15 minutes; disabled account → refused; password not set yet → refused until the user opens the one-time link from Admin; session expired → log in again; screen outside the role → `403`
- **Result:** BR-18; SSO and self-registration are out of scope

## System processes

Done by ELMS on its own, with no user acting; they feed the use cases above.

| Process | What the system does | Feeds |
|---|---|---|
| Connector sync | Calls each usage connector on its schedule, validates every record against the license data contract (BR-19), stores licenses, holders, and activity | UC57–UC61, Usage screen |
| License data contract | One agreed response shape for every connector; versions are managed by the team, not in the product | BR-19 |
| ILVG sync | Reads employees and their units; keeps the organization hierarchy and holder identities up to date | UC19, UC20, UC37, UC61 |
| BCA sync | Reads how often each employee uses each application on company machines | UC32, UC61 |
| Data matching | Matches licenses, units, and budget lines across connectors, ILVG, and the budget file by their codes; what does not match is flagged `Not mapped` and corrected at the source | UC33, UC37, UC50 |
| Holder identity | Resolves each license account to an ILVG employee by employee ID; follows transfers and keeps every email of a person (BR-27); types shared mailboxes and service accounts (BR-28) | UC11, UC23, UC61 |

## Open decisions

These do not change the use case list; they are settled when each use case is detailed.

| # | Decision | Affects |
|---|---|---|
| 1 | Which source gives **Purchased**: the usage connector or the budget Excel | UC08, UC48, UC34, UC33 |
| 2 | The ratio and threshold that turn a unit red | UC35, BR-22 |
| 3 | Whether BCA identifies employees, and the key that joins BCA with ILVG | UC32, UC61 |
| 4 | Which project a seat counts toward when its holder works on several | UC28, UC50 |
| 5 | ~~Whether the money-based use cases stay~~ — **settled:** money is in scope (BR-05), they stay | — |
| 6 | The fields of the employee usage table | UC32, BR-23 |
| 7 | What "shared license" means: one license for the whole group, kept apart from company licenses and budgets (current reading) | UC47, BR-26 |
| 8 | Rounding unit of accrued amounts (e.g. thousand VND) and the month that absorbs the difference | UC42, BR-25 |
| 9 | Source and date of the VND / USD exchange rate | BR-05 |
| 10 | Handling of a shortage with a top-up planned for next month — parked with UC12 | BR-30 |
| 11 | Handling of a transferred employee with a new email whose old license is still assigned — proposal in BR-27 | UC61, system process |
| 12 | Identifying individuals behind a group mailbox — proposal in BR-28 | UC61, UC11, system process |
| 13 | Which further analysis dimensions the business wants (the meeting named "by license"; the rest was not recorded) | UC44, BR-29 |
| 14 | Who builds the endpoint behind a usage connector: the company, or ELMS calling the provider's admin API directly | UC55 |
| 15 | Deleting a connector — the latest demo edits but does not delete; and whether the details view (D1 v1) comes back | UC56, UC60 |
| 17 | Default screen after login — the latest demo opens on License List | UC24, UC57 |
| 18 | Sync frequency — fixed at every 6 hours in the latest demo, chosen per connector in D1 v1 | UC55, UC60 |
| 19 | Monthly cost in the License List — list price or the accrued cost of UC42, and in which currency | UC57, UC42 |
| 21 | Usage frequency: period, working days, and the band thresholds (proposal in BR-35) | UC61, BR-35 |

**Related:** [Research](01-research-top-down.md) · [INVEST requirements](03-invest-requirements.md) · [Data fields research](07-data-fields-research.md)
