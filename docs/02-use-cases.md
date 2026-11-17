# Actors, Roles, and Use Cases

System: **Enterprise License Management System (ELMS)**, built by team VFast. Use cases are grouped in six branches: License Management, Optimization, Budget Management, Analytics, User & Organization, Connection Management. They are close to the branches of the [mind map](mindmap.png) but not one to one: the mind map collects ideas, the use cases the goals of the actors.

**Business model.** ELMS brings together the software licenses of every company of the group, cloud services included. It does not enter, grant, buy, or pay for anything: licenses and their holders come from each P&L's license API, actual usage from BCA, employees and units from ILVG, and the budget plan, the purchases, and the cloud bills from SAP. Everything is shown over a fixed hierarchy, Group > P&L > Block > Department > Project, with three figures — **Plan, Spend, Actual** — from which the user judges waste.

**What a use case is.** A use case is one large flow of action of one actor toward one goal. Its smaller branches and the cases it handles are not use cases of their own; they belong to its specification. A use case describes behaviour, not screens.

## Actors

| Actor | Description |
|---|---|
| `MANAGER` | **The main user.** Manager of a unit at any level: the group, a P&L, a block, a department, or a project. For that unit and everything under it: browses licenses and who uses them, tracks waste, plans the budget, follows the forecast, reads the dashboards |
| `STAFF` | Member of the license management team; does the hands-on work: connects the data sources, imports the purchases and the cloud bills from SAP, runs the monthly accrual, keeps the exchange rates, the software catalog, the shared licenses, and the assignment of cloud accounts to units. Works on the companies assigned to them, or on all of them at group level |
| `ADMIN` | Runs access to the system and nothing else: roles, data scopes, permissions, and the organization hierarchy. Sees no license, budget, or cost data |
| `EMPLOYEE` | Every employee of the group. Sees the licenses they hold and whether they use them |
| Usage connectors | One per company and provider (Microsoft, Atlassian, Adobe…). Return the licenses the company uses, with their holders and usage |
| BCA | Usage tracking on company machines. Returns how often each employee uses each application |
| ILVG | Internal application. Returns employees, the unit of each, and who has left; every ELMS account is created from it |
| SAP | Source of the budget plan, the purchases of licenses (PR, PO, invoices), and the cloud bills, exported to Excel and imported into ELMS |

Every account belongs to a real employee, so View My Licenses and Login / Logout belong to every role.

## Core concepts

- **Organization.** A *unit* is a node of the fixed hierarchy Group > P&L > Block > Department > Project; a P&L is also called a company. Every figure of a unit is the sum of the units under it. Seats nobody holds are kept under *Unallocated*, holders that cannot be placed under *Unknown unit*, so totals always add up.
- **Data scope.** A Manager sees their units and everything under them, Staff their companies, an Employee only their own licenses, Admin no license or cost data.
- **License.** One license a connector reports for one company, such as *Microsoft 365 E3* of company A. Its quantity bought, terms, and cost come from the purchases in SAP. Licenses are grouped by software and category in a catalog kept by Staff.
- **Shared license.** A license bought once and used by two or more companies. The group owns and plans it; each company is charged for what its people use.
- **Cloud service.** A special kind of license: a cloud account — Azure, AWS, Google Cloud… — paid as you go and billed each month, usually shared infrastructure rather than seats held by people. Staff assign each cloud account to the unit that uses it, or share it between units like a shared license.
- **Plan, Spend, Actual.** *Plan* is the budget imported from SAP. *Spend* is what was bought, month by month: the license invoices spread over their terms, and the cloud bills of the month. *Actual* is the value of what is really used: the seats in use, or what was consumed. ELMS computes **no waste figure, rate, or flag**: the user compares the three figures and the seat statuses to judge waste.
- **Seat status.** Every assigned seat is *Active* — used, daily or now and then; *Inactive* — its holder has left the company but still holds the license, which must be reclaimed; or *No use* — assigned but not used for a length of time, such as 30 or 60 days. A seat without a usage source is *Not monitored*; a seat bought but given to nobody is *Unassigned*.
- **Forecast.** A projection of Spend to the end of the year, set against the Plan, with the amount of the bills that will fall due. It is always shown as a forecast, never as an actual figure. ELMS never pays a bill.
- **Missing data** is *Unknown*, never zero.

## Role × use case matrix

| Mind-map branch | Use cases | Admin | Manager | Staff | Employee |
|---|---|---|---|---|---|
| License Management | View License Detail (UC01) | | ✓ own units | | |
| | Browse License Inventory (UC02) | | ✓ own units | ✓ own companies; catalog, shared licenses, cloud accounts | |
| Optimization | Track License Waste (UC03) | | ✓ own units | | |
| Budget Management | Manage Budget Plan (UC04) | | ✓ plan of own units | ✓ purchases and cloud bills, accrual, exchange rates | |
| | Forecast Spending (UC05) | | ✓ own units | | |
| Analytics | View Dashboards (UC06) | | ✓ own units | | |
| User & Organization | Manage User Roles and Permissions (UC07), Manage Organization Hierarchy (UC08) | ✓ | | | |
| Connection Management | Manage Data Connectors (UC09) | | | ✓ own companies | |
| Self-service | View My Licenses (UC10), Login / Logout (UC11) | ✓ | ✓ | ✓ | ✓ |

**In short:** the Manager uses the product; Staff keep it fed; Admin decides who can do what; the Employee sees their own licenses.

## Use cases

### Use case diagrams

One diagram per actor, listing every use case the actor can start, grouped by mind-map branch. They are generated from the use case list below by `docs/diagrams/ve_usecase.py` (draw.io sources and SVG in [`diagrams/out/`](diagrams/out/)), so rerun it after changing the list.

| Manager | Staff |
|---|---|
| ![Manager use cases](diagrams/out/uc_manager.png) | ![Staff use cases](diagrams/out/uc_staff.png) |

| Admin | Employee |
|---|---|
| ![Admin use cases](diagrams/out/uc_admin.png) | ![Employee use cases](diagrams/out/uc_employee.png) |

### Use case list

| ID | Use case | Goal | Actors |
|---|---|---|---|
| | **License Management** | | |
| UC01 | View License Detail | Know every license of my units, cloud services included: what it costs, how much of it is allocated, when it expires, and who uses it | Manager |
| UC02 | Browse License Inventory | See which licenses each unit and provider has; for Staff, keep the catalog, the shared licenses, and the cloud accounts assigned to units, so the figures land on the right units | Manager, Staff |
| | **Optimization** | | |
| UC03 | Track License Waste | Judge where licenses are wasted, from Plan, Spend, and Actual of every unit and the seats that are not used, unassigned, or held by people who have left | Manager |
| | **Budget Management** | | |
| UC04 | Manage Budget Plan | Managers set the plan of their units; Staff bring in what was bought and the cloud bills, so Plan and Spend are right every month | Manager, Staff |
| UC05 | Forecast Spending | Know before the year ends where spending will land against the plan, and what the coming bills will be | Manager |
| | **Analytics** | | |
| UC06 | View Dashboards | See licenses, spending, and usage of my units at a glance, by unit or by license, provider, and category | Manager |
| | **User & Organization** | | |
| UC07 | Manage User Roles and Permissions | Give each user the role and the data scope their job needs | Admin |
| UC08 | Manage Organization Hierarchy | Keep the hierarchy from ILVG right and assign Managers to units | Admin |
| | **Connection Management** | | |
| UC09 | Manage Data Connectors | Connect the data sources of each company so their licenses and usage flow into ELMS, and keep the syncs healthy | Staff |
| | **Self-service** | | |
| UC10 | View My Licenses | See the licenses I hold and whether I use them | Everyone |
| UC11 | Login / Logout | Sign in and out; set the password from the account email | Everyone |

### What each use case covers

**UC01 View License Detail** — Manager
- The list of every license of their units, cloud services included: monthly cost, company, allocated against purchased, days to expiry.
- The term of each license over time, and the renewals coming.
- The details of a license, and its users: who holds a seat, its status, when and how often they use it.
- For a cloud service: its accounts, the units they are assigned to, and the bills of each month.
- The license terms from the PO lines.

**UC02 Browse License Inventory** — Manager, Staff
- The licenses of any unit, the units of any license, the licenses of each provider.
- Staff: keep the software catalog and map the license and application names to it.
- Staff: mark the licenses used by several companies as shared, and see what each company is charged.
- Staff: assign each cloud account to the unit that uses it, or share it between units.

**UC03 Track License Waste** — Manager
- Choose the unit to look at in the hierarchy, and the period.
- Plan, Spend, and Actual of that unit, cloud included, and how far Spend is from the plan.
- The same figures for each unit below it, side by side and month by month, down to each license; export them.
- The seats to look at: *No use* seats by how long they have been unused, *Inactive* seats to reclaim, *Unassigned* seats, with their cost.
- How often each employee uses each application, from BCA.

**UC04 Manage Budget Plan** — Manager, Staff
- Manager: import the plan of their unit, or of any unit under it, from the SAP Excel export; see it by month and compare its versions.
- Staff: import the purchases — PR, PO, invoices — and the cloud bills from SAP, and enter those made outside it.
- Staff: close the monthly accrual of license costs.
- Staff: keep the exchange rates.

**UC05 Forecast Spending** — Manager
- Spend of the past months and the forecast of the months left, licenses and cloud.
- The year-end forecast against the plan: over or under, by how much.
- The bills that will fall due — license renewals and cloud bills — with their expected amount.
- What drives the forecast: the licenses renewing before the year ends, the cloud services growing.

**UC06 View Dashboards** — Manager
- Licenses: counts by category, type, and provider; expiring soon; seats by status.
- Spending: licenses and cloud, by month and by unit, against plan, with the forecast.
- The same figures by license, software, category, or provider.
- The definition of every figure.

**UC07 Manage User Roles and Permissions** — Admin
- Give each user a role and a data scope: the units of a Manager, the companies of a Staff member.
- Disable or re-enable access.
- Set what each role may read or change.

**UC08 Manage Organization Hierarchy** — Admin
- See the hierarchy from ILVG and correct a unit placed wrongly.
- Assign Managers to units at any level.

**UC09 Manage Data Connectors** — Staff
- Create, edit, and delete the connector of a company and provider, with its licenses.
- See which connectors and licenses have sync problems.
- Follow the sync runs, rerun a period, pause or resume a connector.

**UC10 View My Licenses** — everyone
- The licenses the user holds across all their emails, with their status and last use.

**UC11 Login / Logout** — everyone
- Sign in and out; set or reset the password with a link sent to the account email.

**Out of scope:** entering, granting, revoking, buying, or renewing licenses; paying bills; computing waste; tracking the actions taken on licenses; creating accounts by hand.

## System processes

Done by ELMS on its own, with no user acting; they feed the use cases above.

| Process | What the system does | Feeds |
|---|---|---|
| Connector sync | Reads each data connector at its interval: licenses, holders, and activity | UC01, UC03, UC09 |
| ILVG sync and accounts | Reads employees, their units, and who has left; creates an account for each new employee and disables the account of a leaver | UC03, UC07, UC08, UC11 |
| BCA sync | Reads how often each employee uses each application | UC01, UC03 |
| Data matching | Matches units, budget lines, purchases, and cloud bills across the sources; matches license names to the catalog and holders to employees | UC02, UC04 |
| Seat status | Every day, sets the status of each seat | UC01, UC03, UC10 |
| Cost roll-up | Every day, spreads the cost of each license over the seats and units that hold it, and the cost of each cloud account over the units it is assigned to, and adds them up the hierarchy | UC03, UC06 |
| Forecast | Projects Spend to the end of the year from the purchases, the renewals, and the recent cloud bills | UC05, UC06 |

**Related:** [Research](01-research-top-down.md) · [INVEST requirements](03-invest-requirements.md) · [Data fields research](09-data-fields-research.md)
