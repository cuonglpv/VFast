# Actors, Roles, Business Rules, and Use Cases

> Design status: TARGET
>
> Implementation status: NOT STARTED

System: **Enterprise License Management System (ELMS)**, built by team VFast. Use cases follow the six branches of the [mind map](mindmap.png): License Management, Budget Management, Optimization, Analytics, User & Organization, Connector Management.

## Actors / roles

| Actor | Description |
|---|---|
| `EMPLOYEE` | Every employee of the company. Sees only the licenses assigned to them and whether they are recorded as used |
| `STAFF` | Member of the license management team who reports to a Manager. Does the hands-on work: enters and edits license information (catalog, vendors, entitlements, contracts) and expenses; maps connector data to licenses and checks its quality |
| `MANAGER` | Manager of a unit (a P&L or a department). Mainly uses dashboards and analytics; plans and monitors the unit's budget; reviews optimization results. Sees license data and cost through the dashboards |
| `ADMIN` | Operates the system: users, roles, permissions, the P&L / department tree, and connectors (connection, credentials, schedule, conformance check). Has no access to license, budget, or cost data |
| License providers | External systems (Microsoft Graph and other provider APIs, logs, exports). ELMS only reads from them, always in the ELMS Connector Standard (ECS): natively, through an adapter, or as a file ([Connector standard](06-connector-standard.md)) |

Every account belongs to a real employee (matched by company email), so View My Licenses and Login / Logout belong to every role.

**Organization.** The group has several P&Ls (subsidiaries); each P&L has departments. In this document a *unit* is a P&L or a department. A Manager is assigned to one or more units and sees only their data; budgets, cost allocation, and data scope follow units.

## Staff and Manager

Staff work under a Manager. Staff do the hands-on work: they enter and correct the data. The Manager uses that data to plan, monitor, and decide. The two roles share no business use case.

| | Staff | Manager |
|---|---|---|
| Position | License management team member, reports to a Manager | Manager of a P&L or a department |
| Kind of work | Hands-on data entry and correction | Planning, monitoring, and decisions |
| Works on | Software catalog, vendors, entitlements, license holders and usage where there is no connector, contracts, expenses and invoices, connector data mapping and sync quality (UC01–UC04, UC07, UC27, UC28) | Budget plans, cost allocation, budget monitoring and forecast, optimization, recommendations, dashboards (UC05, UC06, UC08–UC18) |
| Typical day | Add a new contract, update seat quantities and prices, enter who holds a license and their last activity, import an expense file, attach invoices | Check budget utilization, review unused and inactive seats, accept or reject a recommendation |
| Data scope | Every license and expense; no budget, no dashboards | Only their units; license data and cost through dashboards; never edits license data or expenses |
| Output | Correct, complete source data | Budget plans and decisions on recommendations |

## Role × feature matrix

| Mind-map branch | Feature | Admin | Manager | Staff | Employee |
|---|---|---|---|---|---|
| License Management | Software catalog, vendors, entitlements, contracts (UC01–UC04) | | | ✓ | |
| Budget Management | Budget planning, cost allocation (UC05, UC06) | | ✓ own units | | |
| | Expense management (UC07) | | | ✓ | |
| | Budget monitoring, financial forecast (UC08, UC09) | | ✓ own units | | |
| Optimization | Unused, inactive, overuse detection (UC10–UC12) | | ✓ own units | | |
| | Cost optimization, recommendations (UC13, UC14) | | ✓ own units | | |
| Analytics | License, financial, compliance, optimization dashboards (UC15–UC18) | | ✓ own units | | |
| User & Organization | Users, P&Ls and departments, roles, permissions (UC19–UC22) | ✓ | | | |
| Connector Management | Connectors and conformance check (UC25, UC26) | ✓ | | | |
| | Connector data mapping (UC27) | | | ✓ | |
| | Sync monitoring (UC28) | ✓ status only | | ✓ | |
| Self-service | My licenses, login / logout (UC23, UC24) | ✓ | ✓ | ✓ | ✓ |

Menus and buttons are hidden when the user lacks permission, but the API enforces every rule in this table; a URL outside the role returns `403`.

## Business rules

| ID | Rule |
|---|---|
| BR-01 | ELMS is read-only toward providers. It never assigns, revokes, buys, renews, or changes a subscription; "Assigned" is data read from the provider. |
| BR-02 | A license is described by three axes: measurement archetype (Allocation, Concurrent, Metered, Capacity), commercial term, and collection method. Each entitlement line has exactly one archetype. |
| BR-03 | Every assigned seat has exactly one status: `Active` (activity in the last 60 days), `Inactive` (active before, nothing in the last 60 days), `No activity` (a usage source exists but no activity was ever recorded), `Not monitored` (no usage source, or a holder entered by Staff whose activity was never checked). A purchased seat without a holder is `Unassigned`. |
| BR-04 | Missing data is `Unknown`, never 0. `Not monitored` is never counted as `Inactive` or as waste. Holders and usage entered by Staff count as current for 35 days after Staff last confirmed them; older data is `Unknown`. |
| BR-05 | Every cost is converted to an effective monthly cost: yearly plans ÷ 12, perpetual licenses count only maintenance, pay-as-you-go uses the actual spend of the month. Amounts in different currencies are added only with a declared exchange rate. |
| BR-06 | **Cost allocation:** the cost of a license is split evenly over its seats; each seat counts toward the department of its holder. Unassigned seats go to `Unallocated`; holders without a department go to `Unknown department`. The sum of all groups equals the total cost. |
| BR-07 | **Overuse:** a license is `Over-allocated` when assigned quantity > entitlement (Allocation, Concurrent peak, Capacity deployed). Overuse is a compliance risk and is shown on the compliance dashboard. |
| BR-08 | A unit has at most one budget plan per fiscal year. A plan is `Draft` or `Active`; only `Active` plans count. Every change to an `Active` plan keeps the old value, new value, reason, and time. P&L plans and department plans are two separate levels and are never added together: a P&L plan is the envelope for the whole P&L, and the plans of its departments are shares inside it. The company total is the sum of the P&L plans; a P&L without its own plan counts the sum of its department plans. |
| BR-09 | Budget utilization = actual cost / budget: below 80% is normal, from 80% is a warning, from 100% is over budget. Budget reconciliation per unit and license: Planned → Purchased → Assigned → Used → Actual cost. |
| BR-10 | An expense has a date, amount, currency, license, unit, and an optional invoice file (PDF or image, at most 10 MB). An expense can be edited until its month is closed; afterwards only a correcting entry is allowed. |
| BR-11 | A forecast is a projection, never presented as actual cost: it uses the run rate of the last 3 closed months, known renewals, and active plan lines, and shows the method used. |
| BR-12 | **Detection runs daily.** Unused = `Unassigned` seats; inactive = `Inactive` + `No activity`; leaver = seats still held by an employee after their last working day or by an account disabled at the provider, flagged the next day without waiting 60 days; overuse per BR-07. A result shows its evidence (count, last activity, data date) and its monthly cost. |
| BR-13 | **Recommendations need evidence and a decision.** A recommendation (reduce seats, downgrade plan, cancel, reassign) shows its evidence and estimated yearly saving. Status: `Proposed` → `Accepted` or `Rejected` (reason required) → `Done`. ELMS never carries it out on the provider (BR-01). |
| BR-14 | Every figure carries its source (`api`, `import`, `manual`) and confidence. A value from a connector cannot be overwritten silently: an edit needs a reason and keeps the original value. |
| BR-15 | Every change to license data, expenses, budgets, recommendations, users, departments, roles, and permissions is recorded with who, old value, new value, and time. Licenses, vendors, and contracts are never deleted, only marked inactive. |
| BR-16 | Data scope comes from the server on every request: a Manager sees the units assigned to them, and license data and cost only through dashboards; Staff sees every license and expense but no budget; Admin sees users, roles, permissions, the P&L / department tree, and connector status, but no license, budget, or cost data; an Employee sees only their own licenses, without price or cost. |
| BR-17 | Each account has exactly one role: Admin, Manager, Staff, or Employee. Permissions are granted to roles, not to individual users. The last active Admin cannot be disabled or lose the Admin role. |
| BR-18 | Wrong credentials show one generic message; 5 failed attempts in a row lock login for 15 minutes; passwords are stored hashed; the session lives in an `HttpOnly`, `Secure` cookie. |
| BR-19 | Every connector delivers data in the ELMS Connector Standard (ECS): natively, through an adapter written by ELMS, or as an ECS file ([Connector standard](06-connector-standard.md)). The validator checks every run: a record that fails is rejected with its reason; a run whose envelope fails writes nothing and the day stays `Unknown` (BR-04). A dataset the provider cannot supply is `Not supported`, never an empty list. |
| BR-20 | A connector becomes `Active` only after a test connection and a conformance check pass for the datasets it declares. Credentials are write-only: never shown, exported, or logged. Changing credentials or the ECS version sends the connector back to validation. Admin sees connector status, counts, and error codes, never the license data a connector returns (BR-16). |

## Use case diagrams

One diagram per actor. Each diagram shows every use case that actor can start, grouped by mind-map branch; a use case used by several actors appears in each of their diagrams. Sources (draw.io) are in [`diagrams/out/`](diagrams/out/); the PNG and SVG files are exported from them.

### Employee

![Employee use cases](diagrams/out/uc_employee.png)

### Staff

![Staff use cases](diagrams/out/uc_staff.png)

### Manager

![Manager use cases](diagrams/out/uc_manager.png)

### Admin

![Admin use cases](diagrams/out/uc_admin.png)

### Use case list

| ID | Use case | Mind-map leaf | Actors |
|---|---|---|---|
| UC01 | Manage Software Catalog | Software Catalog | Staff |
| UC02 | Manage Vendors | Vendor Management | Staff |
| UC03 | Manage License Entitlements | License Entitlement | Staff |
| UC04 | Manage Contracts | Contract Management | Staff |
| UC05 | Plan Budget | Budget Planning | Manager |
| UC06 | Allocate License Cost | Cost Allocation | Manager |
| UC07 | Manage Expenses | Expense Management | Staff |
| UC08 | Monitor Budget | Budget Monitoring | Manager |
| UC09 | Forecast License Spending | Financial Forecast | Manager |
| UC10 | Detect Unused Licenses | Unused License Detection | Manager |
| UC11 | Detect Inactive Usage | Inactive Usage Detection | Manager |
| UC12 | Detect License Overuse | License Overuse Detection | Manager |
| UC13 | Optimize License Cost | Cost Optimization | Manager |
| UC14 | Manage Recommendations | Recommendation Management | Manager |
| UC15 | View License Dashboard | License Dashboard | Manager |
| UC16 | View Financial Dashboard | Financial Dashboard | Manager |
| UC17 | View Compliance Dashboard | Compliance Dashboard | Manager |
| UC18 | View Optimization Dashboard | Optimization Dashboard | Manager |
| UC19 | Manage Users | User Management | Admin |
| UC20 | Manage P&Ls and Departments | Department Management | Admin |
| UC21 | Manage Roles | Role Management | Admin |
| UC22 | Manage Permissions | Permission Management | Admin |
| UC23 | View My Licenses | — (self-service) | Employee, Staff, Manager, Admin |
| UC24 | Login / Logout | — (access) | Employee, Staff, Manager, Admin |
| UC25 | Manage Connectors | Connector Configuration | Admin |
| UC26 | Validate Connector Conformance | Conformance Validation | Admin |
| UC27 | Map Connector Data | Data Source Mapping | Staff |
| UC28 | Monitor Data Synchronization | Sync Monitoring | Staff, Admin |

## Use cases

### License Management

#### UC01 Manage Software Catalog

- **Actor:** Staff
- **Main flow:** catalog table (Software, Vendor, Category, Subcategory, Archetype, Licenses, Status) → search, filter by vendor, category, archetype, status → create a product: name, vendor, category, subcategory, description, useful links → edit → mark inactive
- **Alternative:** same name and vendor already exist → warning, open the existing product; product without category → `Uncategorized`; product with active entitlements → cannot be marked inactive
- **Result:** one catalog for every provider; changes recorded (BR-15)

#### UC02 Manage Vendors

- **Actor:** Staff
- **Main flow:** vendor table (Vendor, Kind, Products, Contracts, Collection method, Status) → create a vendor: name, kind (publisher or reseller), website, support contact → edit → mark inactive. Collection method is shown from the data sources of the vendor's licenses (API, log, import, manual), not typed in
- **Alternative:** duplicate name → open the existing vendor; vendor with an active contract → cannot be marked inactive; a reseller (distributor, CSP partner) owns no product and is chosen only as the party of a contract
- **Result:** every product points to its publisher; every contract points to the publisher or reseller it is signed with

#### UC03 Manage License Entitlements

- **Actor:** Staff
- **Main flow (entitlement):** open a product → entitlement lines (Plan, Archetype, Unit, Quantity or quota, Assigned, Active, Valid from–to, Source) → add a line: plan, archetype (BR-02), unit (seat, slot, token, core…), quantity or quota (or unlimited), validity, commercial term, unit price for the period of that term as the vendor quotes it, for a number of units (2.50 USD per 1,000,000 tokens), currency → optionally split a line among units: quota per unit from a date; moving seats mid-year ends the current quotas and starts new ones; a renewal line copies the quotas in force → edit → end a line → import lines from a CSV template
- **Main flow (assignment and usage, for a line without a connector):** open a line → holders table (User, Assigned date, Last active, Source) → add or remove a holder by employee email → enter the last activity date per holder, or mark the holder as checked with no activity; for Concurrent, Metered, and Capacity lines enter the peak sessions, consumption, or deployed units per period → or import a CSV template for the line's archetype → preview rows to add, update, reject → confirm → mark the data as current (a confirmed import does it) → see the entry history (who, when, file, rows)
- **Alternative:** negative quantity, end before start, or missing currency → field errors; a value from a connector → edit needs a reason and keeps the original (BR-14); CSV with an invalid row → whole file rejected with the error rows; holder email not matched to an employee → stored with the provider identity and `Unknown department`; the line already has a connector for assignments or usage → manual entry of that data is refused (one primary source, BR-14); a period entered twice → replaced, no duplicate; a holder whose activity was never entered or checked → `Not monitored`; holders and usage not confirmed for 35 days → `Unknown`, so detection reports `Not evaluated` (BR-04); quotas adding up to more than the line on any day → refused
- **Result:** Purchased quantity and price per line; Assigned and usage come from connectors or, where there is none, from Staff entry with source `manual` or `import` (BR-14). A line with neither stays `Not monitored` (BR-03)

#### UC04 Manage Contracts

- **Actor:** Staff
- **Main flow:** contract table (Contract, Vendor, Start, Renewal date, Notice period, Auto-renew, Value, Status) → create a contract: vendor or reseller it is signed with, entitlement lines it covers (a reseller contract may cover licenses of several publishers), start, renewal date, notice period (empty when not known), auto-renew, commitment, total value, attachments (contract, amendments, PO) → edit → mark ended
- **Alternative:** renewal before start → error; an entitlement line already covered by another active contract → refused; renewal within 30 days → marked "Renewal soon"; notice deadline passed → marked "Notice period passed"; auto-renewing contract with an empty notice period → marked "Notice period unknown" and its notice deadline is `Unknown`, never the renewal date
- **Result:** renewal dates feed the forecast (UC09) and recommendations timing (UC13)

### Budget Management

#### UC05 Plan Budget

- **Actor:** Manager
- **Main flow:** choose fiscal year and unit → enter budget, currency, note → saved as `Draft` → add plan lines: license, planned quantity, planned cost (suggested = quantity × current yearly unit price) → activate → plan becomes `Active` → adjust mid-year with a reason
- **Alternative:** a plan already exists for that unit and year → open it; budget ≤ 0 or no currency → field errors; planned cost above budget → warning, confirmation required to activate; department budgets of a P&L adding up to more than the P&L budget → warning, confirmation required to activate; new year → copy last year's lines; delete → `Draft` only
- **Result:** BR-08; plan lines are the "Planned" level of BR-09

#### UC06 Allocate License Cost

- **Actor:** Manager
- **Main flow:** choose period → table per license: total cost, seats, cost per seat, cost per unit → chart of cost per department → open a license to see which holders carry its cost
- **Alternative:** license shared by the whole company → split by holders (BR-06); non-seat license → split by the department of its subjects if known, otherwise `Unallocated`
- **Result:** the sum of all departments, `Unallocated`, and `Unknown department` equals the total cost

#### UC07 Manage Expenses

- **Actor:** Staff
- **Main flow:** expense table (Date, License, Vendor, Unit, Amount, Currency, Invoice, Source) → add an expense with an optional invoice file → edit → import expenses from a CSV template → see import history
- **Alternative:** amount ≤ 0, unknown license, or file too large → field errors; month closed → only a correcting entry (BR-10); invalid CSV row → whole file rejected; expense already imported from a billing API → edit needs a reason (BR-14)
- **Result:** expenses are the "Actual cost" level of BR-09

#### UC08 Monitor Budget

- **Actor:** Manager
- **Main flow:** choose fiscal year → Total budget, Planned cost, Actual cost, Remaining, Utilization → table per unit with utilization colour (BR-09) → open a unit: per license Planned, Purchased, Assigned, Used, Actual cost, Variance, with gap types (`Over plan`, `Under plan`, `Unassigned`, `Unused`)
- **Alternative:** unit with cost but no plan → Budget "Not set", Utilization "—"; missing data at a level → `Unknown`, no gap flagged at that level; cost outside the plan → group "Outside plan"; a P&L budget not fully shared out to its departments → the rest shown as "Not distributed" (BR-08); a quota that changes during the year → Purchased of the unit follows the quota in force on each day
- **Result:** read-only; the sum of the units plus `Unallocated` equals the company's actual cost

#### UC09 Forecast License Spending

- **Actor:** Manager
- **Main flow:** choose unit and fiscal year → chart of actual cost by month and forecast for the remaining months → forecast year-end cost vs budget → list of upcoming renewals and their expected cost → hover a month for actual or forecast and the method (BR-11)
- **Alternative:** fewer than 3 closed months → forecast uses plan lines only and is labelled "low confidence"; no plan → forecast shown without a budget line
- **Result:** read-only; forecast and actual are never mixed in one figure

### Optimization

#### UC10 Detect Unused Licenses

- **Actor:** Manager
- **Main flow:** list of licenses with `Unassigned` seats (License, Purchased, Assigned, Unassigned, Monthly cost of unassigned seats, Data date) sorted by cost → open a license (detail with holders) → create a recommendation (UC14)
- **Alternative:** Assigned is `Unknown` → license excluded and counted as "Not evaluated"; an unlimited license has no unassigned seats and is never listed
- **Data scope:** an unassigned seat belongs to no department, so the result is one company-level row per license; a Manager sees the licenses that have a holder in their units, with the same figures for every Manager
- **Result:** BR-12; nothing changes on the provider

#### UC11 Detect Inactive Usage

- **Actor:** Manager
- **Main flow:** list of seats in `Inactive`, `No activity`, or `Leaver` (User, Department, License, Status, Last active, Monthly seat cost) → filter by license, department, status → open the license → create a recommendation (UC14)
- **Alternative:** `Not monitored` licenses excluded and counted separately (BR-04); holder not matched to an employee → provider identity with `Unknown department`; employee past their last working day, or account disabled at the provider, still holding a seat → `Leaver` from the next day, without waiting 60 days, and not counted again as `Inactive` (BR-12)
- **Result:** BR-03, BR-12

#### UC12 Detect License Overuse

- **Actor:** Manager
- **Main flow:** list of licenses where use exceeds the entitlement (License, Archetype, Entitlement, In use, Excess, Since) → open a license to see the evidence
- **Alternative:** Concurrent license → in use = peak sessions in the period; Capacity license → in use = deployed units; missing data → `Not evaluated`; unlimited license → never over-allocated
- **Data scope:** an excess belongs to no department, so the result is one company-level row per license; a Manager sees the licenses that have a holder in their units, with the same figures for every Manager
- **Result:** BR-07; the result also appears on the compliance dashboard (UC17)

#### UC13 Optimize License Cost

- **Actor:** Manager
- **Main flow:** list of saving opportunities built from UC10–UC12 (reduce seats, downgrade plan, cancel, reassign) with evidence and estimated yearly saving → the earliest date each can be acted on (monthly plan: now; yearly or enterprise: before the renewal, minus the notice period) → turn an opportunity into a recommendation (UC14)
- **Alternative:** no opportunity → "No saving opportunity found"; the notice period has passed → opportunity moved to the next renewal; the notice period of the contract is not known → action date `Unknown`, never "now"
- **Result:** read-only until a recommendation is created; the system never acts on its own (BR-13)

#### UC14 Manage Recommendations

- **Actor:** Manager
- **Main flow:** recommendation table (Recommendation, License, Type, Estimated saving, Status, Owner, Due date) → create from UC10–UC13 or by hand with evidence → accept, or reject with a reason → mark done with the actual saving → filter by status
- **Alternative:** reject without a reason → refused; mark done without accepting → refused; the same license and type already open → open the existing recommendation
- **Result:** BR-13; accepted and done savings feed the optimization dashboard (UC18)

### Analytics

#### UC15 View License Dashboard

- **Actor:** Manager
- **Main flow:** Total licenses, licenses by category and by archetype, Purchased vs Assigned vs Active per license, licenses expiring within 30 days, top applications by holders split into `Active`, `Inactive`, `No activity` → click to open a license
- **Alternative:** no data → "No data yet", never zeros
- **Result:** read-only; counts match UC01 and UC03

#### UC16 View Financial Dashboard

- **Actor:** Manager
- **Main flow:** total yearly spend, spend by month, spend by department (UC06), budget vs actual (UC08), forecast year-end (UC09) → choose year and unit
- **Alternative:** missing exchange rate → amounts per currency (BR-05)
- **Result:** read-only; totals match UC06 and UC08

#### UC17 View Compliance Dashboard

- **Actor:** Manager
- **Main flow:** licenses `Compliant`, `Over-allocated`, `Not evaluated`; overuse list (UC12); contracts with renewal soon, notice period passed, or notice period unknown (UC04)
- **Alternative:** missing data → `Not evaluated`, never `Compliant`
- **Result:** read-only

#### UC18 View Optimization Dashboard

- **Actor:** Manager
- **Main flow:** underutilized accounts and their yearly cost, unassigned seats and their cost, saving opportunities, recommendations by status, accepted and realized savings
- **Alternative:** no usage data → underutilized figures show "Not evaluated yet"
- **Result:** read-only; figures match UC10, UC11, UC14

### User & Organization

#### UC19 Manage Users

- **Actor:** Admin
- **Main flow:** user table (Name, Email, Role, P&L, Department, Managed units, Status, Last login) → create an account: name, email, role, P&L and department → the system shows a one-time link to set the password, which Admin hands to the user → edit → reset password (a new link) → disable or re-enable → import the employee directory from an HR CSV template (name, email, employee code, P&L, department, last working day), so people without an account still get a department
- **Alternative:** email already exists → open that account; disabling oneself or the last active Admin → refused (BR-17); email not in the collected user list → created with a warning that UC23 will be empty; link expired or lost → Admin creates a new one; employee past their last working day → account disabled automatically and cannot be re-enabled; invalid row in the HR file → whole file rejected with the error rows
- **Result:** disabling ends open sessions at once and never deletes the account; changes recorded (BR-15)

#### UC20 Manage P&Ls and Departments

- **Actor:** Admin
- **Main flow:** tree of P&Ls (subsidiaries) and their departments → create a P&L, or a department under a P&L → rename; move a department to another P&L → assign Managers to a P&L or a department → mark inactive
- **Alternative:** a department without a P&L, or a P&L under a department → refused; duplicate name within the same P&L → refused; a unit with active users or an active budget plan → cannot be marked inactive
- **Result:** units drive data scope (BR-16), cost allocation (UC06), and budgets (UC05)

#### UC21 Manage Roles

- **Actor:** Admin
- **Main flow:** the four roles with their description and number of users → change the role of a user → see users per role
- **Alternative:** removing the Admin role from the last active Admin → refused; a Manager without a managed unit → warning that they will see no data
- **Result:** one role per account (BR-17); the change applies from the next request

#### UC22 Manage Permissions

- **Actor:** Admin
- **Main flow:** permission matrix (feature × role, read or write) → view the effective permissions of a role → grant or remove a permission for Manager, Staff, or Employee → save with a reason
- **Alternative:** removing a permission Admin needs to manage permissions → refused; giving Employee access to price or cost → refused (BR-16)
- **Result:** permissions are per role (BR-17); every change recorded (BR-15)

### Connector Management

Connectors read license data from providers into ELMS, always in the ELMS Connector Standard (BR-19). UC25–UC28 are numbered after UC24 so existing references keep their numbers. Research, the standard, and the rollout plan: [Connector standard](06-connector-standard.md).

#### UC25 Manage Connectors

- **Actor:** Admin
- **Main flow:** connector table (Connector, Vendor, Delivery, ECS version, Level, Status, Schedule, Last run) → create a connector: vendor, name, delivery (`native` ECS endpoint, `adapter` such as Microsoft Graph or OpenAI, `file`), base URL for native, credentials (OAuth client or API key with read-only scope), schedule (default every night at 2:00) → test the connection → ELMS reads the provider's capabilities (datasets, granularity, history depth, data delay) → saved as `Draft` → after the conformance check passes (UC26) → activate → pause or resume → edit the schedule
- **Alternative:** test connection fails → the error code and the provider's message are shown and the connector stays `Draft`; credentials with write scope → refused (BR-01); saved credentials are never shown again, only replaced (BR-20); credentials or ECS version changed → back to `Draft` until validated again; the vendor already has an active connector for the same tenant → refused; a paused connector → its plans' data becomes `Unknown` once the data date passes, never 0 (BR-04)
- **Result:** a connector is configured once and runs on its schedule; changes recorded without the secret (BR-15)

#### UC26 Validate Connector Conformance

- **Actor:** Admin
- **Main flow:** open a `Draft` connector → run the conformance check → ELMS pulls a sample of each declared dataset → checks: envelope and JSON Schema per dataset and version, required datasets for the declared level (L1 Entitlement, L2 Assignment, L3 Usage), references (assignments to known subjects and plans), duplicates, unsupported datasets answered as `Not supported`, two pulls of the same day equal → report per check (passed, failed, warning) with record counts and error codes → all required checks passed → connector `Validated`, ready to activate (UC25) → see the history of checks
- **Alternative:** a required check fails → `Failed`, the connector stays `Draft` with the failing checks listed; the provider supports fewer datasets than the level declared → the level is lowered to what passed, with a warning; an unsupported ECS version → refused with the list of supported versions; adapter connectors are checked the same way as native ones
- **Data scope:** the report shows counts, field names, and error codes, never record contents (BR-16, BR-20)
- **Result:** BR-20; only a connector that passed can feed data

#### UC27 Map Connector Data

- **Actor:** Staff
- **Main flow:** choose an active connector → list of provider plans seen in its data (Provider plan, Archetype, Quantity, Mapped to, Datasets) → map a provider plan to an ELMS license plan (UC03), or create the plan from it → choose, per kind of data (entitlement, assignment, usage, expense), whether this connector is the primary source → the next run normalizes the data kept for that plan
- **Alternative:** the plan already has another primary source for that kind of data → switching needs a reason, and the old source stops writing from the switch date (one primary source, BR-14); an unmapped provider plan → its records wait in raw data and are counted nowhere; aggregate usage only → the plan's seats stay `Not monitored` (BR-03); a plan mapped by mistake → remapping reprocesses the raw data still within the retention period
- **Result:** every figure from a connector belongs to one license and carries source `api` or `log` (BR-14); manual entry of that data is refused in UC03

#### UC28 Monitor Data Synchronization

- **Actor:** Staff, Admin
- **Main flow:** run table (Connector, Trigger, Data date, Status, Records received, accepted, rejected, Duration) → open a run: coverage per plan and kind of data (`complete`, `partial`, `failed`) with the reason → Staff: rejected records with the check that failed → run now, or rerun a failed day → for a `file` connector, upload an ECS file → preview the manifest (dataset, data date, record count) → confirm
- **Alternative:** a run failed → nothing written, the day stays `Unknown` and detection reports `Not evaluated` (BR-04, BR-19); some plans missing → run `partial`, only those plans are `Unknown`; an uploaded file whose record count or checksum does not match its manifest → whole file refused; the same day uploaded or rerun twice → replaced, no duplicate; no successful run for 3 days → the connector is marked "Stale"
- **Data scope:** Admin sees runs, statuses, counts, and error codes; record contents and rejected records are Staff-only (BR-16)
- **Result:** read and rerun only; ELMS never writes to the provider (BR-01)

### Self-service

#### UC23 View My Licenses

- **Actor:** Employee, Staff, Manager, Admin
- **Main flow:** table of licenses assigned to the user (License, Vendor, Plan, Assigned date, Status, Last active, Expiry date) → rows in `Inactive` or `No activity` carry a note that the seat may be reviewed → sort
- **Alternative:** no license → "You have no licenses assigned"; login email not matched → empty table with a hint to contact Admin; `Not monitored` → "Not tracked"
- **Expiry date:** the end of validity of the purchase (entitlement line) the seat belongs to; when the provider pools the seats of several purchases and the purchase is not known, the earliest end of validity among the active purchases of that license, the first day the seat may lapse
- **Result:** own rows only; another user's data returns `404`; no price or cost

#### UC24 Login / Logout

- **Actor:** Employee, Staff, Manager, Admin
- **Main flow:** email and password → system checks credentials and status → session created → default screen by role (Manager: License Dashboard; Staff: Software Catalog; Admin: Users; Employee: My Licenses) → logout destroys the session
- **Alternative:** wrong credentials → generic message; 5 failures → locked 15 minutes; disabled account → refused; password not set yet → refused until the user opens the one-time link from Admin and sets one; forgotten password → ask Admin for a new link; session expired → log in again; screen outside the role → `403`
- **Result:** BR-18; SSO and self-registration are out of scope

**Related:** [Research](01-research-top-down.md) · [INVEST requirements](03-invest-requirements.md)
