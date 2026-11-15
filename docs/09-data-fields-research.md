# Data Fields Research — P&L License API, BCA, ILVG, SAP

> Design status: DRAFT (input for the revised mind map; not yet reflected in documents 01–06 or the database)
>
> Implementation status: NOT STARTED

System: **Enterprise License Management System (ELMS)**, built by team VFast.

This document answers one question from the revised business model: *when ELMS calls a P&L's license API, what can the response contain so that ELMS can show how licenses are used?* It also lists the fields expected from the three other sources: BCA (actual usage on company machines), ILVG (employees and organization), and SAP (monthly budget plan).

## 1. Revised data flow

```text
P&L license API  ─┐  licenses the P&L uses, quantities, holders
BCA usage API    ─┤  actual usage per member, measured on company machines
ILVG employee API─┼→ ELMS connectors → actual-usage tables → waste per P&L / block / department / project
SAP import       ─┘  monthly budget plan
```

| Source | Owner | ELMS gets | Direction |
|---|---|---|---|
| P&L license API | Each P&L builds it to the ELMS contract; ELMS calls it | Every license the P&L uses, with quantities, holders, and usage | ELMS → P&L, read-only |
| BCA API | Endpoint tracking tool | Usage frequency per member; licenses found on company machines | ELMS → BCA, read-only |
| ILVG API | Internal application | Employees and the unit each belongs to | ELMS → ILVG, read-only |
| SAP | Finance | Monthly budget plan per P&L, block, project | File import |

Fixed organization hierarchy: **Group > P&L > Block > Department > Project**.

The three figures every view is built on: **Budgeted** (plan), **Paid** (purchased), **Actually used**. They are quantities of licenses, not money; cost detail per P&L is out of scope for now.

## 2. How the field list was built

No public API returns everything in one response. The list below is the union of what license, seat, and usage APIs return today, grouped by meaning. Sources read for this document:

| Source | What it shows | Checked |
|---|---|---|
| Microsoft Graph `subscribedSku` | A plan with prepaid and consumed units | Official reference, November 2026 |
| Microsoft Graph `getOffice365ActiveUserDetail` | Per-user licence flags, last activity per app, licence assign dates | Official reference |
| GitHub Copilot billing and seats | Seat breakdown per cycle, per-seat last activity | Official reference |
| Google Workspace `LicenseAssignment` | Minimal seat assignment (product, SKU, user) | Official reference |
| Anthropic usage report | Usage-based consumption in time buckets, with group-by dimensions | Official reference |
| Slack `team.billableInfo` | Billing status per user | Official reference |
| Snipe-IT licence object | A company's own licence register (purchase, seats, expiry) | Official reference |
| FOCUS 1.2 | 57 cost and usage columns | Specification page |
| OpenAI usage and costs, Zoom users, Atlassian last-active, Adobe user management | Same patterns as above | **Not re-checked** (pages unavailable); fields from them are not relied on below |

Findings that shape the contract:

- **Seat APIs give three counts, not one.** Graph separates `prepaidUnits` (`enabled`, `suspended`, `warning`, `lockedOut`) from `consumedUnits` (assigned). GitHub adds activity: `total`, `active_this_cycle`, `inactive_this_cycle`, `added_this_cycle`, `pending_invitation`, `pending_cancellation`. "Paid", "assigned", and "used" must be three separate fields.
- **Assigned is not used.** Only an activity field tells them apart: `last_activity_at`, `last_authenticated_at` (GitHub), per-app "Last Activity Date" (Graph). Google's `LicenseAssignment` has no activity at all — an API can be valid and still unable to show usage.
- **Usage-based APIs return time buckets with dimensions**, not seats: `starting_at`, `ending_at`, then quantities per `model`, `workspace_id`, `api_key_id`, `account_id`, `service_tier` (Anthropic). The subject is often a key or a project, not a person.
- **Activity can be anonymized or delayed.** Graph usage reports hide user names by tenant setting and cover a limited window (D7–D180). The contract needs fields that say so.
- **Organization data is never in provider APIs.** Block, department, and project must come from the P&L itself or from ILVG.

## 3. P&L license API — field catalogue

`M` = mandatory, `R` = recommended, `O` = optional. Priority is a proposal.

### 3.1 Response envelope

| Field | Meaning | Priority |
|---|---|---|
| `schema_version` | Contract version | M |
| `pnl_code`, `pnl_name` | The P&L that answers | M |
| `period` | Month the data describes (`YYYY-MM`) | M |
| `data_date`, `generated_at` | Day the data is true for; time the response was built | M |
| `completeness` | `complete` or `partial`, with the licenses that are missing | M |
| `total_count`, `next_cursor` | Record count over all pages; paging | M |
| `source_system` | Where the P&L took the data from | O |

### 3.2 License identity

| Field | Meaning | Priority |
|---|---|---|
| `license_id` | Stable identifier inside the P&L | M |
| `license_name` | Name as the P&L knows it | M |
| `product_name`, `vendor` | Software and publisher, used to match the same software across P&Ls | M |
| `sku`, `plan`, `edition` | Provider plan, for example `ENTERPRISEPACK`, `Copilot Business` | R |
| `category` | Productivity, development, design, AI, security, engineering, … | R |
| `provider_account_id` | Tenant, organization, or billing account at the provider | O |
| `description`, `notes` | Free text | O |

### 3.3 License type and term

| Field | Meaning | Priority |
|---|---|---|
| `license_type` | `monthly` or `usage_based` — decides which actual-usage table the record goes to | M |
| `metric` | What is counted: `user`, `device`, `concurrent_session`, `token`, `request`, `credit`, `gb`, `core`, … | M |
| `unit` | Unit of the quantities | M |
| `status` | `active`, `trial`, `suspended`, `expired`, `cancelled` | M |
| `start_date`, `end_date` | Validity | R |
| `renewal_date`, `auto_renew` | Next renewal | R |
| `billing_cycle` | `monthly`, `yearly`, `multi_year`, `prepaid` | R |
| `is_trial` | Trial or paid | O |

### 3.4 Quantities — monthly (seat) licenses

| Field | Meaning | Seen in | Priority |
|---|---|---|---|
| `purchased_quantity` | Seats paid for | Graph `prepaidUnits.enabled`, Snipe-IT `seats`, GitHub `seat_breakdown.total` | M |
| `assigned_quantity` | Seats given to someone | Graph `consumedUnits` | M |
| `available_quantity` | Purchased minus assigned | Snipe-IT `free_seats_count` | R |
| `active_quantity` | Seats with activity in the period | GitHub `active_this_cycle` | M |
| `inactive_quantity` | Assigned seats without activity in the period | GitHub `inactive_this_cycle` | R |
| `suspended_quantity`, `warning_quantity` | Seats in grace or suspended | Graph `prepaidUnits.suspended`, `.warning` | O |
| `added_quantity`, `removed_quantity` | Change during the period | GitHub `added_this_cycle` | O |
| `pending_invitation_quantity`, `pending_cancellation_quantity` | Seats not yet effective or about to end | GitHub | O |
| `peak_concurrent` | Highest simultaneous use (floating licenses) | License servers | O |

### 3.5 Quantities — usage-based licenses

| Field | Meaning | Seen in | Priority |
|---|---|---|---|
| `period_start`, `period_end`, `bucket_width` | Time bucket | Anthropic `starting_at`, `ending_at`, `bucket_width` | M |
| `consumed_quantity`, `unit` | Amount used in the bucket | FOCUS `ConsumedQuantity`, `ConsumedUnit` | M |
| `quota_quantity` or `committed_quantity` | Amount bought or committed for the period; empty when unlimited | FOCUS `CommitmentDiscountQuantity` | M |
| `remaining_quantity`, `overage_quantity` | Left over, or used above the quota | — | R |
| `request_count` | Number of calls | Usage APIs | R |
| `sub_metric` | Split of one metric: input, output, cached tokens | Anthropic `uncached_input_tokens`, `output_tokens`, `cache_read_input_tokens` | O |
| `meter` | Model, service, or SKU meter the usage belongs to | Anthropic `model`, FOCUS `SkuMeter` | R |
| `subject_type`, `subject_ref` | Who or what consumed: user, API key, project, workspace, service account | Anthropic `account_id`, `api_key_id`, `workspace_id` | R |
| `credit_expiry_date` | When prepaid credit expires | — | O |

### 3.6 Organization attribution

| Field | Meaning | Priority |
|---|---|---|
| `block_code`, `block_name` | Block the license belongs to | M |
| `department_code`, `department_name` | Department | M |
| `project_code`, `project_name` | Project | R |
| `cost_center` | Finance key, to join with the SAP plan | R |
| `owner_employee_id` | Person responsible for the license in the P&L | O |
| `allocation` | When one license is shared by several units: list of unit and quantity | R |

### 3.7 Holders (one record per assigned seat)

| Field | Meaning | Seen in | Priority |
|---|---|---|---|
| `employee_id` | Key that matches ILVG | — | M |
| `email`, `account_name` | Account at the provider | Graph `User Principal Name`, Google `userId` | R |
| `assigned_at`, `unassigned_at` | Assignment dates | Graph "License Assign Date", GitHub `created_at` | R |
| `assignment_source` | Direct, or through a group or team | GitHub `assigning_team` | O |
| `seat_tier` | Role or tier inside the product: admin, member, guest, viewer | GitHub `plan_type` | O |
| `account_status` | Active, disabled, deleted | Graph `Is Deleted`, `Deleted Date` | R |
| `device_id` | For device-based licenses | — | O |
| `billing_active` | Whether the provider bills this user | Slack `billing_active` | O |

### 3.8 Activity (per holder and period)

| Field | Meaning | Seen in | Priority |
|---|---|---|---|
| `last_activity_at` | Last real use | GitHub `last_activity_at`, Graph "Last Activity Date" | M when available |
| `last_login_at` | Last sign-in | GitHub `last_authenticated_at`, Graph `signInActivity` | R |
| `active_days` | Days with activity in the period | — | R |
| `session_count`, `usage_minutes` | Frequency and duration | — | O |
| `feature_activity` | Last activity per application or feature | Graph (Exchange, Teams, OneDrive, …) | O |
| `last_activity_client` | Client used | GitHub `last_activity_editor` | O |

### 3.9 Data quality

| Field | Meaning | Priority |
|---|---|---|
| `granularity` | `per_user` or `aggregate` | M |
| `is_anonymized` | Holder identities hidden | M |
| `data_delay_days` | How late the provider reports | R |
| `collection_method` | `api`, `export`, `manual` at the P&L | R |
| `updated_at` | Last change of the record | R |

### 3.10 Commercial fields (deferred)

Not requested now. Listed so the contract can add them later without a redesign: `unit_price`, `currency`, `billed_cost`, `purchase_order`, `invoice_id`, `contract_ref`, `purchase_date`, `supplier` (Snipe-IT `purchase_cost`, `order_number`, `purchase_order`, `supplier`; FOCUS `BilledCost`, `EffectiveCost`, `InvoiceId`).

## 4. BCA — actual usage on company machines

Fields to ask for; the real API has not been seen.

| Group | Fields |
|---|---|
| Subject | `employee_ref` (pseudonymous or real), `device_ref`, `pnl_code` |
| Software | `application_name`, `publisher`, `version`, `executable` |
| License on the machine | `license_detected`, `license_type`, `activation_status`, `installed_at` |
| Usage | `period`, `last_used_at`, `launch_count`, `active_days`, `foreground_minutes` |
| Quality | `agent_last_seen_at`, `coverage` (share of machines reporting) |

If BCA hides employee identity, usage can only be joined to ILVG through a shared pseudonymous key, or reported per department instead of per person.

## 5. ILVG — employees and organization

| Group | Fields |
|---|---|
| Employee | `employee_id`, `email`, `full_name`, `status`, `joined_at`, `left_at`, `job_title`, `manager_id` |
| Position | `pnl_code`, `block_code`, `department_code` |
| Projects | `project_code`, `project_name`, `allocation_percent`, `from`, `to` (a person can be on several projects) |
| Units | `unit_code`, `unit_name`, `unit_level` (P&L, block, department, project), `parent_code`, `is_active` |

## 6. SAP — monthly budget plan

| Group | Fields |
|---|---|
| Period | `fiscal_year`, `month`, `plan_version` |
| Organization | `pnl_name`, `company_code`, `block_code`, `department_code` or `cost_center`, `project_code`, `project_name` |
| Line | `license_name` or `material`, `planned_quantity`, `unit` |
| Paid | `paid_quantity`, `posting_date`, `document_number` — if SAP is also the source of the "Paid" figure |
| Money (deferred) | `planned_amount`, `paid_amount`, `currency` |

## 7. Actual-usage tables (proposal)

| Table | One row per | Main columns |
|---|---|---|
| Monthly license usage | License × unit × month | Budgeted, paid, assigned, active quantity |
| Usage-based license usage | License × unit × period (× meter) | Quota, consumed, remaining, unit |
| Employee usage | Employee × license or application × period | Active days, sessions, minutes, last use; columns to be decided |

A new license type later becomes a new table of the same pattern.

## 8. Open questions

1. Which system provides **Paid**: the P&L API (`purchased_quantity`) or SAP actuals?
2. Is the SAP plan in quantities, in money, or both? The three figures can only be compared in one unit.
3. When is a P&L shown in red: which ratio (used / paid, paid / budgeted) and which threshold?
4. A holder working on several projects: which project does the seat count toward?
5. Does BCA return identifiable employees? If not, what is the join key with ILVG?
6. Which fields can the P&Ls really deliver in phase 1? The `M` set above is the proposed minimum.

**Related:** [Research](01-research-top-down.md) · [Connector standard](06-connector-standard.md)
