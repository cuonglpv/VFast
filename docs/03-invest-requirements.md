# INVEST Requirements & Acceptance Criteria — VFast

> Design status: TARGET

Each story is small enough to implement and test independently. Authentication, authorization, data scope, and error handling are acceptance constraints, not hidden features. Business rules `BR-xx` are defined in [Use cases](02-use-cases.md#business-rules). Story `USxx` implements use case `UCxx`.

## INVEST checklist

| Principle | Application in this backlog |
|---|---|
| Independent | Each story produces a demonstrable outcome and lists only unavoidable prerequisites; viewing stories run on seeded data without waiting for connectors. |
| Negotiable | Layout and implementation details may change while the outcome, permissions, and business rules stay fixed. |
| Valuable | Every story names the benefit for one role: Manager, Staff, Admin, or Employee. |
| Estimable | Inputs, outputs, roles, data scope, and failure outcomes are explicit; each story has a story-point estimate. |
| Small | One capability per story; no story exceeds 8 points. |
| Testable | Every story has observable Given/When/Then criteria, including reconciliation rules that tie figures across screens. |

## Product backlog

Priority uses MoSCoW (`M` must, `S` should, `C` could). Story points use the Fibonacci scale.

| ID | User story | Value | Dependencies | Priority | Points |
|---|---|---|---|---|---|
| US01 | As a Manager or Staff member, I want overview metrics of the license portfolio so that I see its size and structure at a glance. | Fast overview | US02, US14 | M | 3 |
| US02 | As a Manager or Staff member, I want one searchable, filterable table of every license so that I stop visiting each provider's portal. | Central catalog | US14 | M | 5 |
| US03 | As a Manager or Staff member, I want the detail of a license with every holder and their usage status so that I know who is not using it. | Actionable detail | US02 | M | 5 |
| US04 | As a Manager, I want KPIs for total spend and underutilized accounts and their cost so that waste is expressed in money. | Waste in money | US03 | M | 3 |
| US05 | As a Manager, I want a chart of applications by used, inactive, and never-used accounts so that I know which application to review first. | Prioritized review | US03 | M | 3 |
| US06 | As a Manager, I want license spend per department so that I see where the money goes and can plan budgets. | Cost visibility | US03 | M | 3 |
| US07 | As a Manager, I want subscription usage month by month so that I see whether the situation is improving. | Trend | US03 | S | 5 |
| US08 | As a Manager, I want a budget overview for a fiscal year so that I know which units are close to or over budget. | Budget control | US09 | M | 3 |
| US09 | As a Manager, I want to create and activate a yearly budget plan for my unit so that actual cost has something to be compared with. | Planning | US14 | M | 5 |
| US10 | As a Manager, I want to add budget lines with the number of people and the cost per license so that the budget says what it is for. | Purchase plan | US09, US02 | M | 5 |
| US11 | As a Manager, I want planned, purchased, assigned, used, and actual cost per license side by side so that I see at which step the plan and reality diverge. | Reconciliation | US10, US03 | M | 5 |
| US12 | As a Manager, I want a month-end list of seats that were not used, with their cost, and to record a decision for each so that waste is acted on every month. | Monthly action | US03, US08 | M | 8 |
| US13 | As an employee, I want to see the licenses assigned to me and whether I am recorded as using them so that I can tell my manager when I no longer need one. | Self-service | US14 | M | 2 |
| US14 | As any user, I want to log in and out and land on the screen of my role so that only I see my data. | Protected access | Seeded accounts | M | 3 |
| US15 | As an Admin, I want to create users, give them a role and units, and disable them so that everyone sees exactly what they should. | Access administration | US14 | M | 3 |
| US16 | As a Staff member, I want to declare and edit licenses, contracts, and prices so that the catalog stays correct where connectors give no data. | Correct catalog | US02 | M | 5 |
| US17 | As a Staff member, I want to import usage and cost from a file or enter them by hand so that licenses without an API are still analyzed. | Coverage | US16 | M | 8 |

**Total:** 17 stories, 74 points. Must-have: 16 stories (69 points).

## Per-story INVEST review

`PASS` means the design provides enough information for planning and acceptance. It does not claim that implementation or tests exist.

| Story | I | N | V | E | S | T | Notes |
|---|---|---|---|---|---|---|---|
| US01 | PASS | PASS | PASS | PASS | PASS | PASS | Counting rule (per license, not per seat) and grouping rules are explicit. |
| US02 | PASS | PASS | PASS | PASS | PASS | PASS | Columns, filters, default sort, and paging are fixed; compliance per BR-08. |
| US03 | PASS | PASS | PASS | PASS | PASS | PASS | Status per BR-02; totals tie to US02, US04, US05. |
| US04 | PASS | PASS | PASS | PASS | PASS | PASS | Formulas BR-04, BR-05 are testable with seeded data. |
| US05 | PASS | PASS | PASS | PASS | PASS | PASS | Ranking and exclusion of `Not monitored` are explicit. |
| US06 | PASS | PASS | PASS | PASS | PASS | PASS | Split rule BR-07; total equals Total annual spend. |
| US07 | PASS | PASS | PASS | PASS | PASS | PASS | Needs daily snapshots; month-end status rule is explicit. Should-have. |
| US08 | PASS | PASS | PASS | PASS | PASS | PASS | Only `Active` plans count; thresholds BR-11. |
| US09 | PASS | PASS | PASS | PASS | PASS | PASS | One plan per unit and year; `Draft`/`Active` lifecycle (BR-10). |
| US10 | PASS | PASS | PASS | PASS | PASS | PASS | Suggested cost is only a starting value. |
| US11 | PASS | PASS | PASS | PASS | PASS | PASS | Gap types BR-09; `Unknown` never flags a gap. |
| US12 | PASS | PASS | PASS | PASS | PASS | PASS | Largest Manager story (8). Splits into: month-end job, warning list, unused-seat table, decision recording. Tests set "today" instead of waiting. |
| US13 | PASS | PASS | PASS | PASS | PASS | PASS | Own data only; no price or cost. |
| US14 | PASS | PASS | PASS | PASS | PASS | PASS | Lockout and cookie rules BR-18. |
| US15 | PASS | PASS | PASS | PASS | PASS | PASS | No self-disable; last Admin protected. |
| US16 | PASS | PASS | PASS | PASS | PASS | PASS | Connector override keeps the original (BR-15); history BR-16. |
| US17 | PASS | PASS | PASS | PASS | PASS | PASS | 8 points. Splits into: templates per archetype, upload and validation, preview and confirm, manual entry, history. |

## Acceptance criteria

Format: **Given** context, **When** action, **Then** observable result.

### AC-US01 License overview metrics

1. Given 42 active licenses and 3 expired ones, when License Management opens, then Total Licenses shows 42 and the expired ones are not in the pie chart.
2. Given licenses in 8 categories, then the 5 largest are shown and the rest are grouped as `Other`; a license without category appears as `Uncategorized`.
3. Given a click on a category, then the license table (US02) is filtered by it; given a click on an application in the top 5, then its detail (US03) opens.

### AC-US02 License list

1. Given licenses exist, when searching by name or publisher or filtering by type, category, compliance status, or expiry range, then only matching rows are listed, sorted by nearest expiry, 20 per page.
2. Given Total users > License entitlement, then Compliance status is `Over-allocated`; given missing data, then `Not evaluated`.
3. Given a license expiring within 30 days, then it is marked "Expiring soon"; given a perpetual license, then Expiry date shows "Does not expire".
4. Given no match, then "No matching license" is shown with a clear-filters button.

### AC-US03 License detail

1. Given a license with 20 seats and 15 holders, then Unassigned subscriptions shows 5 and the user table has 15 rows, each with exactly one status.
2. Given the same license, then the number of `Inactive` + `No activity` rows equals its share in Underutilized accounts (US04) and in Application Usage (US05).
3. Given a holder not matched to an employee, then the row shows the provider identity and `Unknown department`.
4. Given any role, then the table has no assign or revoke action.

### AC-US04 Analytics KPIs

1. Given seeded licenses, then Total annual spend = Σ effective monthly cost × 12 and Underutilized license cost = Σ (underutilized accounts × yearly seat price), never above Total annual spend.
2. Given `Not monitored` accounts or `Unassigned` seats, then they are not counted as underutilized.
3. Given no license with usage data, then the two underutilized KPIs show "Not evaluated yet", not 0.
4. Given two currencies and no exchange rate, then money KPIs are shown per currency.

### AC-US05 Application usage

1. Given applications with user data, then the top 5 by Total users are shown, ties broken by name, and each bar's three parts add up to its Total users.
2. Given a switch to top 10 when only 7 applications exist, then 7 are shown.
3. Given an application without a usage source, then it is left out and the note shows how many are `Not monitored`.

### AC-US06 Spend by department

1. Given a license of 12 seats costing 120 per year with 3 seats in Sales and 9 unassigned, then Sales gets 30 and `Unallocated` gets 90.
2. Given any data, then the sum of all groups, including `Unallocated` and `Unknown department`, equals Total annual spend in US04.

### AC-US07 Subscription usage by month

1. Given November, then December is not shown and November is marked incomplete.
2. Given a month, then its stacked bar + `Unassigned` equals the subscriptions purchased on its last day.
3. Given a month without data, then it shows "No data", never a zero bar; given the latest month, then `Inactive` + `No activity` equals Underutilized accounts in US04.

### AC-US08 Budget overview

1. Given two `Active` plans and one `Draft`, then Total budget sums only the two `Active` plans, while the `Draft` appears in the table.
2. Given utilization 84%, then the row is coloured as a warning; given 100% or more, then as over budget.
3. Given a unit with cost but no plan, then Budget shows "Not set" and Utilization "—".
4. Given a Manager of unit A, when unit B's data is requested, then the API returns `403`.

### AC-US09 Budget plan

1. Given a unit without a plan for 2027, when a plan with budget 600 is saved, then it is `Draft`; when activated, then it is `Active` and counted in US08.
2. Given the unit already has a 2027 plan, when creating another, then the existing plan opens instead.
3. Given budget ≤ 0 or no currency, then field errors are returned and nothing is saved.
4. Given an `Active` plan, when its budget changes, then a reason is required and the old value, new value, reason, and time are kept; deleting it is refused.

### AC-US10 Budget lines

1. Given a license priced 10 per seat per year, when 40 people are planned, then 400 is suggested and the saved value becomes Planned cost.
2. Given the license is already in the plan, when added again, then the existing line opens.
3. Given a license not in the catalog, then the line is marked "Not in catalog" and Purchased, Assigned, Used show "—".
4. Given lines above the budget, then they are saved and the excess is shown.

### AC-US11 Budget vs actual

1. Given Planned 40, Purchased 40, Assigned 35, Used 22, then the line is flagged `Unassigned` and `Unused`, not `Over plan`.
2. Given Used is `Unknown`, then the line is not flagged `Unused`.
3. Given cost from a license that is not in the plan, then it appears under "Outside plan" with Planned 0, and all lines add up to the unit's Actual cost in US08.

### AC-US12 Month-end warnings

1. Given a seat assigned for all of October with no activity, when the check runs on 1 November, then it appears in unit A's October warning with its monthly cost; a seat assigned on 15 October does not.
2. Given the check runs twice for October, then unit A still has one warning.
3. Given a `Not monitored` license, then its seats are not in the warning and are counted separately.
4. Given a Manager records `Keep` without a reason, then it is refused; with a reason, then the decision is stored with who and when, and nothing is sent to the provider.
5. Given unit utilization reaches 80%, then the warning includes a budget warning.

### AC-US13 My licenses

1. Given an employee holding 3 licenses, then exactly those 3 rows are shown, without price or cost.
2. Given a request for another employee's licenses, then the API returns `404`.
3. Given a license in `No activity`, then the row carries the month-end review note.

### AC-US14 Login / logout

1. Given valid credentials, then a session is created and the user lands on the screen of their role.
2. Given wrong credentials or a disabled account, then the same generic message is shown.
3. Given 5 failed attempts in a row, then login is locked for 15 minutes.
4. Given an Employee opens the Budget screen, then the API returns `403`.
5. Given logout, then the session is destroyed and internal pages redirect to login.

### AC-US15 Users and roles

1. Given an Admin creates a Manager without a unit, then it is refused; with a unit, then the Manager sees only that unit after login.
2. Given an existing email, then the existing account opens instead of a duplicate.
3. Given a user is disabled, then their open sessions end at once and the account stays listed.
4. Given the Admin tries to disable themselves or the last active Admin, then it is refused.
5. Given a non-Admin calls the user API, then it returns `403`.

### AC-US16 Manage licenses

1. Given a new license with provider, product, archetype, contract, entitlement, and price, when saved, then it appears in US02 with source `manual`.
2. Given a renewal date before the start date or a negative quantity, then field errors are returned.
3. Given a quantity that comes from a connector, when Staff overrides it, then a reason is required and the connector value is kept beside the override.
4. Given a license is no longer tracked, then it leaves the active list but its history remains.
5. Given a Manager or Employee calls the edit API, then it returns `403`.

### AC-US17 Import license data

1. Given a Metered license, then the downloaded template is the Metered one.
2. Given a valid file, then the preview shows rows to add, update, and reject before anything is written; after confirming, rows carry source `import`.
3. Given a file with a missing required column, then the whole file is rejected and the error rows are listed.
4. Given the same period is imported twice, then no duplicate rows exist.
5. Given the license has a connector for usage, when usage is imported, then it is refused.

## Cross-cutting acceptance constraints

- Only Admin, Manager, Staff, and Employee have accounts; every API requires login because per-user usage is sensitive.
- The API, not the client, enforces roles and data scope (BR-17).
- VFast never writes to a provider (BR-01); every connector uses read-only access.
- Missing data is `Unknown`, never 0 (BR-03); every figure carries its source and confidence (BR-14).
- Figures tie across screens: Total users (US02 = US03), Underutilized accounts (US03 = US04 = US05 = US07 latest month), Total annual spend (US04 = US06 total), Actual cost (US08 = US11 total).
- Providers sit behind a connector interface with fakes, so every story is testable without real tenants.

**Related:** [Research](01-research-top-down.md) · [Use cases](02-use-cases.md)
