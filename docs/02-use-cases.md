# Actors, Roles, Business Rules, and Use Cases

> Design status: TARGET (November 2026)
>
> Implementation status: NOT STARTED

System: **Enterprise License Management System (ELMS)**, built by team VFast. Use cases follow the seven branches of the [mind map](mindmap.png): License Management, Usage, Budget Management, Optimization, Analytics, User & Organization, Connection Management. The features of each use case are in the [Feature list](08-feature-list.md).

**Business model.** ELMS does not enter or grant licenses. Each P&L exposes a license API that ELMS calls; actual usage comes from BCA, employees and units from ILVG, and the monthly budget plan and the purchases from SAP. Views are built on three figures — Plan, Purchased, Used — in money as well as quantity, over a fixed hierarchy, Group > P&L > Block > Department > Project. A use case is one goal of its actor; the screens, panels, and dialogs that serve that goal are its flows.

**Use cases follow the UI demos.** Where a demo exists, the use case describes that screen as the demo shows it: **D1** — `VFast_Usage_Connector_Management (5).html`, the latest version (menus *License List*, *Usage*, *Connector Management*; it opens on License List); parts that only the earlier version (1) had are marked *D1 v1*; **D2** — `vfast_dashboard_waste_analytics.html` (menus *Tổng quan chi phí & sử dụng* and *Xếp hạng lãng phí*). D1 and D2 show the same Usage screen with its waste analysis; D2 also ranks units by waste. Behaviour requested on top of a demo is marked *(requested, not in the demo)*; behaviour a business rule requires but the demo lacks is marked *(not in the demo)*. Use cases without a demo screen are marked *Demo: none yet*.

## Actors / roles

| Actor | Description |
|---|---|
| `EMPLOYEE` | Every employee of the group. Only sees the licenses they hold and whether they are recorded as used |
| `STAFF` | Member of the license management team; does the hands-on work: sets up and edits usage connectors, watches the syncs, checks what each company's connectors deliver, imports the purchases from SAP and enters those made outside it, runs the monthly accrual, records exchange rates and shared licenses, keeps the software catalog and maps license and application names to it. Assigned to one or more companies (P&Ls) and sees only those; a Staff member at group level sees every company. Does not analyse usage or waste |
| `MANAGER` | **The main user.** Manager of a unit at any level: the group, a P&L, a block, a department, or a project. For that unit and everything under it: browses licenses and who uses them, analyses usage and waste, imports and changes the budget plan, reads the dashboards. A Manager of the group sees the whole group |
| `ADMIN` | Runs access to the system and nothing else: gives each user their role and data scope — the units of a Manager, the companies of a Staff member — sets the permissions of each role, and keeps the organization hierarchy. Sees no license, usage, budget, or cost data |
| Usage connectors | One connector per company and provider (Microsoft, Atlassian, Adobe…), answering in the license data contract. Returns the licenses of that provider the company uses, with holders and usage; not the quantities bought or the terms, which come from SAP |
| BCA | Usage tracking on company machines. Returns how often each member uses each application |
| ILVG | Internal application. Returns employees and the unit each belongs to; every account of ELMS is created from it (BR-16) |
| Budget Excel | The yearly budget plan by month, exported from SAP into the ELMS Excel template and imported by the Manager of a unit for that unit and the units under it (BR-08) |
| SAP purchases | Purchase requisitions (PR), purchase orders (PO), and invoices of each company, exported from SAP into the ELMS Excel template and imported by Staff each month (UC12, BR-10) |

Every account belongs to a real employee and is created from ILVG, so View My Licenses and Login / Logout belong to every role.

**Organization.** The hierarchy is fixed: **Group > P&L > Block > Department > Project** (BR-20). In this document a *unit* is a node at any of these levels. A Manager is assigned to one or more units, the group included, and sees them and everything under them. The demos name the levels differently: a P&L is *Company* or *Subsidiary*, a block is *Division*.

## Role × feature matrix

| Mind-map branch | Use cases | Admin | Manager | Staff | Employee |
|---|---|---|---|---|---|
| License Management | License information, license users and usage, license inventory (UC01–UC03) | | ✓ own units | inventory only, own companies | |
| | License catalog: software, mapping, shared licenses (UC04) | | read (software and category on every screen; the share of shared licenses their units carry) | ✓ catalog and shared licenses: group level; mapping: own companies | |
| Usage | Organization scope, Plan vs utilization balance, unit comparison, units table and export, employee usage (UC05–UC09) | | ✓ own units | | |
| Budget Management | Budget plan, forecast (UC10, UC14) | | ✓ own units and the units under them | | |
| | Cost accrual (UC11) | | read, own units | ✓ own companies | |
| | Purchases: SAP import and manual entry (UC12) | | | ✓ own companies | |
| | Exchange rates (UC13) | | read | ✓ group level | |
| Optimization | Wasted seats, waste ranking and flag, waste analytics (UC15–UC17) | | ✓ own units | | |
| Analytics | Dashboards, license and provider analysis, metric definitions (UC18–UC20) | | ✓ own units | | |
| User & Organization | User roles and permissions, organization hierarchy (UC21, UC22) | ✓ | | | |
| Connection Management | Usage connectors, sync monitoring (UC23, UC24) | | | ✓ own companies | |
| Self-service | My licenses, login / logout (UC25, UC26) | ✓ | ✓ | ✓ | ✓ |

**In short:** the Manager uses the product; Staff keeps it fed; Admin decides who can do what; the Employee sees their own licenses. Menus and buttons are hidden when the user lacks permission, but the API enforces every rule in this table; a URL outside the role returns `403`.

## Business rules

| ID | Rule |
|---|---|
| BR-01 | ELMS is read-only toward every source: usage connectors, BCA, ILVG, SAP. It never grants, assigns, revokes, buys, or renews a license; "Assigned" is data read from a P&L. |
| BR-02 | A license has one **license type**: `monthly`, `yearly`, or `usage_based`, reported by the P&L. Each type has its own actual-usage table; a new type later is a new table. |
| BR-03 | **Seat status.** Every assigned seat has exactly one status, judged on the data date over the last 30 days: `Active` — used at least once in the last 30 days; `Inactive` — used before, but not in the last 30 days; `No activity` — a usage source exists and the seat was never used in the 30 days or more since it was assigned; `Not monitored` — no usage source. A seat assigned less than 30 days ago and not used yet counts as `Active` until its 30th day (grace period). A paid seat without a holder is `Unassigned`. How often a holder uses the seat is BR-33. Monthly seat counts use the status on the last day of the month; monthly cost weighs the status of every day of the month (BR-06). |
| BR-04 | Missing data is `Unknown`, never 0. `Not monitored` is never counted as `Inactive` or as waste. Whatever cannot be judged — `Not monitored` seats and `Unknown` data — is **Not evaluated**: never Used, never Wasted (BR-23). |
| BR-05 | **Money and quantity.** Every figure has an amount and, where it applies, a quantity. Analysis screens show amounts by default, in VND or USD at the user's choice; quantities are shown per license, never added across licenses of different units of measure. Each amount keeps its original currency; the exchange rate used is shown. **An amount is converted with the rate in force on its invoice date**; a budget line in another currency with the rate of the first day of its month. |
| BR-06 | **Cost allocation** (the Cost roll-up process, shown in UC18): the cost of a license is split **day by day** — each day carries the month's cost divided by its days — evenly over its purchased seats, or over its assigned seats when more are assigned than purchased (BR-32); each assigned seat counts toward the unit of its holder on that day, so a transfer on 15 March gives the old unit 14 days and the new unit 17; a holder who works on several projects counts toward each of them in equal parts — two projects, half a seat and half the cost each — and nothing toward their own unit; **unassigned seats count toward *Unallocated* under the license's owner unit** — the P&L that bought it, or the group for a shared license (BR-25); holders that cannot be placed count toward *Unknown unit* of the nearest known level. The units, *Unallocated*, and *Unknown unit* add up to the total cost. A day without complete data takes the seats of the nearest complete day of the same month; the cost of a day that cannot be split — purchased quantity `Unknown`, or no complete day in the month — is `Not evaluated` under the owner unit (BR-04). |
| BR-07 | **Over-allocation:** a license is `Over-allocated` when the quantity allocated exceeds the quantity purchased (BR-32). Detecting a shortage beyond that is out of scope. |
| BR-08 | **The budget plan is imported from Excel**, in the ELMS template, by month. Each line carries the unit codes as deep as the line goes — P&L, block, department, project (with project name) — and the license, month, planned quantity, planned amount, and currency. A line belongs to the deepest unit it names. There is no *Shared* column: a line whose license is a shared license plans its unit's share of it (BR-25). **A line's license is found by name** — the name SAP uses, which is the name the connector reports unless Staff record another on the license (UC04) — among the licenses of the line's P&L and the shared licenses; no match → `Not mapped`, two matches → the row is rejected (UC10). **Every Manager imports and changes the plan of their own units, and a Manager of a larger unit also does it for every unit inside it**: the Manager of a P&L changes the P&L's own lines and those of each of its blocks, departments, and projects; the Manager of a block only the block and what is under it. An import has a target unit and months, and **changes only the licenses in its file**: for those months, in the target and every unit under it, a license already planned is overwritten — its lines the file no longer has are removed — and a new license is added; every other license and every other unit is left untouched. Example: the group imports only GitHub rows for P&L A and P&L B; their Microsoft 365 and Jira plans do not change. To drop a license from the plan, import it with quantity and amount 0. A unit's Plan = its own lines + the Plan of the units under it (BR-20), so no line is counted twice. Each confirmed import is a new version; earlier versions are kept. ELMS does not write the plan otherwise. Imports are idempotent (BR-34). |
| BR-09 | **Three figures per unit and period:** **Plan** (budget, BR-08); **Purchased** (the cost of what was bought: the accrued cost of the month, spread from the invoices, UC12, UC11; in quantity, the seats of the PO lines in force, BR-10; below the P&L, the cost of the seats its members hold, BR-06); **Used** (the value of what is actually used: for a seat-based license, the cost share of its `Active` seats, day by day (BR-06) — with the same seats all month, Purchased × Active seats ÷ purchased seats; for a `usage_based` license, the cost of what was consumed). Purchased = Used + Wasted + Not evaluated (BR-23). **Utilization rate** = Used ÷ Purchased and **waste rate** = Wasted ÷ Purchased; with the share Not evaluated they add up to 100 %. Monitoring and variance compare them month by month, year to date, and year by year. |
| BR-10 | **Purchases come from SAP** (UC12): Staff import each month the SAP export of PR, PO, and invoices of their companies, and enter by hand a purchase made outside SAP. A **PO line** has its company, license, quantity, term (start and end date), amount, currency, PO number and item, and the PR it came from; the PO lines in force on a day give the license's **purchased quantity** (BR-32), and their terms give its terms and expiry (UC01, BR-31). An **invoice** has its number, date, amount, currency, the company that pays it, the PO line it pays, and optionally a file; its amount is the cost the accrual spreads over the term of that PO line (UC11, BR-24). A purchase entered by hand has the same fields without PR and PO numbers; an invoice without a PO line names its license and the period it pays for. The license of a PO line is found by name as in BR-08, among the licenses of its company and the shared licenses. Example: PO 4500012345 item 10, GitHub Enterprise, 500 seats, 1 Mar 2027 – 29 Feb 2028; invoice of 1.2 billion VND dated 15 Mar 2027 → 500 purchased seats over that term, and the 1.2 billion spread over its 12 months. |
| BR-11 | A forecast (UC14) is a projection, never presented as an actual figure. |
| BR-12 | **Detection runs on the collected data.** Unused = `Unassigned` seats; inactive = `Inactive` + `No activity`; overuse per BR-07. A result shows its evidence, its cost, and the data date. |
| BR-13 | **Real data first.** Every figure carries its source (`connector`, `bca`, `ilvg`, `budget_excel`, `sap_excel`, `manual`, `mock`). Mock data is used only for a source that cannot deliver yet, is labelled as mock on every screen, and is never mixed into a real figure. |
| BR-14 | Every change to connectors, budget imports, purchase imports and entries, user roles and scopes, the hierarchy, and permissions is recorded with who, old value, new value, and time. |
| BR-15 | **Data scope comes from the server on every request.** A Manager reads the units assigned to them and everything under those units; a Manager assigned to the group reads the whole group. Admin reads users, roles, permissions, and the hierarchy only — no license, usage, budget, or cost data. Staff see the connectors and license data of the companies they are assigned to — **an input user sees only their own company** — but no usage or waste analysis and no employee usage; group-level Staff see every company. An Employee sees only their own licenses. |
| BR-16 | **Accounts come from ILVG.** Every employee ILVG reports gets one account, with the role Employee, and an email with a one-time link to set the password; an employee who leaves according to ILVG has their account disabled. Nobody creates an account by hand. Each account has exactly one role: Admin, Manager, Staff, or Employee; Admin changes it (UC21). Permissions are granted to roles. The last active Admin cannot be disabled or lose the Admin role. |
| BR-17 | Wrong credentials show one generic message; 5 failed attempts in a row lock login for 15 minutes; passwords are stored hashed; the session lives in an `HttpOnly`, `Secure` cookie. |
| BR-18 | Every usage connector answers in the **license data contract** (system process). A validator checks every run: a record that fails is rejected with its reason; a run that fails writes nothing and the period stays `Unknown` (BR-04). |
| BR-19 | A connection is saved only after its test passes with read-only credentials. Credentials are write-only: never shown, exported, or logged. |
| BR-20 | **The hierarchy is fixed:** Group > P&L > Block > Department > Project. Levels cannot be added, removed, or reordered. Units come from ILVG. Every figure of a unit is the sum of the units under it, plus its own budget lines (BR-08). Under each P&L, and under the group for shared licenses, *Unallocated* holds the unassigned seats (BR-06, BR-25) and *Unknown unit* the holders that cannot be placed; both appear wherever the units below are listed, so totals always add up. |
| BR-21 | **Waste flag:** a unit is shown in red when its **waste rate is above 20 %** — Wasted above 20 % of Purchased in the period (BR-23) — at every level and in every view. Example: Purchased 100 million, Wasted 25 million → 25 % → red; Wasted 15 million → 15 % → not red. A unit whose Purchased or Wasted is Unknown is `Not evaluated`, never red and never "no waste". |
| BR-22 | **Employee usage** is kept in its own table, per employee, application, and period, separate from the license usage tables, so later services and functions can use it. It is read only by the Managers of the employee's units. |
| BR-23 | **Purchased = Used + Wasted + Not evaluated**, per unit, license, and period. **Wasted** = the cost of `Unassigned`, `Inactive`, and `No activity` seats; **Not evaluated** = the cost that cannot be judged (BR-04), never added to Used or Wasted. Example: 100 seats for 100 million, 60 `Active`, 25 `Inactive`, 15 `Not monitored` → Used 60, Wasted 25, Not evaluated 15; waste rate 25 %, utilization rate 60 %. Unspent budget (Plan − Purchased) is not waste; it is its own indicator. Every waste view shows Plan, Purchased, and Used together, and Not evaluated whenever it is above zero, so a unit is judged on all of them. |
| BR-24 | **Accrual:** the cost of a license term is spread over the months of the term. Monthly amounts are **rounded to the thousand VND**; the rounding difference goes to the last month of the term, so the months always add up to the cost. Example: 100,000,000 over 12 months → 8,333,000 for 11 months and 8,337,000 for the last. |
| BR-25 | **Shared license** = one license bought once and used by **two or more companies**. Every license has an **owner unit** — the unit that buys and plans it: the P&L for a license used only inside that P&L (even across its blocks), the group for a shared license. Its cost is still **charged back** to the companies that use it: split over its seats, each held seat to the unit of its holder (BR-06), so each company pays for the seats its people hold and those seats count in the company's Purchased, Used, and Wasted. Its unassigned seats sit in *Unallocated* under the owner, the group, and are the group's waste. **The Manager of the group plans it with one budget line per P&L that uses it**, or deeper, down to blocks and departments, so each P&L's Plan includes its share and is compared with what that P&L is charged; a group-level line for it plans the seats the group keeps free. The budget file has no *Shared* column: a line plans the shared license when its license is the one marked shared (UC04, BR-08). A P&L that also buys its own license of the same software gives it another name in SAP — *GitHub Enterprise* for the shared one, *GitHub Enterprise A* for its own — and Staff record that name on the license when the connector reports another (UC04), so every budget line and PO line finds exactly one license. P&L Managers can then change or add the lines of their own units (BR-08). A license reported by two connectors is counted once. When a license becomes shared or stops being shared, closed months keep their owner and open months follow the new one; an invoice keeps the company that paid it. |
| BR-26 | **A holder is a person, not an email.** Holders are matched to the ILVG employee; one employee can have several emails over time. After a transfer, usage and cost count toward the old unit up to the transfer date and the new unit after it, day by day (BR-06); a transfer ILVG reports late counts from the day ELMS receives it. A license still held by an old email of a transferred employee is flagged `Holder moved` for review *(proposal)*. |
| BR-27 | **Account type:** each license account is `Personal`, `Shared` (group mailbox), or `Service`. A shared or service account counts toward the unit that owns it and is **judged as a whole account**: used by anyone in the last 30 days → `Active`, its cost Used; not used → `Inactive`, its cost Wasted. Its usage is never attributed to an individual, and these accounts are listed separately in waste and inactive-usage views, never as an inactive person. Example: sales@company.com, one M365 seat shared by five people, last used yesterday → Active. |
| BR-28 | **Every metric is defined.** Each metric has a published definition — formula, unit, source, period, and what it excludes — shown in the app wherever the metric appears. Metrics are available along every dimension: organization level, license, provider, license type, and period. |
| BR-29 | **Periods: complete months only.** Analysis shows a month only once it has ended: year to date runs from January to the **previous month**; a past year has 12 months; the current month and later months are never shown or offered. In January the new year has no complete month yet, so the default year is the previous one. *(The latest demos still show the current month.)* A past month whose accrual is not closed yet (UC11) is marked *Provisional*; a P&L month that carries the cost of a shared license stays *Provisional* until the group's month is closed too. |
| BR-30 | **Connector status per license:** `Pending` — never synced (every license of a new connector starts here); `Active` — last sync within its interval; `Delayed` — last sync older than its interval; `Failed` — last run failed; `Paused` — the connector is paused by Staff (UC24). *Sync issues* = `Delayed` + `Failed`; `Paused` is not a sync issue. **The sync interval is chosen per connector** (UC23), every 6 hours by default. While a connector is paused, every scheduled run is recorded as a normal sync run with status `Paused`: it reads nothing and the periods it covers stay `Unknown` (BR-04). Resuming starts a run at once. Editing a connector's company, provider, authentication, or API URL sets all its licenses back to `Pending` and clears its last sync; other edits, the interval included, keep each license's status; a paused connector stays paused. |
| BR-31 | **Expiry.** The expiry date is the end of the license's PO line in force (BR-10). Days to expiry = expiry date − today. Buckets: `≤ 30 days` (urgent), `31–60 days` (warning), `> 60 days`, `Expired`; the final 7 days of a term are marked. A license term without a start date runs one year back from its expiry. |
| BR-32 | **Allocation rate** = Allocated (assigned, from the connector) ÷ Purchased (the seats of the PO lines in force, BR-10). Above 100 % the license is over-allocated (BR-07). Allocation does not measure usage: a seat can be allocated and unused (UC15). |
| BR-33 | **Usage frequency** of a license holder over a period (the last 30 days unless the user picks another): *Days used* = distinct days with activity in the license (connector) or the application (BCA, BR-22); *Working days* = Monday to Friday without public holidays, counted from the later of the period start and the assigned date. It is shown as "days used / working days" with a bar (UC02) — for example 6 / 22 — **without bands**. No usage source, or a source that gives only the last activity date → `Not tracked`, never 0 (BR-04). A `usage_based` license shows its consumption instead. Frequency is information only: the seat status (BR-03) decides Used and Wasted. |
| BR-34 | **Idempotent imports.** An import that changes nothing — for example the same budget file again for the same target unit and months — creates no new version: "No changes". Confirming an import is done once, whatever the number of clicks or retries: each preview has its own key, and a second confirm of that key returns the first result. In a file, a unit, license, and month appear at most once; a duplicate row is rejected. If a line the file would change was changed after the preview by another import — at the same unit, a unit above, or a unit below — the confirm is refused — "The plan changed since your preview" — and the file must be previewed again. A sync run of the same source and period twice replaces the data and never duplicates it (UC24). A purchase file imported again updates the PO lines and invoices with the same numbers and never adds them twice (UC12). |
| BR-35 | **A plan is judged where it is set.** When a license is planned at a unit above the one being viewed — a shared license planned at the group, or a license a P&L plans for all its blocks — the units below carry its cost (BR-06, BR-25) but not its plan. They show that cost as *Planned at <unit>*, and leave it out of their Variance vs plan and their *Over budget* badge; the license is compared with its plan at the unit that holds the plan and above. A unit's Variance vs plan = Purchased of the licenses planned in the unit or under it − Plan. To compare a license at each unit, plan it per unit, as the group does for a shared license (BR-25). Example: GitHub costs 100 million a month — P&L A is charged 50, P&L B 30, and the 20 of the free seats stay with the group. The group plans A 50 and B 40: A compares 50 with 50, B 30 with 40, and the group 100 with 90, over by 10, the free seats being unplanned. Had the group written one group line of 90 instead, A and B would show their cost as *Planned at Tập đoàn* and only the group would compare 100 with 90. |
| BR-36 | **Software catalog.** Every license a connector reports is mapped to one software of the catalog (UC04), and each software has one category and subcategory; several licenses (tiers, SKUs) map to one software — *M365 E3* and *M365 E5* → *Microsoft 365*, category *Productivity*. A license not mapped yet is shown with the name the source gave, marked "Not mapped", and grouped under *Uncategorized*. The catalog is ELMS's own data and is never written to a source (BR-01). |

## Use case diagrams

One diagram per actor, listing every use case the actor can start, grouped by mind-map branch. They are generated from the use case list below by `docs/diagrams/ve_usecase.py` (draw.io sources and SVG in [`diagrams/out/`](diagrams/out/)), so rerun it after changing the list.

| Manager | Staff |
|---|---|
| ![Manager use cases](diagrams/out/uc_manager.png) | ![Staff use cases](diagrams/out/uc_staff.png) |

| Admin | Employee |
|---|---|
| ![Admin use cases](diagrams/out/uc_admin.png) | ![Employee use cases](diagrams/out/uc_employee.png) |

### Use case list

The use cases, by mind-map branch. *Demo:* D1 latest Usage & Connector demo, D1 v1 its earlier version, D2 waste demo, R requested on top of a demo, — no screen yet.

| ID | Use case | What the user can do | Actors | Demo |
|---|---|---|---|---|
| | **License Management** | | | |
| UC01 | View License Information | See every license with its monthly cost, company, allocated / purchased and days to expiry, its term on a validity timeline, and its details; search, filter, sort, page; list the terms of the PO lines and those renewing soon | Manager | D1 |
| UC02 | View License Users and Usage | See who holds a license, who is active or inactive, when each last used it and how often; filter, search, export | Manager | R |
| UC03 | Browse License Inventory | See the licenses of a P&L or of any unit, the units that use a license, and the licenses of each provider | Manager, Staff | — |
| UC04 | Manage License Catalog | Keep the list of software with its category, map each license name the connectors report to a software, and mark licenses used by two or more companies as shared, owned by the group | Staff | — |
| | **Usage** | | | |
| UC05 | Navigate Organization Scope | Choose the company or unit to analyse from the tree or the company picker; go down and back up the hierarchy | Manager | D1, D2 |
| UC06 | View Plan vs Utilization Balance | See Plan, Purchased and Used of the scope, whether it is over budget, and how much of what was bought is used | Manager | D1, D2 |
| UC07 | Compare Subordinate Units | Compare the units below the scope year to date, for a month, or month by month over the year; sort, search, switch currency | Manager | D1, D2 |
| UC08 | View Subordinate Units Table | Read every unit's Plan, Purchased, Used, Wasted, utilization and variance; open a P&L to see the same figures per license; export as CSV | Manager | D1, D2, R |
| UC09 | Track Employee Usage | See how often each employee uses each application | Manager | — |
| | **Budget Management** | | | |
| UC10 | Manage Budget Plan | Import the budget plan of their unit or of any unit under it from Excel, check the preview, confirm; see the plan by month and compare its versions | Manager | — |
| UC11 | Accrue License Cost | Spread license costs over the months of their terms, review rounding, close the month | Staff; Manager reads | — |
| UC12 | Manage Purchases | Import the PR, PO, and invoices exported from SAP each month, and enter a purchase made outside SAP | Staff | — |
| UC13 | Manage Exchange Rates | Enter the rate of each currency to VND from a date, used to convert invoices and budget lines | Staff | — |
| UC14 | Forecast License Spending | See the projected year-end spending against plan | Manager | — |
| | **Optimization** | | | |
| UC15 | Detect Wasted Seats | See seats bought but given to nobody, and seats not used for 30 days, with what they cost | Manager | — |
| UC16 | Rank and Flag Units by Waste | See the units wasting the most money first, those wasting more than 20 % in red, and what causes it | Manager | D2 |
| UC17 | View Waste Analytics | Follow Plan, Used and Wasted month by month, spot units where high spend meets high waste, and see in which months each unit wastes | Manager | D1, D2, R |
| | **Analytics** | | | |
| UC18 | View Dashboards | See licenses, spending against plan with cost per unit and variance, and waste at a glance | Manager | — |
| UC19 | Analyze by License and Provider | Read the same figures per license, software, category, provider or license type instead of per unit | Manager | — |
| UC20 | View Metric Definitions | Look up what each figure means and how it is computed | Manager | — |
| | **User & Organization** | | | |
| UC21 | Manage User Roles and Permissions | Give each user a role and a data scope, disable or re-enable access; grant or remove permissions per role | Admin | — |
| UC22 | Manage Organization Hierarchy | Review the five-level hierarchy and assign Managers to units | Admin | — |
| | **Connection Management** | | | |
| UC23 | Manage Usage Connectors | See every company's connectors, providers and licenses with their sync status; create, read, edit, and delete a connector | Staff | D1, D1 v1 |
| UC24 | Monitor Data Synchronization | Follow sync runs, see failures, rerun a period, pause or resume a connector | Staff | — |
| | **Self-service** | | | |
| UC25 | View My Licenses | See the licenses they hold and whether they use them | Everyone | — |
| UC26 | Login / Logout | Sign in and out, set the password from the link of the account email | Everyone | — |

**Out of scope:** entering or granting licenses in ELMS; recommendations and tracking of actions on licenses; a compliance dashboard; detecting a license shortage beyond allocated above purchased, which the License List already shows (UC01, BR-07); creating accounts by hand (BR-16). Matching connector data, BCA, ILVG, the license data contract, and holder identity are done by the system, not by a user (see [System processes](#system-processes)).

Money is in scope (BR-05).

## Use cases

### License Management

ELMS shows the licenses each P&L reports; nobody enters or grants a license in ELMS (BR-01).

#### UC01 View License Information

- **Actor:** Manager (own units)
- **Demo:** D1 menu *License List* — the screen D1 opens on — with its column *License validity* and its dialog *License details*
- **Main flow — License List:**
  - Header: *License List* with the total number of licenses, and "As of <date>" — the date of the data shown.
  - One row per license: logo, **license name** (opens the details, flow B), **monthly cost** ("$4,125 / mo": the accrued cost of the current month from the invoices, UC11), **company**; **Allocated / Purchased** — "420 / 500", the allocation rate and a bar (BR-32); **Expires in** — a coloured badge ("12 days", "Today", "8 days ago") and the expiry date (BR-31); the validity timeline (flow A).
  - Search *Search license or provider…* — matches license, provider, and company. Filters: *All companies*; *All expiry dates*, *Expires in 0–30 days*, *31–60 days*, *after 60 days*, *Expired*.
  - Sort by Expiry date (default, soonest first), License name, Monthly cost, Allocation rate, Purchased quantity; a button reverses the order; the License, Allocated / Purchased, and Expires in headings sort too, and a second click reverses.
  - With a search or filter on, a bar reads "n of N licenses match your filters" with *Clear filters*.
  - Paging: *Rows per page* 10, 20, 50; "Showing 1–10 of 24 licenses".
  - Legend: *Expires in ≤ 30 days*, *31–60 days*, *More than 60 days*, *Expired*, *Final 7 days*.
- **Flow A — validity timeline:**
  - Each row has a bar from the start to the end of the license term, on a six-month axis with month labels and a *Today* line.
  - The bar colour follows the expiry bucket (BR-31); the final 7 days are striped.
  - ‹ and › move the window one month back or forward; *Today* returns to the current window.
  - A term that runs past the window shows "Continues"; a term outside the window shows "Ended before this period" or "Starts after this period".
  - Hover or focus a bar → license, company, monthly cost, Allocated / Purchased, allocation rate, expiry date, time remaining. Selecting a bar opens the details (flow B).
- **Flow B — license details:** select a license name or its timeline bar → dialog with logo, license name, provider; Company, Monthly cost, Start date, Expiry date, Expiry status (badge), Unallocated quantity — or Over-allocated quantity when allocated exceeds purchased; Allocated / Purchased with the bar → note "Allocated quantity represents assigned licenses. Actual usage is tracked separately in Usage." → below it, the users of the license (UC02) *(requested, not in the demo)* → Close, Esc, or a click outside.
- **Flow C — license terms** *(no demo)*: switch to *Terms* → one row per PO line (BR-10) (License, Vendor, Company, PO, Start, Expiry, Quantity, Cost) → filter by vendor, company, renewal within 30 / 60 days → open a term: the license details (flow B).
- **Alternative:** nothing matches → "No licenses found — Try a different search or clear the filters" with *Clear filters*; allocated above purchased → the allocation shows in red, "exceeds purchased quantity" (BR-07); a Manager → only licenses of their units (BR-15); a Manager below the P&L → Allocated counts the seats held in their units, Purchased and monthly cost stay those of the P&L; demo data → labelled (BR-13, the demo shows "Demo data"); the table is wider than the screen → the timeline scrolls sideways; a field SAP does not give (auto-renew, notice period) → "—", never guessed; a purchase entered by hand → no PO number
- **Result:** read-only; one list of every license with what it costs a month, how much of it is allocated, and when it expires; terms change only through the purchases of UC12, and their expiry dates drive the list (BR-31); for the inventory per unit see UC03, for money see the Usage screen

#### UC02 View License Users and Usage

*Usage* here is how each holder uses one license — status, last used, days used; the Usage branch is cost and utilization per unit.

- **Actor:** Manager (own units)
- **Demo:** none — *requested on top of D1 License List*
- **Trigger:** select a license in the License List (UC01) — its name or timeline bar; the users open in the license details. The same list opens from a license row of *License Monitoring* (UC08).
- **Main flow:**
  - **Summary:** Allocated, **Active**, **Inactive** (`Inactive` + `No activity`), **Not monitored**, and Unallocated seats (BR-03). Each count is a filter.
  - **Period** for days used: last 30 days (default), last 90 days, or the previous month. The status always uses the last 30 days (BR-03).
  - **Table**, one row per holder: Employee (name, every email they hold, BR-26); Company and unit (Block › Department › Project); Status — Active, Inactive, No activity, Not monitored; **Last used** (date and "n days ago"); **Days used** in the period; **Days used / working days** with a bar, e.g. 6 / 22, or `Not tracked` (BR-33); Assigned since.
  - Search by name, email, or unit; sort by last used (default, oldest first), days used, name; paging 10 / 20 / 50; export CSV.
  - Select an employee → their usage across applications (UC09).
- **Alternative:**
  - a shared mailbox or service account → listed under *Shared & service accounts*, judged at account level, never as an inactive person (BR-27);
  - a holder whose unit changed and whose old email still holds the seat → marked `Holder moved` (BR-26);
  - an email not matched to an employee → shown as the email, "Unknown employee", to be corrected at the source;
  - a license without usage source → every holder `Not monitored`, days used `Not tracked` (BR-04);
  - a usage-based license → the consumers (users, API keys, projects) with their consumption instead of days used;
  - allocated above purchased → the holders beyond the purchased quantity are marked (BR-32);
  - a Manager → only holders in their units; the others counted as "Outside your scope: n" (BR-15)
- **Result:** read-only; the counts equal Allocated in UC01; the inactive holders feed UC15

#### UC03 Browse License Inventory

- **Actor:** Manager (own units); Staff (own companies — the inventory of a P&L, to check what the connectors deliver)
- **Demo:** none yet
- **Main flow — by unit:** choose a unit at any level (P&L, block, department, project) → every license it uses, grouped by provider (License, Provider, License type, Purchased, Assigned, Used, Purchased cost, Status, Expiry date, Data date) → search, filter by license type, provider, status → open a license: its fields from the connector, its holders, and its split over the units below
- **Flow A — by license:** switch to the opposite view: choose a license → which P&Ls, blocks, departments, and projects use it, with their share
- **Flow B — by provider:** list of the providers the connectors report — Microsoft, Atlassian, Adobe… (Provider, number of Licenses, Companies, Monthly cost) → search → open a provider: its licenses (License, License type, Purchased, Allocated, Monthly cost), and for each license the companies that use it → open a license (UC01). Quantities appear only on license rows: a provider row never adds seats of one license to tokens or devices of another (BR-05)
- **Alternative:** the P&L has no connector or no successful run → "No data yet", never an empty inventory (BR-04); a license not yet linked to the catalog → shown with the name the P&L gave and marked "Not mapped"; a figure the P&L does not report → `Unknown`; a license or holder that cannot be placed in a unit → counted under "Unknown unit" of the nearest known level, so totals still add up (BR-20); a unit outside the user's scope → `403`; a provider without licenses in the period → not listed; the same license reported under two names → listed twice until both map to the same software (UC04)
- **Result:** read-only; every license is visible per company, block, department, project, and provider, without visiting the P&L; providers and licenses are never created or edited in ELMS (BR-01)

#### UC04 Manage License Catalog

- **Actor:** Staff (group level) keep the software catalog and mark shared licenses; Staff (own companies) map the license names of their companies; Managers see software and category on every screen, and the share of shared licenses their units carry (UC03, UC08)
- **Demo:** none in D1; the React app shows category and subcategory per license
- **Main flow — software catalog:**
  - **Catalog:** one row per software (Software, Provider, Category, Subcategory, Licenses mapped, Companies) → search, filter by provider and category.
  - Create or edit a software: name, provider, category, subcategory. Categories and subcategories are a list kept here, e.g. *Productivity › Office & Collaboration*, *DevOps › Source Control*.
  - **Mapping:** the license names the connectors report (License name, Provider, Companies, Mapped to) → filter *Not mapped* → choose the software for a name; ELMS suggests the software of the same provider whose name matches best → the mapping applies to that license name from every company of that provider.
  - **Name in SAP:** when SAP names a license differently from its connector — the P&L's own *GitHub Enterprise A* next to the shared *GitHub Enterprise*, for example — Staff record the SAP name on the license, so the budget lines and PO lines find it (BR-08, BR-10, BR-25).
  - **Applications from BCA:** the application names BCA reports (Application, Employees using it, Mapped to) are mapped to a software the same way, so Track Employee Usage (UC09) can tell an application in use without a license and the license holders who never open the application.
- **Flow A — shared licenses:** tab *Shared* → licenses used by two or more companies (License, Provider, Purchased, Allocated, Monthly cost, Companies using it, Term, Source connector) → licenses whose holders belong to two or more companies are proposed as *Possibly shared* → Staff (group level) confirm: the owner unit becomes the group (BR-25) → open a shared license: the charge-back per company — seats held, share of cost, Used, Wasted — and *Unallocated*, the unassigned seats left with the group. The charge-back itself is computed by the system (Cost roll-up); Staff only decide which licenses are shared, because that changes who owns, plans, and wastes the license.
- **Example:** Company A reports *Microsoft 365 E3*, Company B *M365 E3*, Company C *Microsoft 365 E5*: all three map to *Microsoft 365* (*Productivity › Office & Collaboration*); the License Dashboard then counts them under one software and one category. GitHub Enterprise, 1,000 seats, 100 million VND a month (100,000 a seat), marked shared: Company A holds 500 seats, B 300; 200 seats are not assigned. A is charged 50 million a month, B 30 million; the 20 million of the 200 free seats sit in *Unallocated* under the group and are the group's waste. If 50 of A's seats are `Inactive`, 5 million of A's share is A's waste.
- **Alternative:**
  - catalog: a new license name from a connector → "Not mapped" and grouped under *Uncategorized* until mapped (BR-36); a mapping changed → recorded with who, old and new value (BR-14), and every screen follows it, history included; a software with mapped licenses → cannot be deleted, only merged into another; a category in use → cannot be deleted; a Staff member of one company → maps only the license names their companies report;
  - shared: a license whose holders all belong to one company → not proposed; Staff unmark a shared license → it goes back to the P&L of its connector; marking or unmarking changes the open months only, closed months keep their owner; the same license reported by two connectors → "Also reported by <company>", Staff pick the source, counted once; a holder that cannot be placed → *Unknown unit* (BR-20); a holder who moves to another company → charged to the old company up to the transfer date and to the new one after it (BR-26)
- **Result:** every license and every BCA application carries software, category, and subcategory, used by the License Dashboard (UC18), the analysis by license (UC19), employee usage (UC09), and the filters; each company's figures include its share of every shared license, the group plans each shared license with one line per P&L that uses it (BR-25), and the free seats are the group's cost and waste; the catalog never changes a source (BR-01)

### Usage

One screen in both demos — D1 menu *Usage*, D2 menu *Tổng quan chi phí & sử dụng* — built on the organization tree and shown in money. Figures (BR-09, BR-23): **Plan Budget**; **Purchased Cost**; **Actual Used** — the cost of the `Active` seats (or of what was consumed), computed from usage data, not an extra fee; **Wasted** — the cost of unassigned and inactive seats; **Not evaluated** — the cost that cannot be judged (BR-04); **Utilization rate** (also *Efficiency*) = Used ÷ Purchased; **Waste rate** (also *% chưa khai thác*) = Wasted ÷ Purchased, red above 20 % (BR-21); with the share Not evaluated they add up to 100 %; **Variance vs plan** = Purchased − Plan, for the licenses planned in the unit or under it (BR-35). Wherever Purchased is split into Used and Wasted, Not evaluated is the third part, shown whenever it is above zero. Unspent budget is not waste. Periods follow BR-29: complete months only, up to the previous month. Every panel works on the scope chosen in UC05 and lists the units one level below it, with *Unallocated* and *Unknown unit* under a P&L (BR-20).

#### UC05 Navigate Organization Scope

- **Actor:** Manager (own units)
- **Demo:** D1 sidebar *Usage* with its tree; D2 sidebar *Phạm vi phân tích › Cơ cấu tổ chức*
- **Main flow:**
  - Open Usage → the scope is the Manager's highest assigned unit — the group for a Manager of the group; a Manager of several units starts from the list of those units.
  - The sidebar tree lists Group > Company > Division > Department > Project > License; each node opens and closes with its chevron. The *Usage* menu button collapses or opens the whole tree.
  - Search in the tree (D2 *Tìm công ty con…*; D1 v1 *Search company or unit…*) → the tree keeps the matching nodes and opens their parents. D1 (latest) has no search in the tree; it searches in the header picker instead.
  - Select a node → it becomes the scope, every panel recalculates, and the page returns to the top.
  - The breadcrumb shows the path from the group; each ancestor is a link.
  - **Company picker** in the page header (D1): the button shows the current scope; it opens a list of the group and every company with a search box *Search company…*, a tick on the current one, and "n organizations available". ↓ moves into the list, Enter picks the first match, Home / End jump, Esc or a click outside closes. D2 uses a plain drop-down of the group and its companies.
  - The scope is kept in the page address, so a copied link opens the same scope.
  - Keyboard in the tree: ↑ / ↓ move between nodes, → / ← open, close, or go to the parent; Esc closes the tree.
- **Titles by level:** group — page *License Cost & Efficiency Analytics*, panel *Subsidiary Analytics*, table *Subordinate Subsidiaries*; company, division, department — the unit name, *<unit> Analytics*, *Subordinate Divisions / Departments / Projects*; project — panel **License Monitoring**, table *Subordinate Licenses*.
- **Alternative:** no match → "No matching company or unit" (tree) or "No matching companies" (picker); a Manager → the tree starts at their assigned units, nothing above them is shown or reachable (BR-15, `403`); a license selected as scope → the balance shows that license, and the panels below have nothing to list
- **Result:** read-only; one scope drives the whole Usage screen (UC06–UC08) and the waste analysis (UC16, UC17)

#### UC06 View Plan vs Utilization Balance

- **Actor:** Manager (own units)
- **Demo:** D1 *Plan vs. Utilization Balance* and *Cost Utilization Rate*; D2 *Cân đối kế hoạch và sử dụng* and *Tỷ lệ khai thác chi phí*
- **Main flow:**
  - For the scope and the period of UC07 (year to date by default, the chosen month, or the year):
  - **Balance:** three bars on one scale — Plan Budget, Purchased Cost, Actual Used — each with its amount.
  - **Badge:** Purchased above Plan → "Over budget +X"; otherwise "Savings vs budget −X". D2 adds a pill with the number of subordinate units ("31 công ty con").
  - **Utilization donut:** the share of Purchased that is used, "n % utilized", with the amounts Utilized, Wasted, Not evaluated (when above zero), and Purchased.
- **Alternative:** no plan for the scope → Plan "Not planned" and no badge; cost of licenses planned above the scope (a shared license, or a license the P&L plans for its blocks) → shown as *Planned at <unit>* and left out of the badge (BR-35); Purchased missing or zero → rate "—"; a missing figure → `Unknown`, never 0 (BR-04)
- **Result:** read-only; the figures of a unit equal the sum of the units under it (BR-20)

#### UC07 Compare Subordinate Units

- **Actor:** Manager (own units)
- **Demo:** D1 tabs *Year-to-Date (YTD)*, *Monthly Comparison*, and *Annual Trend*; D2 *Lũy kế từ đầu năm*, *So sánh theo tháng*, and *Xu hướng cả năm*
- **Main flow:**
  - Choose the tab: **YTD** (January to the previous month, BR-29), **Monthly Comparison** (shows the *Month* selector), or **Annual Trend** (flow A).
  - Filters: *Year* (2023–2026), *Month*, *Sort by* — Waste high → low (default), Name A → Z, Name Z → A, Waste low → high, Plan Budget high → low, Actual Used high → low, Efficiency low → high — and *Currency* USD or VND (D1; D2 shows billion VND).
  - Search *Search entity name…*; a counter shows "shown / total".
  - The chart shows one column group per subordinate unit, eight units per card ("Group 01–08"); each card heads with its totals — Plan, Purchased, Wasted. Per unit: a Plan bar beside a Purchased bar split into Used and Wasted (D1 v1 drew Plan beside Used only). Legend: Plan Budget, Actual Used, Wasted; D2 adds a subtitle with the period, e.g. "Lũy kế 01–10/2026 · So sánh giữa các công ty" in November 2026.
  - Hover or focus a unit → the **figure card**: the period and four figures with their ratios — **Plan Budget**; **Purchased** and its % of plan; **Actual Used** and its % of purchased; **Wasted** and its % of purchased. Click its name, logo, or bars → go one level down (UC05).
- **Flow A — annual trend:** choose the tab → one card per subordinate unit → per month from January to the previous month (BR-29): Plan beside Purchased split into Used and Wasted (D1 v1: Plan beside Used); hover or focus a month for the figure card → the card header shows the unit (link, goes one level down) and its **Efficiency** for the year (the utilization rate, Used ÷ Purchased) → the footer shows the year's Plan, Used, and Wasted
- **Alternative:** nothing matches the search → "No units match the selected filter"; the current month or a later one → not offered (BR-29); a past year → 12 months in the annual trend
- **Result:** read-only; shows which units drift away from plan, over the period and month by month; search, sort, year, month, and currency also apply to UC08 and the waste panels (UC16, UC17)

#### UC08 View Subordinate Units Table

- **Actor:** Manager (own units)
- **Demo:** D1 *Subordinate Subsidiaries* and *Export CSV*; D2 *Xếp hạng chi phí theo đơn vị* and *Xuất CSV*
- **Main flow:**
  - The units one level below the scope, in the order and with the search of UC07.
  - Columns: rank; **Entity / Unit** (logo, name, type — Subsidiary, Division, Department, Project, License); **Plan Budget**; **Purchased Cost**; **Actual Used**; **Wasted Spend**; **Utilization Rate** (bar and %); **Variance vs Plan** (+ in red when over plan, − in green when under; licenses planned above the unit left out, BR-35).
  - Click a unit name → go one level down (UC05). At project scope the rows are the project's licenses (*License Monitoring*).
  - Paging (D1): *Rows per page* 10, 25, or 50; "Showing 1–10 of 31 entities"; Prev, page numbers, Next. D2 lists every row with "Hiển thị n đơn vị · Bấm vào đơn vị để đi sâu".
- **Flow A — license heatmap per unit** (D1, latest; requested on top of the demo where marked):
  - In *Subordinate Subsidiaries*, each P&L row has an expand control (chevron) before its name, "expand license heatmap matrix". Selecting it opens a panel under the row; selecting it again closes it; several P&Ls can be open at once. The P&L name stays the link that goes one level down (UC05).
  - The panel is a heatmap of that P&L's licenses: one row per license (*License / Tool*: logo and name), one column per month from January to December of the heatmap year (UC17), each cell the license's waste in that month, with the scale *Low → High*; months not complete yet → "–" (BR-29).
  - **Rate / Cost switch:** *Rate* shows the waste rate of the cell (Wasted ÷ Purchased, BR-23); *Cost* shows the wasted amount in the chosen currency, coloured against the largest cell. One switch drives the heatmap of UC17 and every open panel: changing it in one place changes it everywhere.
  - Hover or focus a cell → the figure card of UC07 for that license and month (Plan, Purchased, Used, Wasted).
  - The license rows add up to the P&L (BR-20); a shared license shows the P&L's share and is marked *Shared* (BR-25). Selecting a license name opens its details and users (UC01, UC02) *(requested, not in the demo)*. The same panel at every level: in a P&L, each division opens into its licenses; and so on *(requested, not in the demo)*.
- **Flow B — export:** select Export → a CSV of the units listed for the scope, after search and sort, all pages: Entity / Unit, Type, Period, Plan Budget, Purchased Cost, Actual Used, Wasted Spend (in the chosen currency), Utilization Rate (%) → the license rows of the P&Ls open in flow A, under their unit *(requested, not in the demo)* → file name `vfast_<scope>_<year>_<mode>.csv`, UTF-8 with BOM so Excel shows Vietnamese
- **Alternative:** nothing matches → "No matching results found"; a P&L without licenses in the period → its panel says "No licenses in this period"; a license with a missing figure → `Not evaluated` in that cell and the unit row marked "Totals incomplete"; a license name not mapped to the catalog → its reported name, marked "Not mapped" (BR-36)
- **Result:** read-only; from the group, one step shows in which months each license of each P&L wastes, as a rate or in money; the exported file matches what the screen lists

#### UC09 Track Employee Usage

- **Actor:** Manager (own units)
- **Demo:** none yet
- **Main flow:** choose a unit and a period → table of members (Employee, Unit, Application, Days used, Last used) from BCA → filter by application, unit, or frequency of use → open an employee: the applications they use and the licenses they hold → open an application: who uses it and how often
- **Alternative:** a member with no machine reporting to BCA → "Not tracked", never "not used" (BR-04); an application in use without a license reported by the P&L, matched through the catalog (UC04) → listed as "No license reported"; a license holder with no use of the application → listed as a candidate for UC15
- **BCA, as assumed until its API is known:** an agent on each company machine reports, per day, the domain account of the user — which carries the ILVG employee code — the machine, and each application used with its active minutes. ELMS joins it to ILVG by employee code, otherwise by email.
- **Result:** read-only; kept in its own table for later services and functions (BR-22)

### Budget Management

The plan is imported from Excel (BR-08); the Usage screen compares it with what was purchased and used (UC06, BR-09).

#### UC10 Manage Budget Plan

- **Actor:** Manager (own units and every unit under them, BR-08)
- **Demo:** none yet
- **Main flow — import:** download the ELMS Excel template → fill it from SAP → choose the **target unit** — one of the Manager's units or any unit under it — and the months (one month or the year) → upload → preview, per unit, the lines (P&L, Block code, Department code, Project code, Project name, License, Month, Planned quantity, Planned amount, Currency) with rows to add, replace, remove, and reject → confirm → a new version of the plan of the target unit → import history (who, when, file, target unit, months, rows)
- **Flow A — monthly plan:** choose a fiscal year and a unit → plan by month (License, Planned quantity and amount per month, Year total) → group by P&L, block, or project → compare with an earlier version of the plan; the lines changed by an import are marked with that import and who made it, including an import by the Manager of a larger unit (BR-08)
- **Example:** the Manager of P&L A targets P&L A for 2027 → for each license in the file, the 2027 plan of P&L A and of all its blocks, departments, and projects is overwritten; licenses not in the file keep their plan. The Manager of Block A1 targets Block A1 → only Block A1 and what is under it change; the other blocks of P&L A keep their plan. The Manager of the group plans GitHub, marked shared (UC04), with one row per P&L that uses it (P&L A 50 million, P&L B 40 million) → each row plans that P&L's share, each P&L's Plan includes its row, and the other licenses of A and B keep their plan.
- **Alternative:**
  - a target outside the Manager's scope → refused (BR-15); a row for a unit outside the target and the units under it → rejected with the reason;
  - a row whose P&L, block, department, or project is not in the hierarchy → rejected with the reason; the file is not imported until it is fixed or the row is left out on purpose;
  - lines of a license in the file that the file no longer has, in the target or under it → listed as *rows to remove* in the preview, removed on confirm; licenses not in the file are not touched;
  - a license name that matches two licenses — a license of the P&L and a shared license with the same name → rejected with the reason; Staff record another SAP name on one of them (UC04, BR-25);
  - a file that changes nothing (the same file again, for example) → "No changes", no new version; Confirm pressed twice or retried after a time-out → applied once; the same unit, license, and month twice in a file → rejected; a line the file would change was changed by another import after the preview, at the same unit, above, or below → "The plan changed since your preview", preview again (BR-34);
  - a license name the connectors do not report → kept and marked "Not mapped" until a connector reports it or Staff record it as the SAP name of a license (UC04);
  - a unit without a plan → "Not planned", never 0
- **Result:** the Plan figure of BR-09, per unit, license, and month, in quantity and amount, with source `budget_excel` (BR-13); each line belongs to the deepest unit it names and is counted once (BR-08, BR-20); the earlier versions are kept; a budget line is never linked to a duplicate license (BR-25); the plan changes only through an import

#### UC11 Accrue License Cost

- **Actor:** Staff (own companies) runs it; Manager reads it for their units
- **Main flow:** choose a company and a month → the system spreads the cost of every license term — the invoices of its PO line (UC12, BR-10) — over the months of the term (BR-24) → table (License, Term, Term cost, Accrued this month, Accrued to date, Remaining) → review the rounding applied → close the month → export the accrual for finance
- **Alternative:** a term that starts or ends mid-month → accrued by days in that month; an invoice without a PO line, entered by hand → spread over the period it names; a term with a PO line but no invoice yet → nothing to spread, its months show Purchased `Unknown` (BR-04); a cost that changes mid-term (top-up, downgrade) → the rest of the term is re-spread from the change; a closed month → not recalculated, the difference goes into the next open month
- **Result:** monthly accrued cost per license and unit, summing exactly to the term cost; it is Purchased in every money view (BR-09); a closed month removes the *Provisional* mark (BR-29)

#### UC12 Manage Purchases

- **Actor:** Staff (own companies)
- **Main flow:** download the ELMS Excel template → fill it from the SAP export of the month: PR, PO lines, and invoices → upload → preview the PO lines (Company, PR, PO, Item, License, Quantity, Start, End, Amount, Currency) and the invoices (Company, Invoice, Date, PO, Item, Amount, Currency) with rows to add, update, and reject → confirm → purchases table (License, Company, PO, Term, Quantity, Invoiced, Source) → add a purchase made outside SAP by hand: license, quantity, term, amount, currency, and its invoice with an optional file → edit a hand entry → import history (who, when, file, rows)
- **Example:** the March 2027 export of company A has PO 4500012345 item 10, GitHub Enterprise, 500 seats, 1 Mar 2027 – 29 Feb 2028, and invoice 0001234 of 1.2 billion VND dated 15 Mar 2027 for that item → GitHub of A has 500 purchased seats until 29 Feb 2028 and 100 million accrued a month (UC11). The April export lists the same PO again → nothing is added (BR-34).
- **Alternative:**
  - a row of a company outside the Staff member's companies → rejected (BR-15);
  - a PO line whose license name matches no license of its company and no shared license → rejected with the reason: declare the license on its connector (UC23) or record its SAP name (UC04); a name that matches two licenses → rejected (BR-08);
  - an invoice whose PO line is neither in the file nor imported before → rejected; amount 0, quantity below 0, or an end before the start → rejected; the file is not imported until it is fixed or the rejected rows are left out on purpose;
  - a PO line or invoice changed in SAP → updated by the next import in an open month; in a closed month the difference goes to the next open month (UC11);
  - a hand entry → editable until its month is closed, then corrected only by a correcting entry;
  - a PO line without any invoice yet → its seats count, but its accrual waits and its months show Purchased `Unknown` (BR-04)
- **Result:** BR-10; PO lines give the purchased quantity and the terms (UC01, BR-31, BR-32); invoices are the cost the accrual spreads (UC11), and so the source of Purchased (BR-09); every import and hand entry is recorded (BR-14)

#### UC13 Manage Exchange Rates

- **Actor:** Staff (group level); Managers see the rate used beside every converted amount (BR-05)
- **Main flow:** table of rates (Currency, 1 unit = n VND, Effective from, Entered by) → add a rate for a currency from a date → the rate applies to every amount dated on or after that day until a newer rate starts → open a rate: the invoices and budget lines it converts
- **Example:** USD 25,400 from 1 Nov 2026 and 25,600 from 1 Dec 2026 → an invoice of 1,000 USD dated 15 Nov 2026 is 25,400,000 VND.
- **Alternative:** a rate of 0 or less → field error; a second rate for the same currency and day → replaces the first, unless a closed month already uses it; a correction → changes only figures of open months, closed months keep the rate they were computed with (BR-29); an amount with no rate for its date → its VND figure is `Unknown` and the amount is shown in its own currency, never added (BR-04, BR-05)
- **Result:** every amount is converted with the rate in force on its invoice date (BR-05); every change recorded (BR-14)

#### UC14 Forecast License Spending

- **Actor:** Manager (own units)
- **Main flow:** choose unit and fiscal year → Purchased by complete month (BR-29) and forecast for the remaining months, the current month included → forecast year-end against the plan → upcoming renewals
- **Alternative:** too little history → forecast labelled "low confidence"
- **Result:** read-only; forecast and actual are never mixed in one figure (BR-11)

### Optimization

#### UC15 Detect Wasted Seats

- **Actor:** Manager (own units)
- **Demo:** none yet
- **Main flow — unused seats:** tab *Unassigned* → licenses with `Unassigned` seats (P&L, License, Purchased, Assigned, Unassigned, Cost of unassigned seats per month and per year, Data date) sorted by the cost of unassigned seats → total cost of the list → filter by unit → open the license and its users (UC01, UC02)
- **Flow A — inactive seats:** tab *Inactive* → seats in `Inactive` or `No activity` (Employee, Unit, License, Status, Last used, Days without use, Cost of the seat per month and per year) → total cost of the listed seats per year, "n inactive seats cost X a year" (goal G4) → filter by license, unit, status → open the license and its users (UC01, UC02)
- **Alternative:** Assigned is `Unknown` → license excluded and counted as "Not evaluated"; a Manager below the P&L → unassigned seats belong to *Unallocated* of the P&L (BR-06), so the unused list is empty and says so; `Not monitored` licenses excluded and counted separately (BR-04); a holder not matched to an employee → shown under "Unknown unit"; a holder who has left the company → listed as `Leaver`; a license left on the old email of a transferred employee → listed as `Holder moved` (BR-26); shared and service accounts → listed apart, never as an inactive person (BR-27)
- **Result:** BR-03, BR-12; the two lists together are the Wasted of BR-23; nothing changes at the P&L or the provider

**Waste analysis.** The section below the unit comparison — D1 *Waste Analytics* (trend, risk distribution, heatmap), D2 *Phân tích lãng phí* (the same plus the waste ranking) — and, in D2, the sidebar item **Xếp hạng lãng phí**, which sets the scope to the Manager's highest unit (the group for a Manager of the group), sorts by waste, and scrolls to this section. Every panel uses the scope of UC05, the period and search of UC07, and the units one level below the scope; a subtitle states the period ("Lũy kế 01–10/2026" in November 2026, BR-29). Waste per BR-23.

#### UC16 Rank and Flag Units by Waste

- **Actor:** Manager (own units)
- **Demo:** D2 *Đơn vị lãng phí nhiều nhất*
- **Main flow:** units sorted by Waste, high to low; the first 10, then "Xem tất cả (n)" / "Thu gọn" → per unit: logo, name, a bar on a common scale showing its Purchased split into Used and Waste, the Waste amount, and "n % chưa khai thác" (the waste rate, Wasted ÷ Purchased) → a unit that wastes more than 20 % of what it buys is shown in red (BR-21) → hover: "<unit>: X lãng phí trên Y đã mua" → click → go one level down (UC05)
- **Flow A — waste flag:** open a flagged unit → the figures behind the flag (Plan, Purchased, Used, Waste) and the blocks, departments, projects, and licenses that cause it, each with its own flag → the same flag is shown wherever the unit appears (UC05, UC08, UC17)
- **Alternative:** nothing matches → "Không có đơn vị phù hợp"; a unit with missing data → `Not evaluated`, never 0 %, never red, and never "no waste" (BR-04); a unit whose figures are mock data → flag shown with the mock label (BR-13)
- **Result:** read-only; the units wasting the most money come first, and each unit has one answer to "is it wasting licenses": red when Wasted is above 20 % of Purchased (BR-21)

#### UC17 View Waste Analytics

- **Actor:** Manager (own units)
- **Demo:** D1 *Waste Analytics*; D2 *Phân tích lãng phí*
- **Main flow — Plan, usage and waste trend** (D1 *Usage & Waste Trend · <year>*, followed; D2 *Xu hướng sử dụng & lãng phí · <year>*):
  - One line chart, one point per month from January to the previous month (BR-29). **The chart follows the search of UC07 (as D1):** it sums the subordinate units listed after the search, so a search for "Vin" that leaves 5 of 31 companies charts those 5. A note above the chart reads "Filtered: 5 of 31 units" while a search is on *(requested, not in the demo)*; without a search, the sum equals the scope (BR-20). D2, which charts the scope whatever the search, is not followed.
  - Three lines (D1, latest): **Plan Budget**, **Actual Used** (with a shaded area), and **Wasted**:
    - Plan is the planned amount of each month from the budget import (UC10, latest version), summed over the same units as the other two lines; it has its own points, and hovering anywhere on the line shows the figure card;
    - the legend lists the three lines; the title reads *Usage & Waste Trend · <year>* in the demo, *Plan, Usage & Waste Trend · <year>* requested;
    - the vertical scale covers all three lines, so Plan above Used shows the unused budget and Wasted shows the money lost on what was bought.
  - Hover or focus a point → the figure card of UC07 for that month: Plan, Purchased (% of plan), Used and Wasted (% of purchased) — D1 shows this; D2 shows only the month's value. Hiding a line from the legend *(requested, not in the demo)*.
  - The current month is not drawn until it ends, so a full month of Plan and Purchased is never compared with part of a month of Used (BR-29).
- **Flow A — waste risk distribution** (D1 *Waste Risk Distribution*; D2 *Phân bố rủi ro lãng phí*): a scatter chart, one dot per subordinate unit: horizontal axis Purchased cost, vertical axis waste rate (%) → dashed lines at the median Purchased and the median waste rate → the top-right quadrant, *Chi phí cao · Tỷ lệ cao*, is shaded and its dots highlighted (D1 legend: *Business Units*, *Above Median Cost & Waste*) → dot size grows with the Waste amount → axes in the chosen currency ("Purchased Cost (USD million)", "Waste Rate (%)") → hover or focus: the figure card of UC07 → click, Enter, or Space on a dot → go one level down (UC05)
- **Flow B — monthly waste heatmap** (D1 *Monthly Waste Rate · <year>* / *Monthly Waste Cost · <year>*; D2 *Tỷ lệ lãng phí theo tháng · <year>*): D1 has its own *Year* selector for the heatmap, independent of the year of UC07 → rows = subordinate units sorted by that year's Waste, high to low, the first 12 then "View all (n)" / "Show less" (D2 "Xem tất cả" / "Thu gọn") → columns Jan–Dec (T1–T12) → **Rate / Cost switch** (D1): *Rate* — each cell shows the waste rate of that month (BR-23), title *Monthly Waste Rate*; *Cost* — each cell shows the wasted amount in the chosen currency, coloured against the largest cell shown, title *Monthly Waste Cost*; the same switch drives the license panels of UC08 → cells coloured on the scale *Ít lãng phí → Nhiều lãng phí* → hover or focus a cell: the figure card of UC07 for that unit and month → click a unit → go one level down (UC05)
- **Alternative:** a month without a plan → the Plan line has a gap, not 0, and the tooltip says "Not planned"; a month without data → `Unknown`, no point drawn, and `Not evaluated` in the heatmap; nothing matches → "Không có đơn vị phù hợp"; the current month and later months → "–" in the heatmap (*Future period* / *Chưa đến kỳ*, BR-29)
- **Result:** read-only; shows month by month whether usage keeps up with the plan and where waste grows, the units where high spend meets high waste, and when in the year each unit wastes, as a rate or in money

### Analytics

#### UC18 View Dashboards

- **Actor:** Manager (own units)
- **Demo:** none yet
- **Main flow:** open *Dashboards* → choose a unit and a year → three tabs:
  - **Licenses:** total licenses, licenses by category, license type, and provider, Purchased vs Assigned vs Used per license, licenses expiring within 30 days, top applications by holders split into `Active`, `Inactive`, `No activity` → click to open a license (UC01, UC02).
  - **Financial:** total yearly spend (Purchased, BR-09), spend by complete month (BR-29), plan against actual (UC06), forecast year-end (UC14).
  - **Optimization:** waste, utilization, and Not evaluated (BR-23), unassigned seats, inactive seats, units flagged for waste (UC15, UC16).
- **Flow A — cost per unit** (Financial tab): choose a period → table per license: total cost, seats, cost per seat, cost per unit → chart of cost per department → open a license to see which holders carry its cost (BR-06)
- **Flow B — monthly plan variance** (Financial tab): for each complete month (BR-29): Plan, Purchased, Used, and the variance against plan (BR-35) → chart of the variance by month → year-to-date total → list the licenses that explain most of a month's variance
- **Alternative:** no data → "No data yet", never zeros; no usage data → "Not evaluated yet"; a license shared by several units → split by holders, unassigned seats → *Unallocated* under the owner unit, holders that cannot be placed → *Unknown unit* (BR-06); a month without a plan or without purchased data → no variance for that month, marked "Not planned" or `Unknown`; the current month → not shown until it ends (BR-29); a month whose accrual is not closed → marked *Provisional*
- **Result:** read-only; counts match the License List (UC01), waste figures match UC15 and UC16; the cost over all units, *Unallocated*, and *Unknown unit* equals the total cost; the variance shows how actual moved away from the plan month by month

#### UC19 Analyze by License and Provider

- **Actor:** Manager (own units)
- **Main flow:** choose a dimension — license, software, category, provider, or license type (BR-36) — and a period → per item: Plan, Purchased, Used, Waste, utilization, number of companies and holders → open an item: its split by company, block, department, and project → compare two periods → export CSV
- **Alternative:** a license reported under two names → one row once both names map to the same software (UC04), until then listed under each name; a license not mapped → under *Uncategorized*; amounts in several currencies → converted, the rate shown (BR-05)
- **Result:** read-only; the same metrics as the organization view, along the license axis (BR-28)

#### UC20 View Metric Definitions

- **Actor:** Manager
- **Main flow:** catalog of metrics (Plan, Purchased, Used, Waste, Utilization rate, Variance against plan, Unspent budget, Shortage, Accrued cost…) → each with formula, unit, data source, period rule, and what it excludes → the same definition opens from the info icon beside the metric on any screen
- **Alternative:** a metric computed on mock or partial data → its definition says so (BR-13)
- **Result:** one definition per metric across the product (BR-28)

### User & Organization

Accounts are not created in ELMS: every employee ILVG reports has one, with the role Employee, and receives a one-time link to set the password; a leaver's account is disabled (BR-16, [System processes](#system-processes)). Admin decides only what each account may do.

#### UC21 Manage User Roles and Permissions

- **Actor:** Admin
- **Demo:** none yet
- **Main flow — users:** user table (Name, Email, Role, Unit, Managed units or companies, Status, Last login) → search, filter by role, unit, status → open a user → change the role → for a Manager, the units they manage, the group included; for Staff, the companies they work on, or group level (BR-15) → disable or re-enable access → save
- **Flow A — roles:** the four roles with their description and number of users → see the users of a role
- **Flow B — permissions:** permission matrix (feature × role, read or write) → view the effective permissions of a role → grant or remove a permission for Manager, Staff, or Employee → save with a reason
- **Alternative:** removing the Admin role from the last active Admin, or disabling oneself or the last active Admin → refused (BR-16); a Manager without a managed unit → warning that they will see no data; removing a permission Admin needs to manage permissions → refused; giving Employee access to another person's usage → refused (BR-15); an employee who has left according to ILVG → already disabled, cannot be re-enabled
- **Result:** one role per account (BR-16); permissions are per role; disabling ends open sessions at once and never deletes the account; every change recorded (BR-14)

#### UC22 Manage Organization Hierarchy

- **Actor:** Admin
- **Main flow:** tree of the group in its five fixed levels: Group > P&L > Block > Department > Project (BR-20) → see each unit with its code, name, and source → assign Managers to a unit at any level, the group included → correct a unit that ILVG placed wrongly, with a reason → mark a unit inactive
- **Alternative:** adding, removing, or reordering a level → not possible; a unit under a parent of the wrong level → refused; a code from the budget plan or a connector that matches no unit → listed as "Unmatched" for Admin to link; a unit with members or an active plan → cannot be marked inactive by Admin; ILVG no longer reports a unit that still has members, a plan, or licenses → the unit is marked inactive and listed for Admin to move them
- **Result:** the hierarchy drives data scope (BR-15), roll-up of every figure, and the drill-down (UC05)

### Connection Management

ELMS reads four kinds of source and writes to none of them (BR-01): usage connectors per company and provider, BCA, ILVG, and the budget Excel file (UC10). Fields each source can return: [Data fields research](09-data-fields-research.md).

#### UC23 Manage Usage Connectors

- **Actor:** Staff (own companies)
- **Demo:** D1 *Connector Management*, *New Connector* and *Edit Connector* dialogs; D1 v1 *Connector Details* drawer
- **Main flow — connector list:**
  - Tiles: **Companies**, **Providers**, **Licenses**, **Sync Issues** (licenses `Delayed` or `Failed`, BR-30).
  - Search *Search company, provider, license…* — matches company ID and name, provider, connector ID, API contact and email, license name and ID.
  - Filters: *All companies*, *All providers*, *All statuses* (`Active`, `Delayed`, `Failed`, `Pending`, `Paused` — *Paused not in the demo*, BR-30). Sort: Name A–Z, Name Z–A, Most providers, Most licenses, Recent sync.
  - Tree table *Company / Provider / License*, columns Coverage, API Contact, Created, Last Sync, Status:
    - **Company** row — logo, tag *Company*, coverage "n providers · m licenses", API contact with an email link, Last Sync = the latest of its connectors. *D1 v1:* **+** to add a connector for this company (flow A).
    - **Provider** row — one connector: provider logo, tag *Provider*, coverage "m licenses", API contact, Created, Last Sync, column *Action* with **Edit** (flow B). *D1 v1:* **⋯** for details (flow C).
    - **License** row — name, tag *License*, Last Sync, status pill. *D1 v1:* **⋯** for details.
  - Company and provider rows open and close; a search or filter opens the rows that match.
  - Paging by company: 5, 8, or 10 per page; "1–8 of 10 companies".
- **Flow A — create a connector:**
  - Open *New Connector*; the company filter of the list, if set, preselects the company (*D1 v1:* also **+** on a company row).
  - **General:** Company\*, Provider\*, API Contact\* (up to 100 characters) and Contact Email\* (up to 160), both pre-filled with the company's API contact.
  - **API Connection:** API URL\* — the full HTTPS address of the usage endpoint, e.g. `https://api.provider.com/v1/usage`; Authentication\* — *API Key* or *Bearer Token*; the credential field follows it (API Key or Access Token), masked, with a show / hide toggle.
  - **Sync interval\*** — how often the connector runs, typed freely in hours (at least 1), 6 by default (BR-30) *(not in the latest demo, which fixes it at 6 hours)*.
  - The API URL is an endpoint the P&L provides for its own data, answering in the license data contract (BR-18); ELMS does not call the provider's admin API directly.
  - **Licenses\*:** type or pick a name — suggestions are the licenses already known for that provider — then *Add* or Enter; each license shows as a chip that can be removed. A name typed but not added is added on save.
  - *Create Connector* → the connector is named "<Company> – <Provider> Usage" and syncs at its interval; it appears under its company, opened; the list is filtered to that company; its licenses are `Pending` until the first sync (BR-30); "Connector created".
  - Not in the form any more since D1 v1: Connector Name (now generated), Sync Frequency (now *Sync interval*, typed freely, BR-30), Header Name, Usage Endpoint (now part of the API URL), and the authentication kinds OAuth 2.0, Basic Auth, None.
- **Flow B — edit or delete a connector:** **Edit** on a provider row → the form of flow A opens filled with the connector: company, provider, API contact and email, API URL, authentication, sync interval, and its licenses as chips; the credential field is empty → change fields, add or remove licenses → *Save Changes* → "Connector updated". **Delete** *(not in the demo)* → after a confirmation that names the licenses concerned, the connector stops syncing and leaves the list; its licenses become inactive and the data already collected stays for past months (BR-14).
- **Flow C — connector details** (D1 v1 only; the latest D1 offers Edit instead): **⋯** on a provider or license row → drawer with the provider; Company, Connector ID, API Contact, Email, Created, Last Sync (date and time), Sync interval, Paused or running, number of Licenses, API Base URL and Authentication type — never the credential → *Licenses*: each with its ID and status → *Contact*: email link → Close or Esc. Pause and run now are in UC24.
- **Alternative:**
  - list: nothing matches → "No matching results"; a connector never synced → Last Sync "—"; a company outside the Staff member's scope → not listed (BR-15);
  - create: no license → "At least one license is required."; a license already added (case-insensitive) → "License already selected"; a required field empty, an invalid email, or a URL that is not HTTPS → field error; Cancel, Esc, or a click outside → closes without saving and clears the credential; Tab stays inside the dialog;
  - edit: provider and authentication unchanged → the credential is optional, "Leave blank to keep current credential"; provider or authentication changed → a new credential is required; company, provider, authentication, or API URL changed → every license goes back to `Pending` and the last sync is cleared (BR-30); otherwise — a new sync interval included — a kept license keeps its ID and status, and an added license starts `Pending`; a paused connector stays paused (BR-30);
  - create and edit: test of the connection before saving *(not in the demo, required by BR-19)*
- **Result:** one connector per company and provider; shows, per company, which providers and licenses feed ELMS and which are in trouble; the credential is never stored in clear, shown again, or logged (BR-19)

#### UC24 Monitor Data Synchronization

- **Actor:** Staff (own companies)
- **Demo:** none yet
- **Main flow:** connection table (Source, P&L, Status, Sync interval, Last run) → run table (Source, Data period, Status — `Running`, `Success`, `Partial`, `Failed`, or `Paused` — Records received, accepted, rejected, Duration) → open a run: what is complete, partial, or failed, with the reason → rejected records with the check that failed → run now, or rerun a failed or paused period → pause or resume a connection
- **Alternative:** a run failed → nothing written, the period stays `Unknown` (BR-04, BR-18); the same period run twice → replaced, no duplicate (BR-34); a paused connection → its licenses show `Paused`, every scheduled run is recorded as a sync run with status `Paused` that reads nothing, and it is not counted as a sync issue; resume → a run starts at once (BR-30); last sync older than its interval → `Delayed` (BR-30); the interval and the credentials of a usage connector → changed in UC23
- **Result:** read and rerun only; ELMS never writes to a source (BR-01)

### Self-service

#### UC25 View My Licenses

- **Actor:** Employee, Staff, Manager, Admin
- **Main flow:** table of licenses the user holds, across all their emails (License, Provider, P&L, Assigned date, Status, Last used, Expiry date) → rows in `Inactive` or `No activity` carry a note that the seat may be reviewed → sort
- **Alternative:** no license → "You have no licenses assigned"; login email not matched → empty table with a hint to contact Admin; `Not monitored` → "Not tracked"
- **Result:** own rows only; another user's data returns `404`

#### UC26 Login / Logout

- **Actor:** Employee, Staff, Manager, Admin
- **Main flow:** email and password → system checks credentials and status → session created → default screen by role (Manager: License List, UC01; Staff: Connector Management, UC23; Admin: Users, UC21; Employee: My Licenses, UC25) → logout destroys the session
- **Flow A — set the password:** the account email from ILVG provisioning (BR-16) holds a one-time link → choose a password → log in; *Forgot password* on the login screen sends a new one-time link to the account email
- **Alternative:** wrong credentials → generic message; 5 failures → locked 15 minutes; disabled account → refused; password not set yet → refused until the user opens the one-time link; an expired or used link → "This link is no longer valid", ask for a new one; session expired → log in again; screen outside the role → `403`
- **Result:** BR-17; SSO and self-registration are out of scope

## System processes

Done by ELMS on its own, with no user acting; they feed the use cases above.

| Process | What the system does | Feeds |
|---|---|---|
| Connector sync | Calls each usage connector at its sync interval (BR-30), validates every record against the license data contract (BR-18), stores licenses, holders, and activity | UC01, UC02, Usage screen |
| License data contract | One agreed response shape for every connector; versions are managed by the team, not in the product | BR-18 |
| ILVG sync | Reads employees and their units; keeps the organization hierarchy and holder identities up to date | UC02, UC05, UC22 |
| Account provisioning | After each ILVG sync, creates an account with the role Employee for every new employee and emails a one-time link to set the password; disables the account of an employee who has left, ending their sessions (BR-16) | UC21, UC26 |
| BCA sync | Reads how often each employee uses each application on company machines | UC02, UC09 |
| Data matching | Matches units, budget lines, and purchases across connectors, ILVG, the budget file, and the SAP purchase file by their codes; what does not match is flagged `Not mapped` and corrected at the source. Finds the license of each budget line and PO line by its SAP name (BR-08, BR-10). Matches license names to the software catalog by the mappings of UC04; a new name is `Not mapped` until Staff map it (BR-36) | UC04, UC05, UC08, UC10, UC12 |
| Holder identity | Resolves each license account to an ILVG employee by employee ID; follows transfers and keeps every email of a person (BR-26); types shared mailboxes and service accounts (BR-27) | UC02, UC15, UC25 |
| Seat status and frequency | Every day, after the syncs, sets each seat's status over the last 30 days (BR-03) and each holder's days used (BR-33); keeps the status of every day, the last day of each month giving the monthly seat counts | UC02, UC15, Usage screen |
| Cost roll-up | Every day, splits each license's accrued cost over its seats day by day (BR-06) into Used, Wasted, and Not evaluated (BR-23), and adds them up the hierarchy with *Unallocated* and *Unknown unit* (BR-20) | Usage screen, UC16–UC18 |

**Related:** [Research](01-research-top-down.md) · [INVEST requirements](03-invest-requirements.md) · [Data fields research](09-data-fields-research.md)
