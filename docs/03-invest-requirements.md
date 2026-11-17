# INVEST Requirements & Acceptance Criteria — ELMS

> Design status: TARGET (11 use cases, 46 stories, November 2026)

Each story is small enough to implement and test independently. Authentication, authorization, data scope, and error handling are acceptance constraints, not hidden features. Business rules `BR-xx` are defined in [Use cases](02-use-cases.md#business-rules). Each story implements one use case, named in the backlog, and stories are grouped by the branches of the [mind map](mindmap.png).

## INVEST checklist

| Principle | Application in this backlog |
|---|---|
| Independent | Each story produces a demonstrable outcome and lists only unavoidable prerequisites. Usage, waste, and dashboard stories run on seeded data labelled as mock (BR-12), so they do not wait for the P&L APIs. |
| Negotiable | Layout is left to the UI design and may change; the outcome, permissions, and business rules stay fixed. |
| Valuable | Every story names the benefit for one role: Employee, Staff, Manager, or Admin. |
| Estimable | Inputs, outputs, roles, data scope, and failure outcomes are explicit; each story has a story-point estimate. |
| Small | A use case is one large flow of one actor and is split into stories, often one per flow (the self-service stories US45 and US46 are not on the map); the largest, US18 (budget import with versions and idempotency), is 8 points, every other story is 5 or less. |
| Testable | Every story has observable Given/When/Then criteria with concrete figures, including rules that tie figures across use cases. |

## Product backlog

Priority uses MoSCoW (`M` must, `S` should, `C` could). Story points use the Fibonacci scale.

| ID | Use case | User story | Value | Dependencies | Priority | Points |
|---|---|---|---|---|---|---|
| **License Management** | | | | | | |
| US01 | UC01 | As a Manager, I want one list of every license of my units with its monthly cost, allocation, and days to expiry so that I see what we pay for and what expires soon. | Portfolio at a glance | US41, US44, US21, US20 | M | 5 |
| US02 | UC01 | As a Manager, I want to follow each license term over time so that I see which renewals come and overlap. | Renewal planning | US01 | M | 3 |
| US03 | UC01 | As a Manager, I want the details of a license — cost, term, unallocated or over-allocated seats — so that I can judge it at once. | Quick check | US01 | M | 2 |
| US04 | UC01 | As a Manager, I want the license terms from the PO lines and those renewing within 30 or 60 days so that no renewal surprises us. | Renewal control | US21 | C | 2 |
| US05 | UC01 | As a Manager, I want to see who holds a license, who uses it, and how many days so that I know whose seat to review. | People behind a license | US03 | M | 5 |
| US06 | UC02 | As a Manager or Staff member, I want every license a P&L reports, grouped by provider, so that I can check what its connectors deliver. | Inventory check | US41 | S | 3 |
| US07 | UC02 | As a Manager, I want the licenses of any unit, or the units of any license, so that I see where each license is used. | Two-way view | US39, US41 | S | 3 |
| US08 | UC02 | As a Manager, I want the providers the group buys from and their licenses so that I know our dependence on each provider. | Provider view | US41 | C | 2 |
| US09 | UC02 | As a Staff member, I want to keep the software catalog and map every license and application name to a software and category so that the same software is counted together in every company. | One vocabulary | US41 | M | 5 |
| US10 | UC02 | As a Staff member, I want to mark a license used by two or more companies as shared so that its cost is charged back to them and its free seats stay with the group. | Fair charge-back | US41, US32 | M | 5 |
| **Usage** | | | | | | |
| US11 | UC03 | As a Manager, I want to choose the unit to analyse in the organization and go down and up so that every figure follows that scope. | Navigation | US39 | M | 5 |
| US12 | UC03 | As a Manager, I want Plan, Purchased, and Used of my scope and whether it is over budget so that I see the balance at once. | Balance | US11, US18, US20 | M | 3 |
| US13 | UC03 | As a Manager, I want to compare the units below my scope year to date or for a month so that I see which unit drifts. | Comparison | US12 | M | 5 |
| US14 | UC03 | As a Manager, I want each unit month by month over the year so that I see when it drifts. | Trend per unit | US13 | S | 3 |
| US15 | UC03 | As a Manager, I want the figures of every unit below my scope and, per unit, the waste of each license by month so that I find the license behind the waste. | Root cause | US13 | M | 5 |
| US16 | UC03 | As a Manager, I want to export the units listed so that I can share the figures. | Reporting | US15 | S | 2 |
| US17 | UC03 | As a Manager, I want to see how often each employee uses each application, from BCA, so that I can compare use with the licenses held. | Usage evidence | US39, US09 | C | 3 |
| **Budget Management** | | | | | | |
| US18 | UC04 | As a Manager, I want to import the budget plan of my unit or any unit under it from Excel, safely and repeatably, so that the plan matches SAP. | Plan in ELMS | US39 | M | 8 |
| US19 | UC04 | As a Manager, I want the plan by month and its earlier versions so that I see what changed. | Plan review | US18 | M | 2 |
| US20 | UC04 | As a Staff member, I want the cost of each invoice spread over the months of its term and the month closed so that Purchased is right every month. | Monthly cost | US21, US22 | M | 5 |
| US21 | UC04 | As a Staff member, I want to import the PR, PO, and invoices exported from SAP each month, and enter a purchase made outside SAP, so that ELMS knows how many seats were bought, for which term, and what was paid. | Quantity and cost source | US41 | M | 5 |
| US22 | UC04 | As a Staff member, I want to enter the exchange rates from a date so that every amount is converted with the rate of its invoice date. | Correct currency | US46 | M | 2 |
| **Optimization** | | | | | | |
| US23 | UC03 | As a Manager, I want the seats bought but given to nobody and their cost so that I stop paying for them. | Waste found | US32 | M | 3 |
| US24 | UC03 | As a Manager, I want the seats not used for 30 days and their cost so that I know whose seat to reclaim. | Waste found | US05 | M | 3 |
| US25 | UC03 | As a Manager, I want the units that waste more than 20 % of what they buy flagged so that I see where to act first. | Prioritization | US32 | M | 2 |
| US26 | UC03 | As a Manager, I want the units ranked by money wasted so that I start with the largest. | Prioritization | US13 | M | 3 |
| US27 | UC03 | As a Manager, I want Plan, Used, and Wasted month by month on one scale so that I see whether waste grows. | Trend | US13, US18 | S | 3 |
| US28 | UC03 | As a Manager, I want the units placed by spend and waste rate so that I see where high spend meets high waste. | Risk view | US13 | S | 3 |
| US29 | UC03 | As a Manager, I want the waste of each unit in each month, as a rate or in money, so that I see when each unit wastes. | Seasonality | US13 | S | 3 |
| **Analytics** | | | | | | |
| US30 | UC06 | As a Manager, I want a license dashboard so that counts, allocation, and expiries are seen together. | Overview | US01, US09 | S | 3 |
| US31 | UC06 | As a Manager, I want a financial dashboard so that spending and plan are seen together. | Financial overview | US32, US33 | S | 3 |
| US32 | UC06 | As a Manager, I want the cost of each license split over the units that hold it on the financial dashboard so that each unit carries its own cost. | Cost per unit | US20, US39 | M | 5 |
| US33 | UC06 | As a Manager, I want the variance between plan and purchased month by month on the financial dashboard so that I see where spending leaves the plan. | Variance | US18, US20 | S | 3 |
| US34 | UC06 | As a Manager, I want an optimization dashboard so that waste, unused and inactive seats, and flagged units are seen together. | Waste overview | US23–US25 | S | 3 |
| US35 | UC06 | As a Manager, I want the same figures per license, software, category, provider, or license type so that I see which software wastes most. | License view | US09, US32 | S | 3 |
| US36 | UC06 | As a Manager, I want the definition of every figure where it appears so that I read the numbers the same way as everyone. | Shared meaning | — | S | 2 |
| **User & Organization** | | | | | | |
| US37 | UC07 | As an Admin, I want to give each user a role and a data scope — the units of a Manager, the companies of a Staff member — and disable or re-enable their access so that each person sees exactly what their job needs. | Access control | US46, US39 | M | 5 |
| US38 | UC07 | As an Admin, I want to adjust which features each role may read or write so that permissions fit the group. | Permission control | US37 | M | 3 |
| US39 | UC08 | As an Admin, I want to review the five-level organization from ILVG and assign Managers to units so that data scope follows the organization. | Organization | ILVG connector | M | 3 |
| **Connection Management** | | | | | | |
| US40 | UC09 | As a Staff member, I want every connector of my companies with its licenses and sync status so that I see which data is in trouble. | Data health | US41 | M | 3 |
| US41 | UC09 | As a Staff member, I want to connect a company's provider API with its licenses and interval so that its data flows into ELMS. | Data in | US46 | M | 5 |
| US42 | UC09 | As a Staff member, I want to edit or delete a connector so that it follows changes at the P&L. | Data upkeep | US41 | M | 3 |
| US43 | UC09 | As a Staff member, I want the details of a connector so that I can check its settings without editing it. | Quick check | US41 | C | 2 |
| US44 | UC09 | As a Staff member, I want every sync run, its rejected records, reruns, and pause so that missing data is fixed instead of read as zero. | Data completeness | US41 | M | 5 |
| **Self-service** | | | | | | |
| US45 | UC10 | As an employee, I want the licenses I hold across all my emails and whether I am recorded as using them so that I can give back what I do not need. | Self-service | US41, US46 | M | 2 |
| US46 | UC11 | As any user, I want to log in and out and start where my role works so that only I see my data. | Protected access | Accounts from ILVG | M | 3 |

**Total:** 46 stories, 159 points. Must-have: 29 stories (113 points); Should-have: 13 stories (37 points); Could-have: 4 stories (9 points). A use case is one large flow of action of one actor; its flows are split into stories, so one use case has several stories.

## Per-story INVEST review

`PASS` means the design provides enough information for planning and acceptance. It does not claim that implementation or tests exist.

| Story | I | N | V | E | S | T | Notes |
|---|---|---|---|---|---|---|---|
| US01 | PASS | PASS | PASS | PASS | PASS | PASS | Monthly cost = accrued cost of the current month (UC04); expiry buckets BR-30; allocation BR-31. |
| US02 | PASS | PASS | PASS | PASS | PASS | PASS | Testable with a fixed "today". |
| US03 | PASS | PASS | PASS | PASS | PASS | PASS | Unknown start date rule BR-30. |
| US04 | PASS | PASS | PASS | PASS | PASS | PASS | Read-only; terms from the PO lines (BR-10); "—" when SAP does not give a field. Could-have. |
| US05 | PASS | PASS | PASS | PASS | PASS | PASS | Status BR-03 with grace period; days used BR-32; shared accounts BR-26. |
| US06 | PASS | PASS | PASS | PASS | PASS | PASS | "No data yet" instead of an empty list (BR-04). |
| US07 | PASS | PASS | PASS | PASS | PASS | PASS | Unknown unit keeps totals (BR-19). |
| US08 | PASS | PASS | PASS | PASS | PASS | PASS | No quantity added across licenses (BR-05). Could-have. |
| US09 | PASS | PASS | PASS | PASS | PASS | PASS | Mapping applies to every company of the provider (BR-35); merge instead of delete. |
| US10 | PASS | PASS | PASS | PASS | PASS | PASS | Charge-back and free seats BR-24; Staff confirm a proposal. |
| US11 | PASS | PASS | PASS | PASS | PASS | PASS | Scope from the server (BR-14); shareable link. |
| US12 | PASS | PASS | PASS | PASS | PASS | PASS | Figures BR-09, BR-22; planned-above rule BR-34. |
| US13 | PASS | PASS | PASS | PASS | PASS | PASS | Complete months only (BR-28); currency BR-05. |
| US14 | PASS | PASS | PASS | PASS | PASS | PASS | Efficiency = Used ÷ Purchased. |
| US15 | PASS | PASS | PASS | PASS | PASS | PASS | Waste per license as a rate or in money; rows add up (BR-19). |
| US16 | PASS | PASS | PASS | PASS | PASS | PASS | File equals the units listed. |
| US17 | PASS | PASS | PASS | PASS | PASS | PASS | BCA fields assumed (UC03). Could-have. |
| US18 | PASS | PASS | PASS | PASS | PASS | PASS | Largest story (8): per-license replacement in the target subtree BR-08, idempotency BR-33. Splits into: template and preview, confirm with versions, idempotency and concurrency. |
| US19 | PASS | PASS | PASS | PASS | PASS | PASS | Read-only; versions from US18. |
| US20 | PASS | PASS | PASS | PASS | PASS | PASS | Rounding to the thousand VND BR-23; closed months frozen. |
| US21 | PASS | PASS | PASS | PASS | PASS | PASS | Shape of the SAP file and closed-month rule in BR-10. Splits into: SAP import, hand entry. |
| US22 | PASS | PASS | PASS | PASS | PASS | PASS | Rate of the invoice date (BR-05). |
| US23 | PASS | PASS | PASS | PASS | PASS | PASS | Unassigned seats belong to the owner unit (BR-06). |
| US24 | PASS | PASS | PASS | PASS | PASS | PASS | 30 days and grace period (BR-03); `Not monitored` excluded (BR-04). |
| US25 | PASS | PASS | PASS | PASS | PASS | PASS | Threshold 20 % (BR-20). |
| US26 | PASS | PASS | PASS | PASS | PASS | PASS | Same search and period as US13. |
| US27 | PASS | PASS | PASS | PASS | PASS | PASS | Follows the search of UC03. |
| US28 | PASS | PASS | PASS | PASS | PASS | PASS | Medians computed on the units listed. |
| US29 | PASS | PASS | PASS | PASS | PASS | PASS | One choice of rate or money for units and licenses. |
| US30 | PASS | PASS | PASS | PASS | PASS | PASS | Counts tie to US01. |
| US31 | PASS | PASS | PASS | PASS | PASS | PASS | Totals tie to US32, US33. |
| US32 | PASS | PASS | PASS | PASS | PASS | PASS | Split BR-06 with projects and Unallocated; sums equal the total. |
| US33 | PASS | PASS | PASS | PASS | PASS | PASS | Variance per BR-34. |
| US34 | PASS | PASS | PASS | PASS | PASS | PASS | Figures tie to US23–US25. |
| US35 | PASS | PASS | PASS | PASS | PASS | PASS | Dimensions fixed (BR-35). |
| US36 | PASS | PASS | PASS | PASS | PASS | PASS | One definition per metric (BR-27). |
| US37 | PASS | PASS | PASS | PASS | PASS | PASS | Accounts come from ILVG (BR-15); last Admin protected (BR-15); Manager units and Staff companies (BR-14). |
| US38 | PASS | PASS | PASS | PASS | PASS | PASS | Guard rails: Admin permissions and Employee access to others cannot be changed. |
| US39 | PASS | PASS | PASS | PASS | PASS | PASS | Five fixed levels (BR-19); corrections kept beside ILVG values. |
| US40 | PASS | PASS | PASS | PASS | PASS | PASS | Statuses BR-29; Paused is not a sync issue. |
| US41 | PASS | PASS | PASS | PASS | PASS | PASS | Test before save, write-only credential (BR-18). |
| US42 | PASS | PASS | PASS | PASS | PASS | PASS | Reconfiguration resets to Pending (BR-29); delete keeps data. |
| US43 | PASS | PASS | PASS | PASS | PASS | PASS | Never shows the credential. Could-have. |
| US44 | PASS | PASS | PASS | PASS | PASS | PASS | Failed or paused run stays `Unknown` (BR-04, BR-17); reruns idempotent (BR-33). |
| US45 | PASS | PASS | PASS | PASS | PASS | PASS | Own data only, across all emails (BR-25); no cost. |
| US46 | PASS | PASS | PASS | PASS | PASS | PASS | Lockout and cookie rules BR-16. |

## Acceptance criteria

Format: **Given** context, **When** action, **Then** observable result.

### License Management

#### AC-US01 License List

1. Given 24 licenses held in the Manager's units, when the list is requested, then it returns 24 licenses with the data date, sorted by expiry date soonest first.
2. Given Microsoft 365 E3 with 420 seats allocated by the connector, a PO line of 500 seats in force, and 4,125 USD accrued for the current month, then it shows a monthly cost of 4,125 USD and 420 allocated of 500 purchased, 84 %.
3. Given 520 of 500 allocated, then the license is flagged as exceeding the purchased quantity.
4. Given the expiry filter 0–30 days and the search "adobe", then only matching licenses are listed, with the number of matches out of the total, and the filters can be cleared.
5. Given a Manager of block A1, then only licenses held in A1 are listed, Allocated counts A1's seats, and Purchased is the P&L's; a license outside their scope requested through the API returns `403`.

#### AC-US02 License Validity over Time

1. Given today is 15 Nov 2026, then the period shown contains November 2026 and marks today.
2. Given a license that expires in 5 days, then its term is in the "≤ 30 days" bucket and its last 7 days are marked.
3. Given the period moved two months forward, then the terms of that period are shown; returning to today brings back the current period.
4. Given a term that ended before the period, then it is marked "Ended before this period".

#### AC-US03 License Details

1. Given a license selected, then its details show company, monthly cost, start, expiry, expiry status, and the unallocated quantity.
2. Given 520 allocated of 500, then the details show over-allocated 20 instead of an unallocated quantity.
3. Given a term without a start date that expires on 31 Dec 2026, then the start shows 1 Jan 2026 (BR-30).

#### AC-US04 View Contracts

1. Given PO lines with their start, expiry, quantity, and cost imported from SAP, then each is listed as a term with its PO number and the filter "renewal within 30 days" keeps those renewing by then.
2. Given a purchase entered by hand, then it has no PO number; auto-renew and notice period, which SAP does not give, are shown as missing, never guessed.
3. Given any role calls a write API on terms, then it returns `403`: terms are read-only.

#### AC-US05 License Users and Usage

1. Given 500 allocated seats — 400 Active, 60 Inactive or No activity, 40 Not monitored — then these counts are shown and each count filters the holders.
2. Given a holder with activity on 6 of 22 working days in the last 30 days, then the holder shows 6 days used of 22 working days.
3. Given a license whose source gives only the last activity date, then days used shows "Not tracked".
4. Given a seat assigned 20 days ago and never used, then it is `Active` (grace period); given 40 days and never used, then `No activity`.
5. Given a shared mailbox holding a seat, then it is listed apart with shared and service accounts, never as an inactive person.
6. Given a Manager of block A1, then holders outside A1 are counted as "Outside your scope: n" and not listed.

#### AC-US06 View License Inventory by P&L

1. Given a P&L with licenses from 3 providers, then the licenses are grouped by provider with Purchased, Assigned, Used, cost, status, and data date.
2. Given a P&L whose connectors never had a successful run, then the inventory says "No data yet", not an empty list.
3. Given a Staff member of company A, when they choose company B, then it returns `403`.

#### AC-US07 View Licenses by Organization

1. Given department D selected, then its licenses are listed with Purchased share, Assigned, Used, and cost.
2. Given GitHub chosen, then the P&Ls, blocks, departments, and projects using it are listed with their share.
3. Given a holder who cannot be placed in a unit, then the seat is counted under *Unknown unit* and the totals still add up.

#### AC-US08 View Providers and Licenses

1. Given Microsoft with Microsoft 365 E3 (seats) and Azure OpenAI (tokens), then the provider shows 2 licenses and the monthly cost, and no added quantity.
2. Given a provider opened, then its licenses show Purchased and Allocated per license and the companies using each.
3. Given a provider without licenses in the period, then it is not listed.

#### AC-US09 Manage Software Catalog

1. Given group-level Staff create "Microsoft 365" in *Productivity › Office & Collaboration*, then it can be chosen when mapping a name.
2. Given "M365 E3" from company A and "Microsoft 365 E3" from company B mapped to Microsoft 365, then the License Dashboard counts both under one software and one category.
3. Given a new license name arrives from a sync, then it is "Not mapped" and grouped under *Uncategorized* until mapped.
4. Given a software with mapped licenses, when it is deleted, then it is refused; merging it into another moves its mappings and is recorded with old and new value.
5. Given the BCA application "Microsoft Word" mapped to Microsoft 365, then employee usage (UC03) matches its users with the Microsoft 365 holders.
6. Given a Staff member of company A, when they map a name only company B reports, then it returns `403`.

#### AC-US10 Manage Shared Licenses

1. Given GitHub reported by company A's connector with holders in P&L A and P&L B, then it is listed as *Possibly shared* and nothing changes until Staff confirm.
2. Given Staff confirm, then the owner becomes the group; with 1,000 seats at 100,000 VND, A holding 500 and B 300, A is charged 50 million, B 30 million, and 20 million of the 200 free seats stays in *Unallocated* of the group.
3. Given the same license reported by two connectors, then it is listed "Also reported by <company>"; after Staff pick one source, it is counted once.
4. Given Staff unmark a shared license, then its owner goes back to the P&L of its connector.
5. Given a Manager of P&L A, then they see A's share only.
6. Given GitHub of P&L A marked shared in June with January–May closed, then January–May stay with A and June onward goes to the group; A's invoices still name A as the company that paid.

### Usage

#### AC-US11 Navigate Organization Scope

1. Given a Manager of the group, when the usage analysis opens, then the scope is the group and the units below are its P&Ls.
2. Given a Manager of P&L A and P&L B only, then the start lists A and B; requesting the group returns `403`.
3. Given block A1 chosen, then every figure is recomputed for A1, the path reads Group › A › A1, and a shared link opens the same scope.
4. Given the search "vin", then the matching units are found with the path to each.
5. Given a P&L with unassigned seats, then *Unallocated* appears among its units.

#### AC-US12 View Plan vs Utilization Balance

1. Given year to date Plan 1,000, Purchased 1,100, and Used 800 million, then these amounts are shown, the scope is over budget by 100 million, and 73 % of Purchased is used.
2. Given a scope without a plan, then Plan is "Not planned" and no over or under budget is stated.
3. Given a month whose Purchased is Unknown, then the figure shows `Unknown`, never 0.
4. Given P&L A charged 50 million for a license planned only at the group, then that cost shows "Planned at Tập đoàn" and is left out of A's budget comparison (BR-34).

#### AC-US13 Compare Subordinate Units

1. Given today is 15 Nov 2026, then YTD covers January to October and November is not offered.
2. Given 31 P&Ls, then they are compared sorted by waste, high to low.
3. Given a unit and period, then its figure card shows Plan, Purchased with its % of plan, and Used and Wasted with their % of purchased.
4. Given the currency switched to VND, then USD amounts are converted with the rate of their invoice date and the rate is shown.
5. Given the search "vin", then 5 of 31 units are shown, and the same search applies to the units below and the waste analysis.

#### AC-US14 View Annual Trend by Unit

1. Given 2026 selected in November 2026, then each unit shows January to October; given 2025, then 12 months.
2. Given a unit with Used 600 and Purchased 1,000 for the year, then its utilization for the year is 60 %.
3. Given a unit selected, then it becomes the scope.

#### AC-US15 View Units Below the Scope

1. Given the group scope, then each unit shows rank, Plan, Purchased, Used, Wasted, utilization, and variance, stated as over or under plan.
2. Given a project scope, then the units below are its licenses.
3. Given P&L A opened, then the waste of each of its licenses by month is shown; choosing money instead of rate changes it and the waste per unit (US29) together.
4. Given a shared license, then A shows A's share marked shared, and the license rows add up to A.

#### AC-US16 Export Usage Report

1. Given the group scope, year 2026, mode YTD, then the file names the scope, the year, and the period, opens in Excel with Vietnamese text intact, and holds every unit listed after search and order.
2. Given the file opened, then its figures equal the units listed.
3. Given the licenses of a unit opened, then their rows are written under their unit.

#### AC-US17 Track Employee Usage

1. Given BCA reports An using Microsoft Word on 18 days of the period, then An is listed with the unit, the application, 18 days used, and the last use.
2. Given an employee whose machine does not report to BCA, then they show "Not tracked", never "not used".
3. Given an application in use that maps to a software with no license reported for the P&L, then it is listed as "No license reported".
4. Given a Manager of block A1, then only A1 employees are listed; Staff and Admin calling the API get `403`.

### Budget Management

#### AC-US18 Import Budget Plan from Excel

1. Given the Manager of P&L A targets A for 2027, when the file is uploaded, then the preview lists, per unit, rows to add, replace, remove, and reject; confirming creates version 1 and, for each license in the file, replaces its 2027 lines in A and every unit under it; licenses not in the file keep their lines.
2. Given the same file uploaded again for the same target and months, then the result is "No changes" and no version is created.
3. Given the confirm sent twice, or again after a time-out, then exactly one version exists.
4. Given the Manager of block A1 previewed a file with M365 E3 and the Manager of P&L A confirmed since an import that changed M365 E3 lines of A1, when A1's confirm is sent, then it is refused: "The plan changed since your preview"; the same holds the other way round, when A1 imported while A's file was in preview. Given A's import touched only Jira, then A1's confirm goes through.
5. Given a row for a unit outside the target, or a project code not in the hierarchy, then the row is rejected with its reason and the file is not imported until it is fixed or the row is left out.
6. Given GitHub marked shared and the Manager of the group plans it with rows P&L A 50 million and P&L B 40 million, then each row plans that P&L's share, each P&L's Plan includes its row, and the other licenses of A and B keep their plan; the Manager of P&L A can later change A's row.
7. Given P&L B has its own "Microsoft 365 E3" and a share of the group's shared "Microsoft 365 E3", then a row "Microsoft 365 E3" for B is rejected as matching two licenses; given Staff record "Microsoft 365 E3 B" as the SAP name of B's own license, then "Microsoft 365 E3" maps to the shared license and "Microsoft 365 E3 B" to B's own, and both can be planned for the same unit and month.

#### AC-US19 View Monthly Budget Plan

1. Given 2027 and P&L A, then the plan shows per license the planned quantity and amount of each month and the year total, groupable by P&L, block, or project.
2. Given a second import, then the changed lines are marked with that import and its author, and version 1 can be compared.
3. Given a unit without a plan, then it shows "Not planned", never 0.

#### AC-US20 Accrue License Cost

1. Given an invoice of 100,000,000 VND for 12 months, then the accrual is 8,333,000 for 11 months and 8,337,000 for the last.
2. Given a term starting on 16 January, then January is accrued by its days.
3. Given Staff close October for company A, then A's October figures lose the *Provisional* mark and are never recalculated; a later change goes to the next open month. Given A is charged for a shared license and the group's October is still open, then A's October stays *Provisional* until the group closes it.
4. Given a Manager calls the accrual API to close a month, then it returns `403`: only Staff run and close the accrual.

#### AC-US21 Manage Purchases

1. Given a SAP file of company A with PO 4500012345 item 10, GitHub Enterprise, 500 seats, 1 Mar 2027 – 29 Feb 2028, and invoice 0001234 of 1.2 billion VND for that item, when confirmed, then GitHub of A has 500 purchased seats and expires on 29 Feb 2028, and its accrual schedule has 12 months of 100 million.
2. Given the same file imported again, then nothing is added; given the PO quantity changed to 600 in the next file, then the PO line is updated, not duplicated.
3. Given a PO line whose license matches no license of A and no shared license, or an invoice whose PO line is unknown, then the row is rejected with its reason and the file is not imported until it is fixed or the row is left out.
4. Given a PO line without any invoice yet, then its 500 seats count in Purchased quantity and its months show Purchased in money `Unknown`.
5. Given a purchase made on a company card, when Staff enter it by hand with its term 1 Jan–31 Dec 2027, 120 million, and its invoice PDF, then its accrual schedule has 12 months of 10 million and its source is `manual`.
6. Given a hand entry in a closed month, when edited, then it is refused and a correcting entry dated in an open month is offered.

#### AC-US22 Manage Exchange Rates

1. Given USD at 25,400 from 1 Nov 2026 and 25,600 from 1 Dec 2026, then an invoice of 1,000 USD dated 15 Nov 2026 is 25,400,000 VND.
2. Given a rate of 0 or less, then it is refused.
3. Given a rate used by a closed month, when corrected, then closed months keep the old rate and open months use the new one.
4. Given an invoice in a currency without a rate for its date, then its VND figure is `Unknown` and the amount is shown in its own currency, never added.

### Optimization

#### AC-US23 Detect Unused Licenses

1. Given 500 seats purchased and 420 assigned at 36 USD a seat a month, then the list shows 80 unassigned seats costing 2,880 USD a month and 34,560 USD a year.
2. Given a license whose Assigned is Unknown, then it is excluded and counted as "Not evaluated".
3. Given a Manager of a block, then the list is empty and says that unassigned seats belong to the P&L.

#### AC-US24 Detect Inactive Usage

1. Given seats last used 45 days ago, then they are listed as `Inactive`; last used 10 days ago, then not listed; assigned 20 days ago and never used, then not listed (grace period); assigned 40 days ago and never used, then listed as `No activity`.
2. Given 25 inactive seats at 500,000 VND a month, then the total reads "25 inactive seats cost 150 million a year".
3. Given a license without usage source, then its seats are excluded and counted apart as `Not monitored`.
4. Given an inactive shared mailbox, then it is listed apart, never as an inactive person.

#### AC-US25 Flag Unit Waste

1. Given a unit with Purchased 100 million and Wasted 25 million, then it is flagged; with Wasted 15 million, then it is not.
2. Given a unit whose Purchased is Unknown, then it is `Not evaluated`, never flagged and never "no waste".
3. Given a flagged unit, then the same flag shows wherever the unit appears: the scope, the units below, the ranking, and the waste analysis.

#### AC-US26 Rank Units by Waste

1. Given 31 P&Ls, then the 10 wasting most come first, and all 31 on request.
2. Given a unit with Wasted 25 of Purchased 100, then its waste rate is 25 %.
3. Given the ranking asked for, then the scope becomes the Manager's highest unit, sorted by waste.

#### AC-US27 Track Plan, Usage and Waste Trend

1. Given 2026 in November, then Plan, Used, and Wasted are given for each month from January to October on one scale.
2. Given a search that keeps 5 of 31 units, then the trend sums those 5 and states "5 of 31 units".
3. Given a month without a plan, then that month has no Plan, not 0, and is marked "Not planned".

#### AC-US28 View Spend against Waste Rate

1. Given 31 units, then each is placed by Purchased and waste rate against the medians of both, and the units above both medians are highlighted.
2. Given a unit selected, then it becomes the scope.
3. Given two units with the same Purchased and waste rate, then the Wasted amount of each is shown.

#### AC-US29 View Waste per Unit and Month

1. Given 2026 in November, then the units are sorted by the year's waste, the first 12 first, and November and December are not shown.
2. Given money chosen instead of rate, then every month shows the wasted amount, and the waste per license of US15 follows.
3. Given the year set to 2025 here, then the year of the comparison (US13) does not change.

### Analytics

#### AC-US30 View License Dashboard

1. Given the Manager's units, then the license count equals the License List of US01.
2. Given licenses mapped in the catalog, then the counts by category follow the catalog, unmapped ones under *Uncategorized*.
3. Given an Admin calling the dashboard API, then it returns `403`.

#### AC-US31 View Financial Dashboard

1. Given 2026, then spending by month and by unit equals the cost allocation of US32, and plan against actual equals US33.

#### AC-US32 Allocate License Cost

1. Given a license of 100 seats costing 10 million a month, block A1 holding 60, block A2 30, and 10 seats free, then A1 carries 6 million, A2 3 million, and *Unallocated* of the P&L 1 million.
2. Given An on projects P1 and P2 holding one seat of 100,000 VND, then P1 and P2 carry 50,000 each.
3. Given any month, then the units, *Unallocated*, and *Unknown unit* add up to the license cost.
4. Given a license of 100 seats costing 31 million in March, and An moving from IT to Sales on 15 March, then IT carries An's seat for 14 days (140,000 VND) and Sales for 17 days (170,000 VND).
5. Given 100 seats bought and 110 assigned, then the cost spreads over the 110 seats and *Unallocated* is 0.
6. Given the sync of 31 March failed and 30 March is complete, then 31 March uses the seats of 30 March and the month shows 1 filled day; given a month with no complete day, then its whole cost is `Not evaluated` under the owner.

#### AC-US33 Track Monthly Plan Variance

1. Given 2026 in November, then each month from January to October shows Plan, Purchased, Used, and the variance, with the year-to-date total.
2. Given a month without a plan, then its variance is empty and marked "Not planned"; given a month not closed, then it is marked *Provisional*.
3. Given a month with a variance of +80 million, then the licenses that explain most of it are listed.

#### AC-US34 View Optimization Dashboard

1. Given the Manager's units, then waste, utilization, unassigned and inactive seats, and flagged P&Ls equal US23–US26.
2. Given no usage data, then it reads "Not evaluated yet", never zeros.

#### AC-US35 Analyze by License and Provider

1. Given the dimension *software*, then Microsoft 365 adds the E3 licenses of every company.
2. Given an item opened, then its figures split by company, block, department, and project.
3. Given two periods chosen, then both are compared and can be exported.
4. Given a license not mapped, then it is listed under *Uncategorized*.

#### AC-US36 View Metric Definitions

1. Given the catalog opened, then each metric shows its formula, unit, source, period, and what it excludes.
2. Given "Waste rate" wherever it appears, then its definition reads "Wasted ÷ Purchased".
3. Given a metric computed on mock data, then its definition says so.

### User & Organization

#### AC-US37 Manage User Roles and Scope

1. Given an ILVG employee, then they already have an account with the role Employee, and no account can be created by hand.
2. Given a Staff account given companies A and B, then that user sees the data of A and B only.
3. Given a user's role changed, then their sessions end and the next login uses the new role and scope.
4. Given a Manager without a managed unit, then a warning says they will see no data.
5. Given an account disabled, then its open sessions end at once; disabling or changing the role of the last active Admin is refused.
6. Given an employee who has left according to ILVG, then the account is disabled automatically and cannot be re-enabled.

#### AC-US38 Manage Permissions

1. Given a permission removed from Staff with a reason, then the change is recorded and Staff calling that API get `403`.
2. Given an attempt to remove the permission Admin needs to manage permissions, then it is refused.
3. Given an attempt to let Employee read another person's usage, then it is refused.

#### AC-US39 Manage Organization Hierarchy

1. Given the ILVG sync, then the hierarchy shows group > P&L > block > department > project with codes; a Manager assigned to the group sees the whole group.
2. Given a block placed under another block, then it is refused; given Admin corrects a unit ILVG placed wrongly with a reason, then the ILVG value is kept beside it and the next sync does not overwrite it.
3. Given a code in the budget file or a connector that matches no unit, then it is listed as "Unmatched".
4. Given a unit with members or a current plan, when Admin marks it inactive, then it is refused.
5. Given ILVG no longer reports a unit that still has members, then the sync marks it inactive and it is listed for Admin to move them.

### Connection Management

#### AC-US40 View Usage Connectors

1. Given 10 licenses `Active`, 2 `Delayed`, 1 `Failed`, and 3 `Paused`, then the number of sync issues is 3.
2. Given the search "contoso.com", then companies, connectors, and licenses whose contact email matches are found.
3. Given a Staff member of company A, then only A's connectors are listed.

#### AC-US41 Create Usage Connector

1. Given company A, provider Microsoft, contact, an HTTPS API URL, an API key, and the licenses "M365 E3" and "Visio", when created, then the connector is named "A – Microsoft Usage" and both licenses are `Pending`.
2. Given the connection test fails, then the error is shown and nothing is saved.
3. Given a URL that is not HTTPS, no license, or "m365 e3" added twice, then it is refused with the field concerned.
4. Given the interval typed as 12, then the connector runs every 12 hours; given 0, then it is refused.
5. Given the connector saved, then its credential is never returned by the API or written to logs.
6. Given an active connector already exists for A and Microsoft, when another is created, then it is refused.

#### AC-US42 Edit Usage Connector

1. Given the interval changed from 6 to 12, then every license keeps its status; given the API URL changed, then every license goes back to `Pending` and the last sync is cleared.
2. Given provider and authentication unchanged, then the credential may stay blank; given the authentication changed, then a new credential is required.
3. Given a delete confirmed, then the connector stops syncing, it and its licenses become inactive, past figures stay, and a new connector for A and Microsoft can be created.
4. Given "Visio" added to a connector that already syncs, then Visio is `Pending` until a run brings its data, while the other licenses keep their status.

#### AC-US43 View Connector Details

1. Given a connector opened, then its settings, interval, paused or running, and each license with its status are shown, never the credential.

#### AC-US44 Monitor Data Synchronization

1. Given a run with 1,000 records of which 12 failed the contract, then the run shows `Partial` and the 12 rejected records with the check that failed.
2. Given a failed day rerun, then its figures are replaced and never duplicated.
3. Given a connector paused at 09:00 with a 6-hour interval, then the runs of 12:00 and 18:00 are recorded as `Paused`, its licenses show `Paused`, and it is not a sync issue; resuming starts a run at once.
4. Given a failed run, then nothing is written and the figures of that day stay `Unknown`.
5. Given a 6-hour interval and a last success 9 hours ago, then the licenses show `Delayed`.
6. Given a `Partial` run in which "M365 E3" failed with `permission_denied` and "Visio" was complete, then M365 E3 shows `Failed` and Visio `Active`.

### Self-service

#### AC-US45 View My Licenses

1. Given An holds a seat on an@a.com and another on an@b.com, then both are listed.
2. Given a seat `Inactive`, then it carries a note that it may be reviewed; given `Not monitored`, then it reads "Not tracked".
3. Given another user's license requested through the API, then it returns `404`; no price or cost is shown.

#### AC-US46 Login / Logout

1. Given correct credentials, then the user starts where their role works: Manager the license list (UC01), Staff the connectors (UC09), Admin the users (UC07), Employee their own licenses (UC10).
2. Given 5 wrong passwords in a row, then login is locked for 15 minutes and the message stays generic.
3. Given an account whose password was never set, then login is refused until the one-time link is used.
4. Given a function outside the role, then it returns `403`; logout ends the session.
5. Given a forgotten password and the account email, then a new one-time link is emailed and the old one stops working.

**Related:** [Use cases](02-use-cases.md) · [Feature list](08-feature-list.md) · [Top-down research](01-research-top-down.md)
