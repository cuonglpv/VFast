# Feature List

Features of the [use cases](02-use-cases.md), by mind-map branch. Each feature is something the system can do for an actor, taken from what its use case covers. A Manager can also do every task of Staff in their units, so the features of Staff list both.

### License Management

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F01 | License list of the user's units: monthly cost, company, allocated against purchased, days to expiry; search, filter, sort | UC01 | Manager |
| F02 | Term of each license over time and the renewals coming | UC01 | Manager |
| F03 | License details: cost, term, unallocated or over-allocated seats | UC01 | Manager |
| F04 | Users of a license: holders, seat status, whether still employed, last use, how often they use it | UC01 | Manager |
| F05 | License terms from the PO lines, with those renewing soon | UC01 | Manager |
| F06 | Licenses by unit — which units use a license, which licenses a unit has — and by provider | UC01 | Manager |
| F07 | Inventory each company's sources deliver, by provider, to check nothing is missing | UC02 | Staff, Manager |
| F08 | Software catalog with categories | UC02 | Staff, Manager |
| F09 | Mapping of license and application names to the catalog | UC02 | Staff, Manager |
| F10 | Shared licenses: mark a license used by several companies, see what each company is charged | UC02 | Staff, Manager |
| F11 | Assignment of each cloud account to a unit, or sharing it between units; the accounts not assigned yet | UC02 | Staff, Manager |

### Optimization

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F12 | Choice of the unit in the hierarchy and of the period | UC03 | Manager |
| F13 | Plan, Spend, and Actual of a unit, and how far Spend is from the plan | UC03 | Manager |
| F14 | Comparison of the units below a unit | UC03 | Manager |
| F15 | Plan, Spend, and Actual month by month | UC03 | Manager |
| F16 | Plan, Spend, and Actual per license of a unit | UC03 | Manager |
| F17 | Export of the figures | UC03 | Manager |
| F18 | *No use* seats, by how long they have been unused, with their cost | UC03 | Manager |
| F19 | *Inactive* seats — held by people who have left — to reclaim, with their cost | UC03 | Manager |
| F20 | *Unassigned* seats with their cost | UC03 | Manager |
| F21 | Employee usage of applications from VinSOC | UC03 | Manager |

### Cloud

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F22 | Plan, Spend, and Actual of the cloud services of a unit, by month and year to date | UC04 | Manager |
| F23 | The same figures for each unit below, down to each provider and service | UC04 | Manager |
| F24 | Cloud service details: its accounts, the units they are assigned to, the cost of each month by service and by billing account | UC04 | Manager |
| F25 | Export of the cloud figures | UC04 | Manager |

### Budget Management

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F26 | Budget plan import from the SAP Excel export, for a unit and the units under it | UC05 | Manager |
| F27 | Plan by month and comparison of its versions | UC05 | Manager |
| F28 | Monthly cloud budget of a unit | UC05 | Manager |
| F29 | Gap between plan and purchases, unit by unit | UC05 | Manager |
| F30 | Purchase import from SAP: PR, PO, invoices | UC05 | Staff, Manager |
| F31 | Entry of a purchase made outside SAP; the months still missing | UC05 | Staff, Manager |
| F32 | Monthly accrual of license costs and month close | UC05 | Staff, Manager |
| F33 | Exchange rates | UC05 | Staff, Manager |
| F34 | Spend of the past months and forecast of the months left, licenses and cloud | UC06 | Manager |
| F35 | Year-end forecast against the plan | UC06 | Manager |
| F36 | Amounts that will fall due — license renewals and the cloud cost to come — with their expected value | UC06 | Manager |
| F37 | What drives the forecast: renewals before year end, growing cloud services | UC06 | Manager |

### Analytics

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F38 | License dashboard: counts by category, type, and provider; expiring soon; seats by status | UC07 | Manager |
| F39 | Spending dashboard: licenses and cloud, by month and by unit, against plan, with the forecast | UC07 | Manager |
| F40 | Figures by license, software, category, or provider | UC07 | Manager |
| F41 | Definition of every figure | UC07 | Manager |

### User & Organization

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F42 | Accounts for ILVG employees, disabled when the employee leaves | UC08 | System |
| F43 | Role (Manager or Staff) and data scope of each user: the unit of a Manager, the Manager of a Staff member; disable and re-enable access | UC08 | Admin |
| F44 | Permissions of each role | UC08 | Admin |
| F45 | History of changes to accounts and the hierarchy | UC08 | Admin |
| F46 | Organization hierarchy from ILVG — P&L, block, department, project — with corrections | UC09 | Admin |

### Connection Management

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F47 | Connectors per company and provider, with their licenses: create, edit, delete | UC10 | Staff, Manager |
| F48 | Cloud providers connected through their API, or their billing file uploaded when there is none | UC10 | Staff, Manager |
| F49 | Connection test before saving | UC10 | Staff, Manager |
| F50 | Connectors and licenses with sync problems | UC10 | Staff, Manager |
| F51 | Sync runs: follow, rerun a period, pause and resume | UC10 | Staff, Manager |

### Access

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F52 | Login and logout | UC11 | Admin, Manager, Staff |
| F53 | Set and reset the password with a link sent to the account email | UC11 | Admin, Manager, Staff |

**Count:** 53 features.
