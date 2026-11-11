# Database Design

> Design status: TARGET
>
> Source: [`elms.dbml`](elms.dbml) (DBML, every rule in the table notes). Reference DDL: [`schema.sql`](schema.sql) (PostgreSQL 15+, generated from the DBML plus partial indexes; runs clean on PostgreSQL 17). Diagrams: [`diagrams/`](diagrams/) — one draw.io ERD per group, and the entity overview in Mermaid; each with PNG and SVG.

ELMS keeps license data collected from providers or entered by Staff, the budget, and the optimization results in one PostgreSQL database. Nothing in it is written back to a provider (BR-01). The schema has 41 tables in seven groups.

## Conventions

| Topic | Decision |
|---|---|
| Naming | `snake_case`, plural table names |
| Keys | `bigint` identity on every table, so `audit_logs.entity_id` can point to any row |
| License | A license is a **plan** (`license_plans`, e.g. Microsoft 365 E3); each purchase is an `entitlement_lines` row. Holders, usage, budgets, expenses, and recommendations point to the plan, so they survive renewals |
| Unknown | `NULL` means Unknown and is never read as 0 (BR-04, A4). "Unlimited" is its own flag. A total with one Unknown part is Unknown |
| Money | `numeric(18,2)` with an ISO 4217 `currency`; amounts in different currencies are added only through `exchange_rates` (BR-05) |
| Quantities | `numeric(20,4)`: one column serves seats, sessions, tokens, and cores |
| State | Where a row has an end date (`ended_on`, `valid_to`, `disabled_at`) there is no status column; end dates are inclusive |
| Deletion | Master data is never deleted, only ended or marked inactive (BR-15); no cascading deletes |
| Provenance | Every collected row has `source` (`api`, `log`, `import`, `manual`) and `sync_run_id` or `import_batch_id`, enforced by CHECK. Confidence is derived: per-subject api/log = high; aggregate or import = medium; manual = low (BR-14, A9) |
| History | Providers give no history, so ELMS freezes results: daily snapshots, and monthly cost allocations when a month closes |
| Rules | Single-row rules are CHECK constraints; partial uniqueness is in `schema.sql`; cross-table rules are "App rule" lines in the DBML notes, enforced by the service in the same transaction |
| Diagrams | One ERD per group shows only the relationships inside the group. A foreign key to a table of another group names its target on the column (`org_unit_id → org_units`); who-did-it columns always point to `user_accounts`. `created_at` and `updated_at` exist on most tables and are not shown |

## Entity overview

![Entity overview](diagrams/erd_overview.png)

Source: [`diagrams/erd_overview.mmd`](diagrams/erd_overview.mmd) (Mermaid, ELK layout; edit by hand, the PNG and SVG are rendered from it). Each line is labelled with what the relationship means; crow's foot = many, bar = one, circle = optional.

Not drawn: the who-did-it columns (`created_by`, `decided_by` … → `user_accounts`), provenance (`sync_run_id`, `import_batch_id`), file attachments of contracts and expenses, and the unit columns of snapshots, results, recommendations, subjects, and provider accounts. `system_settings`, `exchange_rates`, `audit_logs`, and `data_overrides` have no relationship other than the who-did-it column.

## Organization and access

![Organization and access](diagrams/erd_organization.png)

- **Two-level tree (UC20).** A row of `org_units` is a P&L (`parent_id` NULL) or a department under one P&L; a CHECK ties `unit_type` to `parent_id`. P&L names are unique case-insensitive.
- **People and logins (D2).** `employees` is the directory; `org_unit_id` NULL is "Unknown department" (BR-06). `user_accounts` has one row per employee and exactly one role (BR-17). Setting an employee to `left` disables the account in the same transaction (D14).
- **Lockout (BR-18).** Five failures in a row set `locked_until` 15 minutes ahead. Sessions are server-side (`user_sessions`), so disabling an account revokes them at once (UC19).
- **Permissions (UC22).** `role_permissions` is the role × feature matrix; Employee cannot be granted price or cost features. Every change is written to `audit_logs` with a reason.
- **Manager scope (BR-16).** `manager_org_units` lists the units of a Manager; a P&L covers its departments.
- **Settings.** `system_settings`: `reporting_currency` (VND), `inactivity_threshold_days` (60), `month_close_day` (10), `raw_record_retention_days` (180).

## License catalog and entitlements

![License catalog](diagrams/erd_license_catalog.png)

- **Provider accounts (D11).** A vendor has one or more tenants or billing accounts (one Microsoft 365 tenant per P&L, for example). A vendor without tenants has one account named "Default". User ids and subscription ids are unique per account.
- **Plan (D1).** `license_plans` fixes the archetype (`allocation`, `concurrent`, `metered`, `capacity`, BR-02) and the counted unit. `owner_org_unit_id` is the unit that buys the license and receives its company-level results (D10).
- **Purchase.** An `entitlement_lines` row has a quantity or `is_unlimited`, validity, `commercial_term`, and `unit_price` for the period of that term. Effective monthly cost (BR-05): monthly = quantity × price; yearly, multi-year, and perpetual maintenance = ÷ 12; prepaid credit = ÷ months of validity; pay-as-you-go = actual spend from `expenses`.
- **Renewal.** A renewal is a new line with `renews_line_id`, starting the day after the old line ends, so the boundary day is not counted twice. A synced subscription is one row per `(provider_account_id, external_ref)` (A3).
- **Purchased.** Sum of the lines active on a day; one line with Unknown quantity makes the sum Unknown.
- **Quotas (D3).** `entitlement_allocations` splits a line with a known quantity among units; the total never exceeds the line (checked under a row lock). A line without quotas is shared.
- **Contracts (UC04).** One FK on the line means a line is under at most one contract. Notice deadline = `renewal_date − notice_period_days`; "Renewal soon" and "Notice period passed" are computed.

## Collection pipeline

![Collection pipeline](diagrams/erd_collection.png)

- **One primary source (BR-14).** `plan_data_sources` has one row per plan, account, and kind of data (`entitlement`, `assignment`, `usage`, `expense`). A plan whose holders or usage come from a connector refuses manual entry of that data (UC03). A usage source declares `granularity` (`per_subject` or `aggregate`) and `monitoring_since`.
- **Runs (A1, A3, A4).** A `sync_runs` row per connector execution; a failed run writes nothing, so the day stays Unknown. `raw_records` keeps payloads before normalization (A2) and is purged after the retention period.
- **Completeness (D8).** `collection_coverage` says, per plan, account, kind, and day, whether the data is `complete`, `partial`, or `failed`. Detection and daily snapshots use only complete days. A successful run that finds 0 holders writes `complete`, so a real 0 is told apart from a missing day.
- **Imports (UC03, UC07).** `import_batches`: preview, then confirm or reject; one invalid row rejects the file. Confirm re-validates the same file.

## Holders and usage

![Holders and usage](diagrams/erd_holders_usage.png)

- **Subjects.** Provider identities (user, device, project, API key), matched to `employees` by company email. Department of a subject = the employee's unit, otherwise `subjects.org_unit_id`, otherwise Unknown department. A sync matches on `external_id` first, so a renamed user keeps the seat history.
- **Seat status (BR-03, D7)** is computed for an open assignment:

  | Status | Rule |
  |---|---|
  | `Not monitored` | No usage source for the plan in that account, or the source is `aggregate` |
  | `Active` | `last_active_at` within 60 days |
  | `Inactive` | `last_active_at` older than 60 days |
  | `No activity` | `last_active_at` is NULL |

  UC11 flags a seat only when the usage coverage of the day is complete and both the source and the seat are at least 60 days old.
- **Usage records.** Peak sessions, consumption, deployed units, or aggregate active users per period. The same period entered again replaces the row (UC03); periods never overlap.
- **Snapshots.** `plan_daily_snapshots` holds Purchased and effective monthly cost per plan and day; `plan_unit_daily_snapshots` holds seats per status and department per day. Both are frozen; the cost of a month is Σ daily rate ÷ days in the month, never the sum of daily rows.

## Budget, cost, and expenses

![Budget, cost, and expenses](diagrams/erd_budget_cost.png)

- **Two cost views (D5).** *Billed* = `expenses`: what the invoice says, on its date (UC07). *Effective* = `cost_allocations`: the BR-05 monthly cost of each plan split by BR-06 into units, `unallocated`, and `unknown_department`. UC06, UC08, and UC16 use the effective view, so the units plus `Unallocated` equal the company total.
- **Allocation methods.** `per_seat` (cost ÷ purchased seats × seats of the unit), `per_usage` (non-seat plans, by department of the subjects), `direct` (pay-as-you-go expenses that name a unit), `none` (all `Unallocated`). Rows of an open month are recomputed daily and frozen (`is_final`) when the month closes (D9).
- **Budgets (BR-08).** One plan per unit and fiscal year, `draft` or `active`, in the reporting currency. P&L and department plans are never added: the company total is the P&L plans, and inside a P&L the rest is "Not distributed". A change to an active plan needs a reason and is audited.
- **Expenses (BR-10).** A manual or CSV expense needs a unit (CHECK). A prepaid invoice stays on its date; `service_period_start/end` is optional (D6). A closed month accepts only correcting entries (`corrects_expense_id`, the only negative amounts).
- **Months (D14).** `accounting_periods`: month M closes on day 10 of M+1 by a system job, or earlier by Staff; it is never reopened.
- **Exchange rates (D12).** The rate of a day is the latest `effective_from` on or before it. No rate → the converted figure is Unknown and amounts are shown per currency (UC16).

## Optimization

![Optimization](diagrams/erd_optimization.png)

- **Results (BR-12).** One `detection_results` row per run, plan, check (`unused`, `inactive`, `overuse`), and unit. `not_evaluated` has no quantity, `clear` has 0, `flagged` has more than 0 and a `flagged_since`. Missing or incomplete data is `not_evaluated`, never `clear` or `Compliant` (UC17).
- **Unit of a result (D10).** Unused: one row per unit with a quota, plus one for the owner unit for shared seats. Overuse: the owner unit. Inactive: the department of the holders (NULL = Unknown department, shown to the owner unit). A Manager sees only rows of their units (BR-16).
- **Overuse (BR-07, D13).** Allocation: holders > purchased; Concurrent: peak sessions > slots; Capacity: deployed units > licensed; Metered with a quota: consumption over the line's validity > quota. Unlimited lines are never over-used.
- **Recommendations (BR-13).** `proposed` → `accepted` or `rejected` (reason required) → `done` (actual saving required). `notice_deadline` is the last day to tell the vendor before the renewal (UC13). An Unknown estimated saving is allowed and counted apart (D15). One open recommendation per plan, type, and unit.

## Audit

![Audit](diagrams/erd_audit.png)

- **Audit log (BR-15).** Append-only: the application role has INSERT and SELECT only. `correlation_id` links a change to its request or sync run.
- **Overrides (BR-14).** A Staff edit of a connector value (entitlement quantity or validity, billing API expense) needs a reason and keeps the original value; the next sync updates `original_value` and leaves the edited column. One override in force per field.

## Rule-to-schema traceability

| Rule | Where it is enforced in the database |
|---|---|
| BR-03 Seat status | `plan_data_sources.granularity`, `monitoring_since`; counts in `plan_unit_daily_snapshots` (CHECK: statuses add up to `assigned_count`) |
| BR-04 Unknown is not 0 | Nullable figures; `collection_coverage`; snapshot counts without defaults; `detection_results` outcome CHECKs |
| BR-05 Effective monthly cost | `entitlement_lines.commercial_term`, `unit_price`; `plan_daily_snapshots.effective_monthly_cost`; `exchange_rates` |
| BR-06 Cost allocation | `cost_allocations` (bucket CHECK, unique per period, plan, bucket, unit) |
| BR-07 Overuse | `entitlement_lines.is_unlimited` CHECK; `usage_records.metric` |
| BR-08 Budget | `uq_budget_plans_unit_year`; activation CHECK |
| BR-10 Expenses | `chk_expenses_unit_required`, `chk_expenses_negative_only_correction`, `accounting_periods` |
| BR-13 Recommendations | `chk_recommendations_reject_reason`, `chk_recommendations_done`, `uq_recommendations_open` |
| BR-14 Source and overrides | `source` + provenance CHECKs; `plan_data_sources` unique per plan, account, kind; `data_overrides` |
| BR-15 Audit | `audit_logs` (single-column `id` on every table) |
| BR-16 Data scope | `manager_org_units`, `license_plans.owner_org_unit_id`, unit on results and recommendations |
| BR-17 Roles | `user_accounts.role_id` NOT NULL; `role_permissions` |
| BR-18 Login | `failed_login_count`, `locked_until`, `user_sessions.token_hash` |
| A3 Idempotent sync | `uq_entitlement_lines_account_external`, `uq_expenses_account_external`, `uq_usage_records_period` |
| UC03 One open holder | `uq_license_assignments_open` |
| UC20 Unit names | `uq_org_units_pnl_name`, `uq_org_units_parent_name` |

## Proposed decisions

D1–D4 are agreed. D5–D15 came out of the schema audit of 2026-11-11; the schema applies them, and they need team confirmation. If the team accepts them, the use case text in the last column changes.

| # | Question | Proposal | Use cases to update |
|---|---|---|---|
| D5 | Actual cost per unit: invoice or allocation? | Billed (`expenses`) and effective (`cost_allocations`) views; budgets use effective | BR-10, UC07, UC08, UC16 |
| D6 | Prepaid invoices | Stay on their date; the spread is the line's effective cost; optional service period | UC07 |
| D7 | Aggregate-only usage | Seats are `Not monitored`; 60-day grace for new sources and seats | BR-03, UC11 |
| D8 | Partial syncs | `collection_coverage`; detection uses complete days only | — |
| D9 | Employee moves | Freeze snapshots and closed months; no history table yet | UC06 |
| D10 | Company-level results for Managers | Plan owner unit; results per unit; Manager sees own units only | UC10, UC12, UC01/UC03 |
| D11 | Several tenants per vendor | `provider_accounts` | UC02, UC03 |
| D12 | Currencies | One reporting currency; rate of the day; frozen | BR-05 |
| D13 | Metered overuse | Consumption over a quota line's validity > quota | BR-07, UC12 |
| D14 | Month close, leavers | Auto close on day 10; leavers' accounts disabled | BR-10, UC19 |
| D15 | Unknown saving, notice date | Saving may be Unknown; Done needs actual saving; `notice_deadline` | BR-13, A7, UC13 |

Prior art: FOCUS billed vs effective cost ([FinOps](https://www.finops.org/assets/terminology/)), Flexera [allocation rules](https://docs.flexera.com/flexera-one/cloud/using-cloud-cost-optimization/analyzing-cloud-costs-in-billing-centers/allocation-rules) and [license allocation](https://docs.flexera.com/flexnetmanagersuite2022r1/en/webhelp/tasks/Lic-AllocateInstallationstoLic.html), Snow Atlas [currency rates](https://docs.flexera.com/snow-atlas/sam-core/sam-core-user-interface/concepts-terminology-and-features/currency-management), ServiceNow SAM Pro [last activity](https://www.servicenow.com/community/sam-blog/servicenow-sam-pro-determination-of-last-activity-date-for-m365/ba-p/2959443).

## Seed data

| Table | Rows |
|---|---|
| `roles` | `ADMIN`, `MANAGER`, `STAFF`, `EMPLOYEE` |
| `permissions`, `role_permissions` | The role × feature matrix of [Use cases](../02-use-cases.md) |
| `system_settings` | The four settings above |
| `org_units`, `employees`, `user_accounts` | One P&L, one employee, and one `ADMIN` account from deployment secrets |
| `vendors`, `provider_accounts`, `connectors` | Demo vendors, their "Default" accounts, and simulated connectors (`is_simulated = true`) until the Admin configuration screen exists |

## Regenerating

```bash
npx -p @dbml/cli dbml2sql docs/database/elms.dbml --postgres   # generated part of schema.sql
cd docs/diagrams && python ve_erd.py                           # diagrams/*.drawio, .png, .svg
```

`ve_erd.py` draws the group ERDs from `elms.dbml` with the team library `srsdiagram.py` (Pillow, Playwright Chromium), renders `erd_overview.mmd` with Mermaid (downloaded from jsDelivr, so it needs network), and deletes the old `.drawio`, `.png`, and `.svg` files first. It stops if a table is missing from `LAYOUT` or the overview names a table that no longer exists. When a relationship changes, update `elms.dbml` and `erd_overview.mmd`, then regenerate.

**Related:** [Use cases](../02-use-cases.md) · [INVEST requirements](../03-invest-requirements.md) · [Top-down research](../01-research-top-down.md)
