# Feature List

Features of the [use cases](02-use-cases.md), by mind-map branch. Each feature is something the system can do for an actor, taken from what its use case covers.

### License Management

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F01 | License list of the user's units, cloud services included: monthly cost, company, allocated against purchased, days to expiry; search, filter, sort | UC01 | Manager |
| F02 | Term of each license over time and the renewals coming | UC01 | Manager |
| F03 | License details: cost, term, unallocated or over-allocated seats | UC01 | Manager |
| F04 | Users of a license: holders, seat status, last use, how often they use it | UC01 | Manager |
| F05 | Cloud service details: its accounts, the units they are assigned to, the cost of each month by service | UC01 | Manager |
| F06 | License terms from the PO lines, with those renewing soon | UC01 | Manager |
| F07 | Licenses by unit — which units use a license, which licenses a unit has — and by provider | UC01 | Manager |
| F08 | Inventory each company's sources deliver, by provider, to check nothing is missing | UC02 | Staff |
| F09 | Software catalog with categories | UC02 | Staff |
| F10 | Mapping of license and application names to the catalog | UC02 | Staff |
| F11 | Shared licenses: mark a license used by several companies, see what each company is charged | UC02 | Staff; Manager sees its share |
| F12 | Assignment of each cloud account to a unit, or sharing it between units | UC02 | Staff |

### Optimization

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F13 | Choice of the unit in the hierarchy and of the period | UC03 | Manager |
| F14 | Plan, Spend, and Actual of a unit, cloud included, and how far Spend is from the plan | UC03 | Manager |
| F15 | Comparison of the units below a unit | UC03 | Manager |
| F16 | Plan, Spend, and Actual month by month | UC03 | Manager |
| F17 | Plan, Spend, and Actual per license of a unit | UC03 | Manager |
| F18 | Export of the figures | UC03 | Manager |
| F19 | *No use* seats, by how long they have been unused, with their cost | UC03 | Manager |
| F20 | *Inactive* seats — held by people who have left — to reclaim, with their cost | UC03 | Manager |
| F21 | *Unassigned* seats with their cost | UC03 | Manager |
| F22 | Employee usage of applications from BCA | UC03 | Manager |

### Budget Management

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F23 | Budget plan import from the SAP Excel export, for a unit and the units under it | UC04 | Manager |
| F24 | Plan by month and comparison of its versions | UC04 | Manager |
| F25 | Monthly cloud budget of a unit | UC04 | Manager |
| F26 | Purchase import from SAP: PR, PO, invoices | UC04 | Staff |
| F27 | Entry of a purchase made outside SAP | UC04 | Staff |
| F28 | Monthly accrual of license costs and month close | UC04 | Staff |
| F29 | Exchange rates | UC04 | Staff |
| F30 | Spend of the past months and forecast of the months left, licenses and cloud | UC05 | Manager |
| F31 | Year-end forecast against the plan | UC05 | Manager |
| F32 | Amounts that will fall due — license renewals and the cloud cost to come — with their expected value | UC05 | Manager |
| F33 | What drives the forecast: renewals before year end, growing cloud services | UC05 | Manager |

### Analytics

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F34 | License dashboard: counts by category, type, and provider; expiring soon; seats by status | UC06 | Manager |
| F35 | Spending dashboard: licenses and cloud, by month and by unit, against plan, with the forecast | UC06 | Manager |
| F36 | Figures by license, software, category, or provider | UC06 | Manager |
| F37 | Definition of every figure | UC06 | Manager |

### User & Organization

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F38 | Accounts created from ILVG, disabled when the employee leaves | UC07 | System |
| F39 | Role and data scope of each user; disable and re-enable access | UC07 | Admin |
| F40 | Permissions of each role | UC07 | Admin |
| F41 | Organization hierarchy from ILVG, with corrections | UC08 | Admin |
| F42 | Assignment of Managers to units | UC08 | Admin |

### Connection Management

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F43 | Connectors per company and provider, with their licenses: create, edit, delete | UC09 | Staff |
| F44 | Cloud providers connected through their API, or their billing file uploaded when there is none | UC09 | Staff |
| F45 | Connection test before saving | UC09 | Staff |
| F46 | Connectors and licenses with sync problems | UC09 | Staff |
| F47 | Sync runs: follow, rerun a period, pause and resume | UC09 | Staff |

### Self-service

| ID | Feature | Use case | Actors |
|---|---|---|---|
| F48 | My licenses across all my emails, with status and last use | UC10 | Everyone |
| F49 | Login and logout | UC11 | Everyone |
| F50 | Set and reset the password with a link sent to the account email | UC11 | Everyone |

**Count:** 50 features.
