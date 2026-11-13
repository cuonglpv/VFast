# Actors, Roles, Business Rules, and Use Cases

> Design status: TARGET (revised business model, November 2026)
>
> Implementation status: NOT STARTED

System: **Enterprise License Management System (ELMS)**, built by team VFast. Use cases follow the seven branches of the [mind map](mindmap.png): License Management, Actual Usage, Budget Management, Optimization, Analytics, User & Organization, Connection Management.

**What changed in this revision.** ELMS no longer enters or grants licenses. Each P&L exposes a license API that ELMS calls; actual usage comes from BCA, employees and units from ILVG, and the monthly budget plan from SAP. Views are built on three quantities — Budgeted, Paid, Used — over a fixed hierarchy, Group > P&L > Block > Department > Project. Use cases are written at use-case level; processing details still open are listed in [Open decisions](#open-decisions).

## Actors / roles

| Actor | Description |
|---|---|
| `EMPLOYEE` | Every employee of the group. Sees only the licenses they hold and whether they are recorded as used |
| `STAFF` | Member of the license management team. Keeps the data flowing and correct: connections to P&L license APIs, BCA, and ILVG, the license data contract, data mapping, sync monitoring, the SAP budget import, and the software catalog |
| `MANAGER` | Manager of a unit at any level below the group (P&L, block, department, or project). Sees licenses, actual usage, budget, and waste for that unit and everything under it; decides on recommendations |
| `ADMIN` | Sees the whole group: every P&L, whether it wastes licenses, and every level under it, read-only. Also operates the system: users, roles, permissions, and the organization hierarchy |
| P&L license APIs | One API per P&L, built by the P&L to the license data contract. Returns every license the P&L uses |
| BCA | Usage tracking on company machines. Returns how often each member uses each application |
| ILVG | Internal application. Returns employees and the unit each belongs to |
| SAP | Source of the monthly budget plan, delivered as an import file |

Every account belongs to a real employee, so View My Licenses and Login / Logout belong to every role.

**Organization.** The hierarchy is fixed: **Group > P&L > Block > Department > Project** (BR-21). In this document a *unit* is a node at any of these levels. A Manager is assigned to one or more units and sees them and everything under them.

## Role × feature matrix

| Mind-map branch | Feature | Admin | Manager | Staff | Employee |
|---|---|---|---|---|---|
| License Management | Software catalog, vendors, contracts (UC01, UC02, UC04) | | | ✓ | |
| | License inventory by P&L, licenses by organization (UC27, UC28) | ✓ all | ✓ own units | ✓ all | |
| Actual Usage | Monthly, yearly, usage-based license usage (UC29–UC31) | ✓ all | ✓ own units | | |
| | Employee usage (UC32) | ✓ all | ✓ own units | | |
| Budget Management | SAP budget import (UC33) | | | ✓ | |
| | Monthly budget plan, Budgeted / Paid / Used monitoring, monthly plan variance (UC05, UC08, UC34) | ✓ all | ✓ own units | | |
| | Cost allocation, financial forecast (UC06, UC09) | | ✓ own units | | |
| | Expense management (UC07) | | | ✓ | |
| Optimization | Unused, inactive, overuse detection (UC10–UC12) | ✓ all | ✓ own units | | |
| | P&L waste flag (UC35) | ✓ all | ✓ own units | | |
| | Cost optimization, recommendations (UC13, UC14) | | ✓ own units | | |
| Analytics | Group overview (UC36) | ✓ | | | |
| | Organization drill-down (UC37) | ✓ all | ✓ own units | | |
| | License, financial, compliance, optimization dashboards (UC15–UC18) | ✓ all | ✓ own units | | |
| User & Organization | Users, organization hierarchy, roles, permissions (UC19–UC22) | ✓ | | | |
| Connection Management | P&L license API, license data contract, BCA usage API, ILVG employee API (UC38–UC41) | | | ✓ | |
| | Data source mapping (UC25) | | | ✓ | |
| | Sync monitoring (UC26) | ✓ status only | | ✓ | |
| Self-service | My licenses, login / logout (UC23, UC24) | ✓ | ✓ | ✓ | ✓ |

Admin reads everything a Manager reads, for the whole group, and changes none of it. Menus and buttons are hidden when the user lacks permission, but the API enforces every rule in this table; a URL outside the role returns `403`.

## Business rules

Rule numbers are kept from the previous model so references stay valid; BR-21 to BR-23 are new.

| ID | Rule |
|---|---|
| BR-01 | ELMS is read-only toward every source: P&L license APIs, BCA, ILVG. It never grants, assigns, revokes, buys, or renews a license; "Assigned" is data read from a P&L. |
| BR-02 | A license has one **license type**: `monthly`, `yearly`, or `usage_based`, reported by the P&L. Each type has its own actual-usage table; a new type later is a new table. |
| BR-03 | Every assigned seat has exactly one status: `Active`, `Inactive`, `No activity`, or `Not monitored` (no usage source). A paid seat without a holder is `Unassigned`. |
| BR-04 | Missing data is `Unknown`, never 0. `Not monitored` is never counted as `Inactive` or as waste. |
| BR-05 | **Quantities, not money.** Licenses are bought by quantity, so inventory, actual usage, budget monitoring, waste, the group overview, and the drill-down show quantities only. Money appears only in the features carried over from the previous model (UC04, UC06, UC07, UC09, UC13, UC16). |
| BR-06 | Cost allocation (UC06, carried over): the cost of a license is split evenly over its seats; each seat counts toward the unit of its holder. |
| BR-07 | **Overuse:** a license is `Over-allocated` when the quantity in use exceeds the quantity paid. |
| BR-08 | **The budget plan comes from SAP**, by month. Each line carries the P&L, block code, project code, project name, license, and planned quantity. ELMS does not write the plan; importing a month again replaces it and keeps the earlier version. |
| BR-09 | **Three figures per unit and period:** **Budgeted** (plan), **Paid** (bought), **Used** (actual usage). Monitoring and variance compare them month by month and year by year. |
| BR-10 | Expenses (UC07, carried over): an expense has a date, amount, currency, license, unit, and an optional invoice file. |
| BR-11 | A forecast (UC09, carried over) is a projection, never presented as an actual figure. |
| BR-12 | **Detection runs on the collected data.** Unused = `Unassigned` seats; inactive = `Inactive` + `No activity`; overuse per BR-07. A result shows its evidence and data date. |
| BR-13 | A recommendation shows its evidence. Status: `Proposed` → `Accepted` or `Rejected` (reason required) → `Done`. ELMS never carries it out (BR-01). |
| BR-14 | **Real data first.** Every figure carries its source (`pnl_api`, `bca`, `ilvg`, `sap`, `mock`). Mock data is used only for a source that cannot deliver yet, is labelled as mock on every screen, and is never mixed into a real figure. |
| BR-15 | Every change to the catalog, connections, mappings, imports, recommendations, users, the hierarchy, roles, and permissions is recorded with who, old value, new value, and time. |
| BR-16 | **Data scope comes from the server on every request.** Admin reads the whole group. A Manager reads the units assigned to them and everything under those units. Staff see license data of every P&L, to keep it correct, but no budget or employee usage. An Employee sees only their own licenses. |
| BR-17 | Each account has exactly one role: Admin, Manager, Staff, or Employee. Permissions are granted to roles. The last active Admin cannot be disabled or lose the Admin role. |
| BR-18 | Wrong credentials show one generic message; 5 failed attempts in a row lock login for 15 minutes; passwords are stored hashed; the session lives in an `HttpOnly`, `Secure` cookie. |
| BR-19 | Every P&L license API answers in the **license data contract** (UC39). A validator checks every run: a record that fails is rejected with its reason; a run that fails writes nothing and the period stays `Unknown` (BR-04). |
| BR-20 | A connection is saved only after its test passes with read-only credentials. Credentials are write-only: never shown, exported, or logged. |
| BR-21 | **The hierarchy is fixed:** Group > P&L > Block > Department > Project. Levels cannot be added, removed, or reordered. Units come from ILVG. Every figure of a unit is the sum of the units under it. |
| BR-22 | **Waste flag:** a unit that wastes licenses is shown in red, at every level and in every view. A unit with missing data is `Not evaluated`, never red and never "no waste". |
| BR-23 | **Employee usage** is kept in its own table, per employee, application, and period, separate from the license usage tables, so later services and functions can use it. It is read only by Admin and the Managers of the employee's units. |

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

Existing use cases keep their numbers; new ones start at UC27. UC03 Manage License Entitlements is removed: licenses are no longer entered in ELMS.

| ID | Use case | Mind-map leaf | Actors | Status |
|---|---|---|---|---|
| UC01 | Manage Software Catalog | Software Catalog | Staff | Revised |
| UC27 | View License Inventory by P&L | License Inventory by P&L | Admin, Manager, Staff | New |
| UC28 | View Licenses by Organization | License by Organization | Admin, Manager, Staff | New |
| UC02 | Manage Vendors | Vendor Management | Staff | Carried over |
| UC04 | Manage Contracts | Contract Management | Staff | Carried over, money |
| UC29 | Track Monthly License Usage | Monthly License Usage | Admin, Manager | New |
| UC30 | Track Yearly License Usage | Yearly License Usage | Admin, Manager | New |
| UC31 | Track Usage-based License Usage | Usage-based License Usage | Admin, Manager | New |
| UC32 | Track Employee Usage | Employee Usage | Admin, Manager | New |
| UC33 | Import Budget from SAP | SAP Budget Import | Staff | New |
| UC05 | View Monthly Budget Plan | Monthly Budget Plan | Admin, Manager | Revised |
| UC06 | Allocate License Cost | Cost Allocation | Manager | Carried over, money |
| UC07 | Manage Expenses | Expense Management | Staff | Carried over, money |
| UC08 | Monitor Budgeted / Paid / Used | Budgeted / Paid / Used Monitoring | Admin, Manager | Revised |
| UC34 | Track Monthly Plan Variance | Monthly Plan Variance | Admin, Manager | New |
| UC09 | Forecast License Spending | Financial Forecast | Manager | Carried over, money |
| UC10 | Detect Unused Licenses | Unused License Detection | Admin, Manager | Revised |
| UC11 | Detect Inactive Usage | Inactive Usage Detection | Admin, Manager | Revised |
| UC12 | Detect License Overuse | License Overuse Detection | Admin, Manager | Revised |
| UC35 | Flag P&L Waste | P&L Waste Flag | Admin, Manager | New |
| UC13 | Optimize License Cost | Cost Optimization | Manager | Carried over, money |
| UC14 | Manage Recommendations | Recommendation Management | Manager | Carried over |
| UC36 | View Group Overview | Group Overview (All P&Ls) | Admin | New |
| UC37 | Drill Down by Organization | Organization Drill-down | Admin, Manager | New |
| UC15 | View License Dashboard | License Dashboard | Admin, Manager | Revised |
| UC16 | View Financial Dashboard | Financial Dashboard | Admin, Manager | Carried over, money |
| UC17 | View Compliance Dashboard | Compliance Dashboard | Admin, Manager | Carried over |
| UC18 | View Optimization Dashboard | Optimization Dashboard | Admin, Manager | Revised |
| UC19 | Manage Users | User Management | Admin | Revised |
| UC20 | Manage Organization Hierarchy | Organization Hierarchy | Admin | Revised |
| UC21 | Manage Roles | Role Management | Admin | Carried over |
| UC22 | Manage Permissions | Permission Management | Admin | Carried over |
| UC38 | Connect P&L License API | P&L License API | Staff | New |
| UC39 | Manage License Data Contract | License Data Contract | Staff | New |
| UC40 | Connect BCA Usage API | BCA Usage API | Staff | New |
| UC41 | Connect ILVG Employee API | ILVG Employee API | Staff | New |
| UC25 | Map Connection Data | Data Source Mapping | Staff | Revised |
| UC26 | Monitor Data Synchronization | Sync Monitoring | Staff, Admin | Revised |
| UC23 | View My Licenses | — (self-service) | Employee, Staff, Manager, Admin | Carried over |
| UC24 | Login / Logout | — (access) | Employee, Staff, Manager, Admin | Carried over |

"Carried over, money" marks a use case that is about money and was kept unchanged; whether it stays is an [open decision](#open-decisions).

## Use cases

### License Management

ELMS shows the licenses each P&L reports; nobody enters or grants a license in ELMS (BR-01).

#### UC01 Manage Software Catalog

- **Actor:** Staff
- **Main flow:** catalog table (Software, Vendor, Category, License type, P&Ls using it, Status) → search and filter → create a product: name, vendor, category, description → edit → merge two products that are the same software → mark inactive
- **Alternative:** same name and vendor already exist → open the existing product; a product still reported by a P&L → cannot be marked inactive
- **Result:** one name per software for the whole group, so the same software reported by several P&Ls is counted together (UC25 links P&L licenses to it)

#### UC27 View License Inventory by P&L

- **Actor:** Admin, Manager, Staff
- **Main flow:** choose a P&L → table of every license it reports (License, Software, Vendor, License type, Paid, Assigned, Used, Status, Expiry date, Data date) → search, filter by license type, software, status → open a license: its fields from the P&L API, holders, and the units it belongs to
- **Alternative:** the P&L has no connection or no successful run → "No data yet", never an empty inventory (BR-04); a license not yet linked to the catalog → shown with the name the P&L gave and marked "Not mapped"; a figure the P&L does not report → `Unknown`
- **Result:** read-only; one list of what a P&L uses, without visiting the P&L

#### UC28 View Licenses by Organization

- **Actor:** Admin, Manager, Staff
- **Main flow:** choose a unit at any level (P&L, block, department, project) → licenses used by that unit (License, License type, Paid, Assigned, Used) → open a license to see its split over the units below → switch to the opposite view: choose a license → which P&Ls, blocks, departments, and projects use it
- **Alternative:** a license or holder that cannot be placed in a unit → counted under "Unknown unit" of the nearest known level, so totals still add up (BR-21); a Manager choosing a unit outside their scope → `403`
- **Result:** read-only; every license is visible per company, block, department, and project

#### UC02 Manage Vendors

- **Actor:** Staff
- **Main flow:** vendor table (Vendor, Kind, Products, Contracts, Status) → create a vendor: name, kind (publisher or reseller), website, support contact → edit → mark inactive
- **Alternative:** duplicate name → open the existing vendor; vendor with an active contract → cannot be marked inactive
- **Result:** every product points to its publisher

#### UC04 Manage Contracts

- **Actor:** Staff
- **Status:** carried over from the previous model; shows contract value
- **Main flow:** contract table (Contract, Vendor, Start, Renewal date, Notice period, Auto-renew, Value, Status) → create a contract: vendor or reseller, licenses it covers, start, renewal date, notice period, auto-renew, total value, attachments → edit → mark ended
- **Alternative:** renewal before start → error; renewal within 30 days → marked "Renewal soon"; notice deadline passed → marked "Notice period passed"
- **Result:** renewal dates feed the forecast (UC09) and recommendation timing (UC13)

### Actual Usage

Actual usage is stored per license type, one table each (BR-02), and separately per employee (BR-23). All figures are quantities (BR-05).

#### UC29 Track Monthly License Usage

- **Actor:** Admin, Manager
- **Main flow:** choose a unit and a year → table of licenses of type `monthly` with, for each month, Budgeted, Paid, Assigned, Used → chart of the three figures by month → filter by license or software → open a license to see its holders in that month
- **Alternative:** a month without a successful run → `Unknown` for that month, never 0 (BR-04); a month still running → marked "Month to date"
- **Result:** read-only; the monthly record of every monthly license per unit

#### UC30 Track Yearly License Usage

- **Actor:** Admin, Manager
- **Main flow:** choose a unit → table of licenses of type `yearly` with, for each year, Budgeted, Paid, Assigned, Used, term start and end → compare years → open a license to see how use moved during its term → switch any license, of any type, to the yearly summary of its months
- **Alternative:** a term that spans two calendar years → shown under its own term dates, and under each calendar year in the summary; a year without data → `Unknown`
- **Result:** read-only; licenses bought by the year are judged over the year, not month by month

#### UC31 Track Usage-based License Usage

- **Actor:** Admin, Manager
- **Main flow:** choose a unit and a period → table of licenses of type `usage_based` (License, Unit of measure, Quota or commitment, Consumed, Remaining) → chart of consumption over time → split by what the P&L reports (project, service, model) → open a license to see who or what consumed
- **Alternative:** a license without a quota → Remaining "—", consumption still shown; a license in units that cannot be added to another → never summed with it; a period without data → `Unknown`
- **Result:** read-only; consumption per license and unit, in the license's own unit of measure

#### UC32 Track Employee Usage

- **Actor:** Admin, Manager
- **Main flow:** choose a unit and a period → table of members (Employee, Unit, Application, Days used, Last used) from BCA → filter by application, unit, or frequency of use → open an employee: the applications they use and the licenses they hold → open an application: who uses it and how often
- **Alternative:** a member with no machine reporting to BCA → "Not tracked", never "not used" (BR-04); an application in use without a license reported by the P&L → listed as "No license reported"; a license holder with no use of the application → listed as a candidate for UC11
- **Result:** read-only; kept in its own table for later services and functions (BR-23); the fields are fixed when the BCA API is known

### Budget Management

The plan is imported from SAP (BR-08); ELMS compares it with what was paid and used (BR-09).

#### UC33 Import Budget from SAP

- **Actor:** Staff
- **Main flow:** upload the SAP file for a month or a year → preview the lines (P&L, Block code, Project code, Project name, License, Month, Planned quantity) with rows to add, replace, and reject → confirm → import history (who, when, file, rows)
- **Alternative:** a row whose P&L, block, or project is not in the hierarchy → rejected with the reason, the file is not imported until it is fixed or the row is left out on purpose; a month already imported → replaced, the earlier version is kept (BR-08); a license name not in the catalog → kept and marked "Not mapped" (UC25)
- **Result:** the Budgeted figure of BR-09, per unit, license, and month, with source `sap` (BR-14)

#### UC05 View Monthly Budget Plan

- **Actor:** Admin, Manager
- **Main flow:** choose a fiscal year and a unit → plan by month (License, Planned quantity per month, Year total) → group by P&L, block, or project → compare with the previous version of the plan
- **Alternative:** a unit without a plan → "Not planned", never 0; a plan changed by a new import → the changed lines are marked with the import that changed them
- **Result:** read-only; the plan is changed only by an SAP import (UC33)

#### UC06 Allocate License Cost

- **Actor:** Manager
- **Status:** carried over from the previous model; shows cost
- **Main flow:** choose period → table per license: total cost, seats, cost per seat, cost per unit → chart of cost per department → open a license to see which holders carry its cost
- **Alternative:** a license shared by several units → split by holders (BR-06)
- **Result:** the sum over all units equals the total cost

#### UC07 Manage Expenses

- **Actor:** Staff
- **Status:** carried over from the previous model; shows amounts
- **Main flow:** expense table (Date, License, Vendor, Unit, Amount, Currency, Invoice) → add an expense with an optional invoice file → edit → import expenses from a CSV template
- **Alternative:** amount ≤ 0 or unknown license → field errors; invalid CSV row → whole file rejected
- **Result:** BR-10

#### UC08 Monitor Budgeted / Paid / Used

- **Actor:** Admin, Manager
- **Main flow:** choose a period (month or year) and a unit → the three figures for the unit: Budgeted, Paid, Used → table of the units under it with the same three figures and the waste flag (BR-22) → open a unit: the three figures per license, with the gap between Budgeted and Paid, and between Paid and Used
- **Alternative:** a unit with licenses but no plan → Budgeted "Not planned"; a figure missing → `Unknown`, and no gap is shown for it (BR-04); licenses of different units of measure → shown per license, never added into one number
- **Result:** read-only; the figures of a unit equal the sum of the units under it (BR-21)

#### UC34 Track Monthly Plan Variance

- **Actor:** Admin, Manager
- **Main flow:** choose a unit and a year → for each month: Budgeted, Paid, Used, and the variance of actual against plan → chart of the variance by month → year-to-date total → list the licenses that explain most of a month's variance
- **Alternative:** a month without a plan or without actual data → no variance for that month, marked "Not planned" or `Unknown`; a month still running → marked "Month to date"
- **Result:** read-only; shows how actual moved away from the plan month by month

#### UC09 Forecast License Spending

- **Actor:** Manager
- **Status:** carried over from the previous model; shows cost
- **Main flow:** choose unit and fiscal year → actual by month and forecast for the remaining months → forecast year-end against the plan → upcoming renewals
- **Alternative:** too little history → forecast labelled "low confidence"
- **Result:** read-only; forecast and actual are never mixed in one figure (BR-11)

### Optimization

#### UC10 Detect Unused Licenses

- **Actor:** Admin, Manager
- **Main flow:** list of licenses with `Unassigned` seats (P&L, License, Paid, Assigned, Unassigned, Data date) sorted by unassigned seats → filter by unit → open the license → Manager: create a recommendation (UC14)
- **Alternative:** Assigned is `Unknown` → license excluded and counted as "Not evaluated"
- **Result:** BR-12; nothing changes at the P&L or the provider

#### UC11 Detect Inactive Usage

- **Actor:** Admin, Manager
- **Main flow:** list of seats in `Inactive` or `No activity` (Employee, Unit, License, Status, Last used) → filter by license, unit, status → open the license → Manager: create a recommendation (UC14)
- **Alternative:** `Not monitored` licenses excluded and counted separately (BR-04); a holder not matched to an employee → shown under "Unknown unit"; a holder who has left the company → listed as `Leaver`
- **Result:** BR-03, BR-12

#### UC12 Detect License Overuse

- **Actor:** Admin, Manager
- **Main flow:** list of licenses where use exceeds what was paid (P&L, License, License type, Paid, In use, Excess, Since) → open a license to see the evidence
- **Alternative:** a usage-based license → in use = consumption against the quota; missing data → `Not evaluated`; an unlimited license → never over-allocated
- **Result:** BR-07; the result also appears on the compliance dashboard (UC17)

#### UC35 Flag P&L Waste

- **Actor:** Admin, Manager
- **Main flow:** list of P&Ls with their waste status → a P&L that wastes licenses is shown in red (BR-22) → open a P&L: the figures behind the flag (Budgeted, Paid, Used) and the blocks, departments, projects, and licenses that cause it, each with its own flag → the same flag is shown wherever the unit appears (UC08, UC36, UC37)
- **Alternative:** a P&L with missing data → `Not evaluated`, never red and never "no waste"; a P&L whose figures are mock data → flag shown with the mock label (BR-14)
- **Result:** read-only; one answer per P&L to "is it wasting licenses"; the ratio and threshold are an [open decision](#open-decisions)

#### UC13 Optimize License Cost

- **Actor:** Manager
- **Status:** carried over from the previous model; shows estimated savings as money
- **Main flow:** list of saving opportunities built from UC10–UC12 (reduce seats, downgrade plan, cancel, reassign) with evidence → turn an opportunity into a recommendation (UC14)
- **Alternative:** no opportunity → "No saving opportunity found"
- **Result:** read-only until a recommendation is created; the system never acts on its own (BR-13)

#### UC14 Manage Recommendations

- **Actor:** Manager
- **Main flow:** recommendation table (Recommendation, License, Type, Status, Owner, Due date) → create from UC10–UC13 or by hand with evidence → accept, or reject with a reason → mark done → filter by status
- **Alternative:** reject without a reason → refused; mark done without accepting → refused; the same license and type already open → open the existing recommendation
- **Result:** BR-13

### Analytics

#### UC36 View Group Overview

- **Actor:** Admin
- **Main flow:** one row or card per P&L of the group: Budgeted, Paid, Used, and the waste flag — red when the P&L wastes licenses (UC35) → group totals → sort by waste → choose month or year → click a P&L to drill down (UC37)
- **Alternative:** a P&L without a connection or without data → shown as "No data yet", not left out; a P&L on mock data → labelled (BR-14)
- **Result:** read-only; quantities only (BR-05); the whole group on one screen

#### UC37 Drill Down by Organization

- **Actor:** Admin, Manager
- **Main flow:** start from the group (Admin) or from an assigned unit (Manager) → the units one level down with Budgeted, Paid, Used, and the waste flag → click a unit to go down: P&L → Block → Department → Project → at any level, open the licenses of that unit (UC28) → breadcrumb to go back up
- **Alternative:** a level with no units under it → goes straight to the licenses; a Manager going above their unit → `403`; a unit without data → `Not evaluated`
- **Result:** read-only; the figures of each level equal the sum of the level below (BR-21)

#### UC15 View License Dashboard

- **Actor:** Admin, Manager
- **Main flow:** total licenses, licenses by category and by license type, Paid vs Assigned vs Used per license, licenses expiring within 30 days, top applications by holders split into `Active`, `Inactive`, `No activity` → choose a unit → click to open a license
- **Alternative:** no data → "No data yet", never zeros
- **Result:** read-only; counts match UC27

#### UC16 View Financial Dashboard

- **Actor:** Admin, Manager
- **Status:** carried over from the previous model; shows spend
- **Main flow:** total yearly spend, spend by month, spend by unit (UC06), plan against actual (UC08), forecast year-end (UC09) → choose year and unit
- **Result:** read-only

#### UC17 View Compliance Dashboard

- **Actor:** Admin, Manager
- **Main flow:** licenses `Compliant`, `Over-allocated`, `Not evaluated`; overuse list (UC12); contracts with renewal soon or notice period passed (UC04)
- **Alternative:** missing data → `Not evaluated`, never `Compliant`
- **Result:** read-only

#### UC18 View Optimization Dashboard

- **Actor:** Admin, Manager
- **Main flow:** unassigned seats, inactive seats, P&Ls flagged for waste, recommendations by status → choose a unit
- **Alternative:** no usage data → "Not evaluated yet"
- **Result:** read-only; figures match UC10, UC11, UC14, UC35

### User & Organization

#### UC19 Manage Users

- **Actor:** Admin
- **Main flow:** user table (Name, Email, Role, Unit, Managed units, Status, Last login) → create an account for an employee known from ILVG: role → the system shows a one-time link to set the password → edit → reset password → disable or re-enable
- **Alternative:** email already exists → open that account; disabling oneself or the last active Admin → refused (BR-17); an employee who has left according to ILVG → account disabled automatically
- **Result:** disabling ends open sessions at once and never deletes the account; employees and their units come from ILVG (UC41), not from manual entry

#### UC20 Manage Organization Hierarchy

- **Actor:** Admin
- **Main flow:** tree of the group in its five fixed levels: Group > P&L > Block > Department > Project (BR-21) → see each unit with its code, name, and source → assign Managers to a unit at any level → correct a unit that ILVG placed wrongly, with a reason → mark a unit inactive
- **Alternative:** adding, removing, or reordering a level → not possible; a unit under a parent of the wrong level → refused; a code from SAP or a P&L that matches no unit → listed as "Unmatched" for Admin to link; a unit with members or an active plan → cannot be marked inactive
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

ELMS calls four kinds of source and writes to none of them (BR-01): the license API of each P&L, BCA, ILVG, and the SAP file (UC33). Fields each source can return: [Data fields research](07-data-fields-research.md).

#### UC38 Connect P&L License API

- **Actor:** Staff
- **Main flow:** table of P&Ls and their connection (P&L, Endpoint, Contract version, Status, Last run) → add a connection for a P&L: endpoint, read-only credentials, schedule → test the connection → ELMS reads a sample response and shows the licenses it found and which contract fields are present → save → the next run loads every license the P&L uses
- **Alternative:** the test fails → the error is shown and the connection is not saved (BR-20); the response does not follow the contract → saved only when the mandatory fields are present, missing optional fields are listed; a P&L with no API yet → shown as "Not connected", and its data may be mock only until it connects (BR-14)
- **Result:** one connection per P&L; ELMS calls, the P&L answers

#### UC39 Manage License Data Contract

- **Actor:** Staff
- **Main flow:** the current version of the contract: fields a P&L license API must and may return, per license type → publish a new version with its changes → download the contract and a sample response to hand to a P&L → conformance table: per P&L, contract version, mandatory fields present, optional fields present, last validation
- **Alternative:** a new version that removes or renames a field → both versions are accepted for a transition period; a P&L below the mandatory set → marked "Not conformant" and its failing records are rejected (BR-19)
- **Result:** one agreed shape for every P&L API, so a new P&L needs configuration only

#### UC40 Connect BCA Usage API

- **Actor:** Staff
- **Main flow:** set up the connection to BCA: endpoint, read-only credentials, schedule → test → preview what BCA returns (applications, members, frequency of use) → save → runs fill the employee usage table (UC32)
- **Alternative:** the test fails → not saved (BR-20); BCA covers only some machines or P&Ls → coverage shown, the rest is "Not tracked" (BR-04); BCA does not identify the member → usage is kept at the level BCA does identify
- **Result:** frequency of use per member, from company machines

#### UC41 Connect ILVG Employee API

- **Actor:** Staff
- **Main flow:** set up the connection to ILVG: endpoint, read-only credentials, schedule → test → preview employees and units → save → runs update employees, their unit, and the units of the hierarchy (UC20)
- **Alternative:** the test fails → not saved (BR-20); a unit code that does not fit the five levels → listed as "Unmatched" for Admin (UC20); an employee on several projects → every project is kept
- **Result:** employees per unit, the basis for showing licenses by department and project

#### UC25 Map Connection Data

- **Actor:** Staff
- **Main flow:** choose a source → list of items waiting to be linked → link a license reported by a P&L to a product of the catalog (UC01) → link a P&L's block, department, or project code to a unit of the hierarchy → link an application seen by BCA to a product → link a license line of the SAP plan to a product
- **Alternative:** a new license appears at a P&L → listed as "Not mapped", shown in the P&L's inventory but not grouped with other P&Ls until linked; an item linked by mistake → linking again reprocesses the data
- **Result:** the same software and the same unit carry one identity across all four sources

#### UC26 Monitor Data Synchronization

- **Actor:** Staff, Admin
- **Main flow:** connection table (Source, P&L, Status, Schedule, Last run) → run table (Source, Data period, Status, Records received, accepted, rejected, Duration) → open a run: what is complete, partial, or failed, with the reason → Staff: rejected records with the check that failed → run now, or rerun a failed period → pause or resume a connection, change its schedule, replace its credentials
- **Alternative:** a run failed → nothing written, the period stays `Unknown` (BR-04, BR-19); the same period run twice → replaced, no duplicate; no successful run for 3 days → marked "Stale"; credentials replaced → the test must pass before they are saved (BR-20)
- **Data scope:** Admin sees connections, runs, statuses, counts, and error codes; record contents and connection settings are Staff-only
- **Result:** read and rerun only; ELMS never writes to a source (BR-01)

### Self-service

#### UC23 View My Licenses

- **Actor:** Employee, Staff, Manager, Admin
- **Main flow:** table of licenses the user holds (License, Vendor, P&L, Assigned date, Status, Last used, Expiry date) → rows in `Inactive` or `No activity` carry a note that the seat may be reviewed → sort
- **Alternative:** no license → "You have no licenses assigned"; login email not matched → empty table with a hint to contact Admin; `Not monitored` → "Not tracked"
- **Result:** own rows only; another user's data returns `404`

#### UC24 Login / Logout

- **Actor:** Employee, Staff, Manager, Admin
- **Main flow:** email and password → system checks credentials and status → session created → default screen by role (Admin: Group Overview; Manager: Organization Drill-down of their unit; Staff: Sync Monitoring; Employee: My Licenses) → logout destroys the session
- **Alternative:** wrong credentials → generic message; 5 failures → locked 15 minutes; disabled account → refused; password not set yet → refused until the user opens the one-time link from Admin; session expired → log in again; screen outside the role → `403`
- **Result:** BR-18; SSO and self-registration are out of scope

## Open decisions

These do not change the use case list; they are settled when each use case is detailed.

| # | Decision | Affects |
|---|---|---|
| 1 | Which source gives **Paid**: the P&L license API or SAP | UC08, UC34, UC33 |
| 2 | The ratio and threshold that turn a unit red | UC35, BR-22 |
| 3 | Whether BCA identifies employees, and the key that joins BCA with ILVG | UC32, UC40 |
| 4 | Which project a seat counts toward when its holder works on several | UC28, UC37 |
| 5 | Whether the money-based use cases stay: UC04, UC06, UC07, UC09, UC13, UC16 | Mind map, BR-05 |
| 6 | The fields of the employee usage table | UC32, BR-23 |

**Related:** [Research](01-research-top-down.md) · [INVEST requirements](03-invest-requirements.md) · [Data fields research](07-data-fields-research.md)
