# INVEST Requirements & Acceptance Criteria — ELMS

> Design status: TARGET

Each story is small enough to implement and test independently. Authentication, authorization, data scope, and error handling are acceptance constraints, not hidden features. Business rules `BR-xx` are defined in [Use cases](02-use-cases.md#business-rules). Story `USxx` implements use case `UCxx`, and stories are grouped by the branches of the [mind map](mindmap.png).

## INVEST checklist

| Principle | Application in this backlog |
|---|---|
| Independent | Each story produces a demonstrable outcome and lists only unavoidable prerequisites; analytics and detection stories run on seeded data without waiting for connectors. |
| Negotiable | Layout and implementation details may change while the outcome, permissions, and business rules stay fixed. |
| Valuable | Every story names the benefit for one role: Employee, Staff, Manager, or Admin. |
| Estimable | Inputs, outputs, roles, data scope, and failure outcomes are explicit; each story has a story-point estimate. |
| Small | One mind-map leaf per story; only US03 reaches 13 points and is split into five deliverable parts, every other story is 5 or less. |
| Testable | Every story has observable Given/When/Then criteria, including rules that tie figures across screens. |

## Product backlog

Priority uses MoSCoW (`M` must, `S` should, `C` could). Story points use the Fibonacci scale.

| ID | User story | Value | Dependencies | Priority | Points |
|---|---|---|---|---|---|
| **License Management** | | | | | |
| US01 | As a Staff member, I want to maintain one software catalog for every provider so that everyone talks about the same products. | Single catalog | US24 | M | 5 |
| US02 | As a Staff member, I want to record the publishers and resellers we buy from so that every product and contract has an owner. | Vendor master data | US24 | M | 2 |
| US03 | As a Staff member, I want to record entitlement lines with archetype, quantity, and price, connect a line to its provider when the provider has a connector, and — where no connector exists — record who holds each license and their usage, so that purchased, assigned, and used quantities are known. | Purchased and usage baseline | US01, US02 | M | 13 |
| US04 | As a Staff member, I want to record contracts with renewal date and notice period so that renewals are never missed. | Renewal control | US02, US03 | M | 3 |
| **Budget Management** | | | | | |
| US05 | As a Manager, I want to plan my unit's yearly license budget with planned quantity and cost per license so that spending has a target. | Planning | US03, US20 | M | 5 |
| US06 | As a Manager, I want license cost allocated to departments by seat holder so that I see where the money goes. | Cost visibility | US03 | M | 3 |
| US07 | As a Staff member, I want to enter or import expenses with invoices so that actual cost is complete. | Actual cost | US03 | M | 5 |
| US08 | As a Manager, I want planned, purchased, assigned, used, and actual cost side by side so that I see where plan and reality diverge. | Reconciliation | US05, US07 | M | 5 |
| US09 | As a Manager, I want a year-end spending forecast so that I can act before the budget is exceeded. | Early warning | US07, US04 | S | 5 |
| **Optimization** | | | | | |
| US10 | As a Manager, I want to see licenses with unassigned seats and their cost so that I stop paying for seats nobody holds. | Waste found | US03 | M | 3 |
| US11 | As a Manager, I want to see seats that are inactive or never used so that I know whom to ask. | Waste found | US03 | M | 3 |
| US12 | As a Manager, I want to see licenses used beyond their entitlement so that compliance risk is caught before an audit. | Compliance | US03 | M | 5 |
| US13 | As a Manager, I want saving opportunities with evidence and the date I can act on them so that I choose the right moment. | Savings | US10, US11, US04 | S | 5 |
| US14 | As a Manager, I want to accept, reject, and close recommendations so that savings are decided and tracked. | Decisions | US10, US11 | M | 5 |
| **Analytics** | | | | | |
| US15 | As a Manager, I want a license dashboard so that I see the portfolio and its usage at a glance. | Overview | US03 | M | 3 |
| US16 | As a Manager, I want a financial dashboard so that spend, budget, and forecast are on one screen. | Financial overview | US06, US08 | M | 3 |
| US17 | As a Manager, I want a compliance dashboard so that overuse and contract deadlines are visible. | Compliance overview | US12, US04 | M | 3 |
| US18 | As a Manager, I want an optimization dashboard so that I see waste and realized savings. | Savings overview | US10, US11, US14 | S | 3 |
| **User & Organization** | | | | | |
| US19 | As an Admin, I want to create, edit, and disable users, hand them a link to set their password, and import the employee directory so that only the right people have access and every license holder has a department. | Access control | US24 | M | 5 |
| US20 | As an Admin, I want to maintain the P&Ls and their departments and assign Managers to them so that data scope and budgets follow the group's organization. | Organization | US19 | M | 3 |
| US21 | As an Admin, I want to change the role of a user so that their access matches their job. | Role control | US19 | M | 2 |
| US22 | As an Admin, I want to adjust which features each role may read or write so that permissions fit the company. | Permission control | US21 | M | 5 |
| **Connector Management** | | | | | |
| US25 | As a Staff member, I want to see the plans each connector finds at the provider, link them to our licenses, and choose the primary source per kind of data so that connector figures land on the right license. | Correct attribution | US03 | M | 3 |
| US26 | As a Staff member, I want to see every sync run, its coverage, and its rejected records, rerun a failed day, pause a connector, and upload standard files so that missing data is visible and fixed instead of read as zero. | Data completeness | US25 | M | 5 |
| **Self-service** | | | | | |
| US23 | As an employee, I want to see the licenses assigned to me and whether I am recorded as using them so that I can tell my manager when I no longer need one. | Self-service | US24 | M | 2 |
| US24 | As any user, I want to log in and out and land on the screen of my role so that only I see my data. | Protected access | Seeded accounts | M | 3 |

**Total:** 26 stories, 107 points. Must-have: 23 stories (94 points); forecast, cost optimization, and the optimization dashboard are Should-have. US25 and US26 are numbered after US24 so existing references keep their numbers; they follow the mind-map branch Connector Management. Setting up a connector is part of US03, when Staff add the license.

## Per-story INVEST review

`PASS` means the design provides enough information for planning and acceptance. It does not claim that implementation or tests exist.

| Story | I | N | V | E | S | T | Notes |
|---|---|---|---|---|---|---|---|
| US01 | PASS | PASS | PASS | PASS | PASS | PASS | Duplicate rule and inactive rule are explicit. |
| US02 | PASS | PASS | PASS | PASS | PASS | PASS | Simple master data; publisher or reseller; inactive rule explicit. |
| US03 | PASS | PASS | PASS | PASS | PASS | PASS | Largest story (13). Archetype per line (BR-02); connector values protected and one primary source per data type (BR-14); price per N units; quotas with dates; manual data current for 35 days; connector set up with read-only, write-only credentials (BR-01, BR-20), testable with the simulated ECS provider. Splits into: entitlement form, entitlement CSV, holders and usage form, usage CSV per archetype, connector step. |
| US04 | PASS | PASS | PASS | PASS | PASS | PASS | "Renewal soon", "Notice period passed", and "Notice period unknown" are testable with a fixed date. |
| US05 | PASS | PASS | PASS | PASS | PASS | PASS | One plan per unit and year; `Draft`/`Active` (BR-08). |
| US06 | PASS | PASS | PASS | PASS | PASS | PASS | Split rule BR-06; total ties to the financial dashboard. |
| US07 | PASS | PASS | PASS | PASS | PASS | PASS | Closed-month rule BR-10. Splits into: form with invoice, CSV import. |
| US08 | PASS | PASS | PASS | PASS | PASS | PASS | Gap types and `Unknown` rule explicit (BR-04, BR-09). |
| US09 | PASS | PASS | PASS | PASS | PASS | PASS | Method fixed (BR-11); low-confidence case defined. Should-have. |
| US10 | PASS | PASS | PASS | PASS | PASS | PASS | Unknown assignment excluded. |
| US11 | PASS | PASS | PASS | PASS | PASS | PASS | `Not monitored` excluded (BR-04); leavers flagged without the 60-day wait (BR-12). |
| US12 | PASS | PASS | PASS | PASS | PASS | PASS | Overuse per archetype (BR-07). |
| US13 | PASS | PASS | PASS | PASS | PASS | PASS | Action date from contract terms. Should-have. |
| US14 | PASS | PASS | PASS | PASS | PASS | PASS | Status flow and reason rule (BR-13). |
| US15 | PASS | PASS | PASS | PASS | PASS | PASS | Counts tie to US01, US03. |
| US16 | PASS | PASS | PASS | PASS | PASS | PASS | Totals tie to US06, US08. |
| US17 | PASS | PASS | PASS | PASS | PASS | PASS | `Not evaluated` never shown as `Compliant`. |
| US18 | PASS | PASS | PASS | PASS | PASS | PASS | Figures tie to US10, US11, US14. Should-have. |
| US19 | PASS | PASS | PASS | PASS | PASS | PASS | Last Admin protected (BR-17); one-time password link; HR CSV import. Splits into: accounts, password link, directory import. |
| US20 | PASS | PASS | PASS | PASS | PASS | PASS | Cycle and inactive rules explicit. |
| US21 | PASS | PASS | PASS | PASS | PASS | PASS | One role per account. |
| US22 | PASS | PASS | PASS | PASS | PASS | PASS | Guard rails: Admin permissions and Employee cost access cannot be changed. |
| US23 | PASS | PASS | PASS | PASS | PASS | PASS | Own data only; no price or cost. |
| US24 | PASS | PASS | PASS | PASS | PASS | PASS | Lockout and cookie rules BR-18. |
| US25 | PASS | PASS | PASS | PASS | PASS | PASS | Reuses `plan_data_sources`; one primary source per kind of data (BR-14); a plan linked in US03 shows here as linked. |
| US26 | PASS | PASS | PASS | PASS | PASS | PASS | Failed run stays `Unknown` (BR-04, BR-19); file upload all-or-nothing against its manifest; checks fixed in the [connector standard](06-connector-standard.md#47-validation); Admin sees status only. |

## Acceptance criteria

Format: **Given** context, **When** action, **Then** observable result.

### License Management

#### AC-US01 Software catalog

1. Given a Staff member, when a product with name, vendor, and category is saved, then it appears in the catalog and the change is recorded.
2. Given a product with the same name and vendor exists, when another is created, then a warning is shown and the existing product opens.
3. Given a product with an active entitlement, when it is marked inactive, then it is refused.
4. Given a Manager or Employee calls the edit API, then it returns `403`.

#### AC-US02 Vendors

1. Given a new publisher, when saved, then it can be chosen for products and contracts; given a new reseller, then it can be chosen for contracts only.
2. Given a vendor with an active contract, when it is marked inactive, then it is refused.
3. Given licenses of a vendor collected by API and by manual entry, then the vendor's collection method shows both.

#### AC-US03 License entitlements

1. Given a product, when a line with archetype Allocation, 20 seats, and a yearly price is saved, then Purchased shows 20 for that line.
2. Given a negative quantity, an end date before the start, or no currency, then field errors are returned.
3. Given a quantity that comes from a connector, when Staff edits it, then a reason is required and the original value is kept beside the edit.
4. Given a CSV with one invalid row, when imported, then no line is created and the error row is listed.
5. Given a line without a connector, when Staff adds 3 holders by email with their last activity dates, then Assigned shows 3 and each holder's status follows BR-03 with source `manual`.
6. Given a line whose assignments come from a connector, when Staff tries to add a holder by hand, then it is refused.
7. Given a usage CSV for a Metered line, then the preview shows rows to add, update, and reject before anything is written; importing the same period again creates no duplicate.
8. Given a price of 2.50 USD per 1,000,000 tokens, when saved, then the line keeps 2.50 per 1,000,000 and 40 million tokens cost 100 USD, never 0.
9. Given a line without a connector and 10 holders, when Staff enter activity for 3 of them, then the other 7 are `Not monitored`, not `No activity`.
10. Given manually entered holders last confirmed 40 days ago, then their seats are `Not evaluated` by detection until Staff confirm the data again.
11. Given 500 seats split 300 Sales and 200 IT, when 50 seats move to IT from 1 July, then Purchased of Sales is 300 in June and 250 in July; given quotas that would add up to more than 500 on a day, then the change is refused.
12. Given Staff add a line for Microsoft 365 E3 and set up a new connector with read-only credentials, when the connection test passes, then the plans seen at the provider are listed; choosing `ENTERPRISEPACK` with the connector as primary source for assignments makes the next run show E3's assigned seats with source `api`.
13. Given a connector test that fails, then the error code and the provider's message are shown, the connector is not saved, and the line can still be saved with manual entry.
14. Given credentials that grant write scope, when the connector is saved, then it is refused; given a saved connector, when its detail or the API response is read, then the credentials are never returned, and the audit log records the change without the secret.
15. Given a connector already set up for Microsoft, when Staff add a second Microsoft license, then they choose that connector without entering credentials again.

#### AC-US04 Contracts

1. Given a contract renewing in 20 days, then it is marked "Renewal soon"; given its notice deadline has passed, then it is marked "Notice period passed".
2. Given an entitlement line already covered by another active contract, when added to a new contract, then it is refused.
3. Given a renewal date before the start date, then an error is returned.
4. Given an auto-renewing contract with no notice period, then it is marked "Notice period unknown" and its notice deadline is `Unknown`, never the renewal date.
5. Given a contract signed with a reseller, when lines of two publishers are added, then it is accepted.

### Budget Management

#### AC-US05 Budget plan

1. Given a unit without a 2027 plan, when a plan with budget 600 is saved, then it is `Draft`; when activated, then it is `Active` and counted in monitoring.
2. Given a plan already exists for that unit and year, when creating another, then the existing plan opens.
3. Given a license priced 10 per seat per year, when 40 people are planned, then 400 is suggested as planned cost.
4. Given an `Active` plan, when its budget changes, then a reason is required and the old value is kept; deleting it is refused.

#### AC-US06 Cost allocation

1. Given a license of 12 seats costing 120 per year with 3 seats held in Sales and 9 unassigned, then Sales gets 30 and `Unallocated` gets 90.
2. Given any period, then all departments plus `Unallocated` and `Unknown department` add up to the total cost.

#### AC-US07 Expenses

1. Given a Staff member, when an expense with amount, currency, license, unit, and a PDF invoice under 10 MB is saved, then it appears with source `manual`.
2. Given an amount ≤ 0 or a file over 10 MB, then field errors are returned.
3. Given the month is closed, when an expense of that month is edited, then it is refused and a correcting entry is offered.
4. Given a Manager or Employee calls the expense API, then it returns `403`.

#### AC-US08 Budget monitoring

1. Given utilization 84%, then the unit is coloured as a warning; given 100% or more, then as over budget.
2. Given Planned 40, Purchased 40, Assigned 35, Used 22, then the line is flagged `Unassigned` and `Unused`, not `Over plan`.
3. Given Used is `Unknown`, then the line is not flagged `Unused`.
4. Given a Manager of unit A requests unit B, then the API returns `403`.

#### AC-US09 Forecast

1. Given 6 closed months, then the forecast for the remaining months uses the run rate of the last 3 closed months plus known renewals, and the method is shown.
2. Given only 2 closed months, then the forecast uses plan lines only and is labelled "low confidence".
3. Given any month, then actual and forecast amounts are never added into one figure.

### Optimization

#### AC-US10 Unused licenses

1. Given a license with 20 purchased and 15 assigned seats, then it is listed with 5 unassigned seats and their monthly cost.
2. Given Assigned is `Unknown`, then the license is not listed and is counted as "Not evaluated".

#### AC-US11 Inactive usage

1. Given a seat last active 75 days ago, then it is listed as `Inactive`; given a seat with a usage source and no activity ever, then as `No activity`.
2. Given a license without a usage source, then its seats are not listed and are counted as `Not monitored`.
3. Given an employee whose last working day was yesterday and who still holds a seat, then the seat is listed as `Leaver` today and is not also counted as `Inactive`.

#### AC-US12 Overuse

1. Given 25 seats assigned on an entitlement of 20, then the license is listed with an excess of 5.
2. Given a Concurrent license with a peak of 12 sessions on 10 slots, then it is listed with an excess of 2.
3. Given missing data, then the license is `Not evaluated`, not `Compliant`.

#### AC-US13 Cost optimization

1. Given 5 unassigned seats on a monthly plan, then the opportunity "reduce 5 seats" shows its yearly saving and can be acted on now.
2. Given a yearly contract renewing on 1 March with a 30-day notice period, then the action date is 30 January; given that date has passed, then the opportunity moves to the next renewal.
3. Given a yearly contract whose notice period is not known, then the action date is `Unknown`, not "now".

#### AC-US14 Recommendations

1. Given an opportunity, when it is turned into a recommendation, then its status is `Proposed` with the evidence attached.
2. Given a rejection without a reason, then it is refused; with a reason, then the status is `Rejected`.
3. Given a `Proposed` recommendation, when marked done, then it is refused; given `Accepted`, then it can be marked `Done` with the actual saving.
4. Given any status change, then nothing is sent to the provider.

### Analytics

#### AC-US15 License dashboard

1. Given seeded data, then Total licenses equals the number of active catalog licenses with an active entitlement, and the top applications show `Active`, `Inactive`, `No activity` per holder count.
2. Given no data, then "No data yet" is shown instead of zeros.

#### AC-US16 Financial dashboard

1. Given a year, then spend by department equals the cost allocation total (US06) and budget vs actual matches monitoring (US08).
2. Given two currencies without an exchange rate, then amounts are shown per currency.

#### AC-US17 Compliance dashboard

1. Given overuse results, then the same licenses as US12 are listed as `Over-allocated`.
2. Given contracts marked "Renewal soon", "Notice period passed", or "Notice period unknown", then they are listed.

#### AC-US18 Optimization dashboard

1. Given detection results, then underutilized accounts equal the count in US11 and unassigned seats equal the total in US10.
2. Given recommendations, then accepted and done savings equal the sums in US14.

### User & Organization

#### AC-US19 Users

1. Given an Admin creates a user with an existing email, then the existing account opens.
2. Given a user is disabled, then their open sessions end at once and the account stays listed.
3. Given the Admin disables themselves or the last active Admin, then it is refused.
4. Given a non-Admin calls the user API, then it returns `403`.
5. Given Admin creates an account, then a one-time link to set the password is shown once; the user cannot log in until they open it and set a password; a link past its validity is refused.
6. Given an HR CSV with 200 employees, when imported, then employees without an account are created with their department, and their provider identities match them by email.
7. Given an employee whose last working day has passed, then their account is disabled and re-enabling it is refused.

#### AC-US20 Departments

1. Given a department without a P&L, or a P&L placed under a department, then it is refused.
2. Given a Manager is assigned to P&L A, then after login they see only the data of P&L A and its departments.
3. Given a unit with an active budget plan, when it is marked inactive, then it is refused.

#### AC-US21 Roles

1. Given a user changed from Employee to Staff, then the new permissions apply from their next request.
2. Given the last active Admin, when their role is changed, then it is refused.

#### AC-US22 Permissions

1. Given the Admin removes "edit contracts" from Staff with a reason, then Staff can still view contracts but editing returns `403`, and the change is recorded.
2. Given an attempt to give Employee access to price or cost, then it is refused.
3. Given an attempt to remove the permission Admin needs to manage permissions, then it is refused.

### Connector Management

#### AC-US25 Data mapping

1. Given the Microsoft connector finds `ENTERPRISEPACK`, `SPE_E5`, and `VISIOCLIENT`, and only `ENTERPRISEPACK` was linked when Microsoft 365 E3 was added (US03), then E3 shows as linked and the other two are listed as waiting for a license, their records counted on no screen.
2. Given Staff link `SPE_E5` to the license "Microsoft 365 E5" with the connector as primary source for assignments, when the next run finishes, then E5 shows its assigned seats with source `api`, and Staff can no longer add E5 holders by hand.
3. Given a plan whose assignments come from a CSV import, when Staff make the connector the primary source, then a reason is required and the import stops counting from that date.
4. Given a connector that reports usage only as a total, then the plan's seats are `Not monitored`, never `Inactive`.
5. Given a provider plan linked to the wrong license, when Staff link it again, then the raw data still within the retention period is reprocessed for the right license.

#### AC-US26 Sync monitoring

1. Given a nightly run that fails with invalid credentials, then nothing is written, the run shows `failed` with the reason, and the next day's detection shows the connector's plans as `Not evaluated`, not as unused.
2. Given a run where one plan fails and the others succeed, then the run is `partial` and only that plan's day is `Unknown`.
3. Given a Staff member uploads an ECS file whose `record_count` differs from its manifest, then the whole file is refused.
4. Given the same day is rerun, then the data is replaced without duplicates.
5. Given Staff pause a connector, then no run starts and its plans' days become `Unknown` once the data date passes, never 0.
6. Given an Admin opens a run, then statuses, counts, and error codes are shown; the rejected-record list and any change to a connector return `403`.

### Self-service

#### AC-US23 My licenses

1. Given an employee holding 3 licenses, then exactly those 3 rows are shown, without price or cost.
2. Given a request for another employee's licenses, then the API returns `404`.

#### AC-US24 Login / logout

1. Given valid credentials, then a session is created and the user lands on the screen of their role.
2. Given wrong credentials or a disabled account, then the same generic message is shown.
3. Given 5 failed attempts in a row, then login is locked for 15 minutes.
4. Given logout, then the session is destroyed and internal pages redirect to login.
5. Given an account whose password is not set yet, then login is refused; after the user sets a password through a valid link, login works.

## Cross-cutting acceptance constraints

- Only Admin, Manager, Staff, and Employee have accounts; every API requires login because per-user usage is sensitive.
- Admin manages access only: license, budget, cost, and optimization APIs return `403` for Admin.
- The API, not the client, enforces roles, permissions, and data scope (BR-16, BR-17).
- ELMS never writes to a provider (BR-01); every connector uses read-only access.
- Missing data is `Unknown`, never 0 (BR-04); every figure carries its source and confidence (BR-14).
- Figures tie across screens: cost allocation total = financial dashboard spend by department; detection counts = optimization dashboard; overuse list = compliance dashboard.
- Every change to master data, expenses, budgets, recommendations, and access is recorded (BR-15).
- Providers sit behind a connector interface with fakes, so every story is testable without real tenants.
- Every connector delivers data in the ELMS Connector Standard, checked on every run (BR-19); a simulated ECS provider is the fake used by the connector step of US03 and by US25, US26.

**Related:** [Research](01-research-top-down.md) · [Use cases](02-use-cases.md)
