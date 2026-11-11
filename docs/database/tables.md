# Tables and Fields

Every table of the ELMS database, what it is for, and what each of its fields means, in plain words. The exact rules (constraints, indexes, how figures are computed) are in [`elms.dbml`](elms.dbml); the overview and diagrams are in [Database design](README.md).

**How to read the field lists**

- **Type** in everyday words: *text*, *number*, *quantity* (a number with decimals, used for seats, tokens, cores …), *money*, *date*, *date-time*, *yes/no*, *choice* (one of a fixed list), *JSON* (structured data), and *link → table* (points to a row of another table).
- **Required**: "Yes" means the field always has a value. An empty field means **Unknown**, never 0: ELMS never guesses a missing figure.
- Fields that many tables share mean the same thing everywhere:

| Field | Meaning |
|---|---|
| `id` | Row number, given automatically. Other tables use it to point to this row |
| `created_at`, `updated_at` | When the row was created, and when it last changed |
| `created_by`, `entered_by`, `uploaded_by` … | The user who did it |
| `is_active` | No longer used when "No". Rows are switched off instead of deleted, so history stays intact |
| `source` | Where the data came from: `api` or `log` (a connector), `import` (a CSV file), `manual` (typed by Staff) |
| `sync_run_id`, `import_batch_id` | The connector run or CSV import that last wrote the row, so every figure can be traced back |
| `currency` | Three-letter currency code next to an amount typed in from outside, such as `USD`. Figures ELMS computes, budgets, and savings have no currency field: they are always in the reporting currency (VND) |

---

## 1. Organization and access

### `org_units`: P&Ls and departments

The shape of the group: each subsidiary (P&L) and the departments inside it, for example the P&L "VinFast Manufacturing" with the departments "IT" and "Finance". Only two levels exist. Budgets, costs, and what a Manager may see are all counted per unit.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `parent_id` | link → `org_units` | | The P&L a department belongs to. Empty = the unit is a P&L |
| `name` | text | Yes | Unit name. Two departments of the same P&L cannot share a name |
| `is_active` | yes/no | Yes | "No" for a unit that no longer exists |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `employees`: staff list

Everyone who works in the group, whether or not they log in to ELMS. It tells ELMS which department a person is in, so when Microsoft reports that `an@company.com` holds an E3 seat, the cost of that seat goes to An's department. Loaded by Admin, from an HR CSV file, or by a connector.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `employee_code` | text | | HR employee number. Stays the same even if the email changes |
| `full_name` | text | Yes | Name shown on screens |
| `email` | text | Yes | Company email, in lowercase. The key used to match a person with their login and their accounts at Microsoft, Adobe … |
| `org_unit_id` | link → `org_units` | | Current department. Empty = "Unknown department" |
| `left_on` | date | | Last working day. Empty = still with the company. After this day the account is disabled and any seat they still hold is flagged as waste |
| `source` | choice | Yes | `manual` (created with an account by Admin), `import` (HR file), `api` (identity connector) |
| `sync_run_id` | link → `sync_runs` | | Connector run that last updated the person |
| `import_batch_id` | link → `import_batches` | | HR file that last updated the person |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `roles`: the four roles

Admin, Manager, Staff, and Employee. The list never changes; Admin changes the role of a person, not the list.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `code` | text | Yes | Fixed code used by the program: `ADMIN`, `MANAGER`, `STAFF`, `EMPLOYEE` |
| `name` | text | Yes | Name shown on screens |
| `description` | text | | What the role is for, shown on the roles screen |

### `permissions`: what can be allowed

Every feature that can be switched on for a role, once for reading and once for editing, such as "contracts – read" and "contracts – write".

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `feature_code` | text | Yes | The feature, such as `contracts`, `expenses`, `budget_plan` |
| `action` | choice: `read`, `write` | Yes | View only, or also change |
| `description` | text | | Explanation shown in the permission matrix |

### `role_permissions`: who may do what

The tick boxes of the permission matrix: one row = one role is allowed one permission.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `role_id` | link → `roles` | Yes | The role |
| `permission_id` | link → `permissions` | Yes | What it is allowed. Who ticked the box and when is in `audit_logs` |

### `user_accounts`: logins

The people who can log in. Each login belongs to one employee and has exactly one role.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `employee_id` | link → `employees` | Yes | The person. One person has at most one login; the login email is their company email |
| `role_id` | link → `roles` | Yes | Their role |
| `password_hash` | text | | The password, scrambled so nobody can read it. Empty until the user sets one: they cannot log in yet |
| `password_token_hash` | text | | The one-time link a new user opens to set their password (or to reset a forgotten one), stored scrambled. Empty when no link is open |
| `password_token_expires_at` | date-time | | When that link stops working |
| `failed_login_count` | number | Yes | Wrong passwords in a row. Back to 0 after a successful login |
| `locked_until` | date-time | | After 5 wrong passwords in a row, login is blocked until this time (15 minutes) |
| `last_login_at` | date-time | | Last successful login, shown in the user list |
| `disabled_at` | date-time | | When Admin disabled the login. Empty = active. A disabled login cannot sign in, and open sessions end at once |
| `created_by` | link → `user_accounts` | | Admin who created it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `user_sessions`: who is logged in

One row per open login session. Sessions are kept on the server so that disabling an account logs the person out immediately: logging out, disabling the account, or changing its role deletes the row.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `user_account_id` | link → `user_accounts` | Yes | Whose session |
| `token_hash` | text | Yes | The session key from the browser cookie, stored scrambled so a database leak does not expose sessions |
| `created_at` | date-time | Yes | Login time |
| `expires_at` | date-time | Yes | When the session ends on its own |

### `manager_org_units`: units a Manager looks after

Which units each Manager is responsible for. A Manager sees the data of these units only; a P&L includes all its departments.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `user_account_id` | link → `user_accounts` | Yes | The Manager |
| `org_unit_id` | link → `org_units` | Yes | A unit they look after |

---

## 2. License catalog and entitlements

### `vendors`: who we buy from

Software makers such as Microsoft or Adobe, and resellers such as a local distributor that sells several brands under one contract.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `name` | text | Yes | Vendor name, unique |
| `kind` | choice: `publisher`, `reseller` | Yes | `publisher` makes the software; `reseller` only sells it. Products belong to publishers; a contract can be signed with either |
| `website` | text | | Website |
| `support_contact` | text | | Who to call for support: name, email, phone |
| `is_active` | yes/no | Yes | "No" for a vendor no longer used |
| `created_by` | link → `user_accounts` | | Staff who added it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `software_categories`: catalog folders

Categories and subcategories of the catalog, for example "Office & collaboration" › "Email".

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `parent_id` | link → `software_categories` | | The category a subcategory sits in. Empty for a top-level category |
| `name` | text | Yes | Name |

### `software_products`: products

A software product, such as "Microsoft 365" or "Adobe Acrobat". This is the "License" column on most screens.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `vendor_id` | link → `vendors` | Yes | The publisher |
| `category_id` | link → `software_categories` | | Its category or subcategory. Empty = "Uncategorized" |
| `name` | text | Yes | Product name |
| `description` | text | | Short description |
| `is_active` | yes/no | Yes | "No" for a product no longer used |
| `created_by` | link → `user_accounts` | | Staff who added it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `product_links`: useful links

Handy links of a product: admin portal, terms of service, license policy.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `product_id` | link → `software_products` | Yes | The product |
| `label` | text | Yes | Text shown, such as "Admin portal" |
| `url` | text | Yes | The address |

### `license_plans`: licenses

The thing people actually hold, such as "Microsoft 365 E3" or "OpenAI API pay-as-you-go". This is what the rest of the docs call **a license**. It stays the same across renewals, so holders, usage, and budgets keep their history.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `product_id` | link → `software_products` | Yes | The product |
| `name` | text | Yes | Tier or SKU, such as "E3", "E5", "Business" |
| `archetype` | choice | Yes | How use is measured: `allocation` (one seat per person or device), `concurrent` (sessions at the same time), `metered` (tokens, requests, GB), `capacity` (cores, servers) |
| `unit` | text | Yes | What is counted: seat, device, slot, token, core … |
| `owner_org_unit_id` | link → `org_units` | Yes | The unit that buys and owns the license; it sees the seats nobody holds |
| `description` | text | | Short description |
| `is_active` | yes/no | Yes | "No" for a license no longer used |
| `created_by` | link → `user_accounts` | | Staff who added it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `contracts`: signed agreements

The agreement with the vendor or reseller: start, renewal, notice, and value. ELMS uses it to warn before a renewal and to show the last day a cut can still be made.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `vendor_id` | link → `vendors` | Yes | Who the contract is signed with: the publisher or a reseller |
| `contract_no` | text | | Number printed on the contract |
| `title` | text | Yes | Name shown |
| `start_date` | date | Yes | First day of the contract |
| `renewal_date` | date | | Day the contract renews or ends |
| `notice_period_days` | number | | How many days before renewal the vendor must be told, for example 30. Empty = nobody knows yet; ELMS then shows the deadline as unknown instead of assuming 0 days |
| `auto_renew` | yes/no | Yes | "Yes" if the contract renews by itself unless cancelled in time |
| `commitment_amount` | money | | Minimum amount the company has committed to spend, if any |
| `total_value` | money | | Value of the contract |
| `currency` | text | | Currency of the two amounts above |
| `ended_on` | date | | Day the contract was marked ended. Empty = still running |
| `notes` | text | | Free notes |
| `created_by` | link → `user_accounts` | | Staff who added it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

The files of a contract (scan, amendments, PO) are in `files`, linked by `files.contract_id`.

### `entitlement_lines`: purchases

One purchase of a license, for example "500 E3 seats from 1 Jan to 31 Dec 2026 at 432 USD per seat per year". Buying more or renewing adds a new line under the same license, so the history of quantities and prices is kept. "Purchased" on screens is the total of the lines valid that day.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `license_plan_id` | link → `license_plans` | Yes | The license bought |
| `contract_id` | link → `contracts` | | The contract covering it, if any |
| `quantity` | quantity | | How many were bought: seats, slots, tokens, cores … Empty = unknown, or unlimited |
| `is_unlimited` | yes/no | Yes | "Yes" when there is no limit (pay-as-you-go). Such a line can never be over-used |
| `valid_from` | date | Yes | First day of validity |
| `valid_to` | date | | Last day of validity. Empty = no end (perpetual) |
| `commercial_term` | choice | Yes | How it is paid: `monthly`, `yearly`, `multi_year`, `perpetual` (only maintenance is a cost), `prepaid_credit`, `pay_as_you_go` (actual bill each month) |
| `unit_price` | money | | Price, as on the vendor's price list, for the period of the term (per month for monthly, per year for yearly …). Empty = unknown |
| `price_per_qty` | quantity | Yes | How many units that price is for: 1 for a seat, 1,000,000 for "2.50 USD per 1 million tokens". Default 1 |
| `currency` | text | Yes | Currency of the price |
| `source` | choice | Yes | Where the quantity and dates came from. Prices always come from Staff |
| `external_ref` | text | | Subscription id at the vendor, when a connector syncs it |
| `sync_run_id`, `import_batch_id` | link | | Connector run or CSV import that last wrote it |
| `created_by` | link → `user_accounts` | | Staff who entered it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `entitlement_allocations`: quotas per unit

An optional split of a purchase between units: "of the 500 seats, 300 are for Sales and 200 for IT". A purchase without a split is shared by the whole company. Each split has its own dates, so seats can move between units during the year.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `entitlement_line_id` | link → `entitlement_lines` | Yes | The purchase being split |
| `org_unit_id` | link → `org_units` | Yes | The unit receiving the quota |
| `quantity` | quantity | Yes | How many of the purchase are reserved for it |
| `valid_from` | date | Yes | First day of the quota |
| `valid_to` | date | | Last day. Empty = until the purchase ends |
| `created_by` | link → `user_accounts` | | Staff who set it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

---

## 3. Collection pipeline

### `connectors`: connections to vendors

A configured, read-only connection that fetches data every night, for example "Microsoft Graph". ELMS never changes anything at the vendor.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `vendor_id` | link → `vendors` | Yes | The vendor it reads; the tenant id is part of its credentials |
| `name` | text | Yes | Name shown, unique |
| `connector_type` | text | Yes | Which program runs, such as `ms_graph` or `license_server_log` |
| `base_url` | text | | Address of the server to read, for a self-hosted license server |
| `credentials_ref` | text | | Where the login secret is kept. The password itself is never stored here |
| `schedule_cron` | text | Yes | When it runs. Default: every night at 2:00 |
| `is_simulated` | yes/no | Yes | "Yes" for a demo connector with fake data, so its figures are never shown as real |
| `is_active` | yes/no | Yes | "No" to pause it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `plan_data_sources`: where each license's data comes from

For each license: where purchases, holders, usage, and bills come from. For example, E3 holders come from the Graph connector, so Staff cannot type them by hand; Visio holders come from a CSV file. Only one source per kind of data, so two sources never overwrite each other.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `data_type` | choice | Yes | Which data: `entitlement` (purchases), `assignment` (holders), `usage`, `expense` (bills) |
| `source_type` | choice | Yes | Where it comes from: `api`, `log`, `import`, `manual` |
| `connector_id` | link → `connectors` | | The connector, when the source is `api` or `log` |
| `external_ref` | text | | The license's code at the vendor, such as Microsoft's skuId |
| `granularity` | choice: `per_subject`, `aggregate` | | For usage only: known per person, or only as a total. With totals only, seats show as "Not monitored" |
| `monitoring_since` | date | Yes | First day this source sent data. A seat is called inactive only after 60 days of watching |
| `data_as_of` | date | | For holders or usage typed or imported by Staff: the day they last confirmed the data is up to date. After 35 days without confirmation the data counts as stale |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `sync_runs`: connector runs

The log of each connector run: when it ran, for which day's data, and whether it worked.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `connector_id` | link → `connectors` | Yes | The connector that ran |
| `trigger` | choice | Yes | `scheduled` (nightly), `manual` (started by hand), `backfill` (loading past history on the first connection) |
| `status` | choice | Yes | `running`, `success`, `partial` (some licenses failed; see `collection_coverage`), `failed` (nothing written) |
| `data_date` | date | Yes | The day the fetched figures describe. Vendor reports usually lag 1–2 days |
| `window_start`, `window_end` | date-time | | The time range read, for connectors that read only what is new since last time |
| `error_message` | text | | Why the whole run failed, such as "invalid credentials". Only filled when status is `failed` |
| `started_at` | date-time | Yes | Start |
| `finished_at` | date-time | | End. Empty while running |

### `collection_coverage`: did we get everything?

For each license, kind of data, and day: was the data complete? This stops the classic mistake of reading a failed sync as "nobody used it". Days that are not complete are never used to flag waste.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `data_type` | choice | Yes | Which data: purchases, holders, usage, or bills |
| `data_date` | date | Yes | The day |
| `status` | choice | Yes | `complete`, `partial` (some missing), `failed` (nothing) |
| `sync_run_id` | link → `sync_runs` | | The run that wrote this day. Empty for data typed or imported by Staff, checked by a nightly job instead |
| `error_code` | text | | Why it is not complete, such as `permission_denied`, `anonymized_report`, `stale_manual_data` |
| `error_message` | text | | The vendor's own message for this license, such as "Insufficient privileges to access reports" |
| `collected_at` | date-time | Yes | When it was recorded |

### `raw_records`: what the vendor sent

Exactly what the vendor's API returned, before ELMS reshapes it. Kept for 180 days, so figures can be recomputed when a rule changes without asking the vendor again.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `sync_run_id` | link → `sync_runs` | Yes | The run that fetched it |
| `record_type` | text | Yes | What kind of object, such as `subscribedSku`, `user`, `activeUserDetail` |
| `external_id` | text | | Its id at the vendor |
| `payload` | JSON | Yes | The data exactly as received |
| `fetched_at` | date-time | Yes | When it was received |
| `normalized_at` | date-time | | When ELMS processed it. Empty = not processed yet |
| `normalize_error` | text | | Why ELMS could not use it, such as `unmapped_sku` (a Microsoft SKU not yet linked to any license in ELMS). Empty = used successfully |

### `files`: uploaded files

Contract scans and amendments, invoices, and CSV files. The file itself is kept in file storage; this table describes it.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `storage_key` | text | Yes | Where the file is kept in file storage |
| `original_name` | text | Yes | File name as uploaded |
| `content_type` | text | Yes | File type, such as PDF, image, CSV |
| `size_bytes` | number | Yes | Size. At most 10 MB |
| `checksum` | text | Yes | Fingerprint of the content, to make sure an import uses exactly the file that was previewed |
| `contract_id` | link → `contracts` | | The contract this file belongs to, if it is a contract document |
| `uploaded_by` | link → `user_accounts` | | Who uploaded it |
| `uploaded_at` | date-time | Yes | When |

### `import_batches`: CSV uploads

Each CSV upload: who, when, which file, and how many rows. Nothing is written until the preview is checked and confirmed; one bad row rejects the whole file.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `import_type` | choice | Yes | What the file contains: `entitlement` (purchases), `assignment` (holders), `usage`, `expense` (bills), `employee` (HR staff list) |
| `license_plan_id` | link → `license_plans` | | The license, for holder and usage files |
| `file_id` | link → `files` | Yes | The uploaded file |
| `status` | choice | Yes | `previewed` (checked, nothing written), `confirmed` (written), `rejected` (has errors) |
| `rows_total` | number | Yes | Rows in the file |
| `rows_added` | number | Yes | New rows written |
| `rows_updated` | number | Yes | Existing rows changed |
| `rows_rejected` | number | Yes | Rows with errors |
| `error_report` | JSON | | Which rows were wrong and why |
| `imported_by` | link → `user_accounts` | Yes | Who uploaded it |
| `created_at` | date-time | Yes | Upload time |
| `confirmed_at` | date-time | | When it was confirmed |

---

## 4. Holders and usage

### `subjects`: identities at a vendor

Who or what uses a license on the vendor's side: a user account, a device, a project, or an API key. Kept apart from `employees` because some identities match no employee (shared mailbox, server, API key).

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `vendor_id` | link → `vendors` | Yes | The vendor it lives at, such as Microsoft |
| `subject_type` | choice | Yes | `user`, `device`, `project`, `api_key`, `other` |
| `identifier` | text | Yes | How the vendor names it, in lowercase: email, device name, project name, key label |
| `external_id` | text | | The vendor's permanent id. Keeps the same identity when a user is renamed |
| `display_name` | text | | Name shown when it matches no employee |
| `employee_id` | link → `employees` | | The employee it belongs to, matched by email (or confirmed by Staff). Empty = not matched, shown with "Unknown department" |
| `org_unit_id` | link → `org_units` | | Department of a non-person identity, such as a project or API key |
| `is_enabled` | yes/no | | Whether the account is still enabled at the vendor. "No" while it still holds a seat = waste. Empty = unknown |
| `source` | choice | Yes | Where it came from |
| `sync_run_id`, `import_batch_id` | link | | Connector run or CSV import that last wrote it |
| `first_seen_at` | date-time | Yes | First time ELMS saw it. An identity deleted at the vendor ends its seats at the next sync |

### `license_assignments`: who holds what

One identity holding one license, for example "An has held an E3 seat since 3 March and was last active 2 days ago". Ended rows stay for history. From the last activity ELMS works out the seat status: **Active** (used in the last 60 days), **Inactive** (not used for 60 days), **No activity** (never used), or **Not monitored** (nobody can tell).

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `subject_id` | link → `subjects` | Yes | Who holds it |
| `assigned_on` | date | | Day the seat was given, as reported by the vendor or Staff. When unknown, the day ELMS first saw the seat (`created_at`) is used |
| `ended_on` | date | | Day the seat was taken back. Empty = still held |
| `last_active_at` | date-time | | Last time the person used the license. Empty = no use recorded |
| `activity_checked_on` | date | | For data typed by Staff: the day they checked this seat's activity. Empty and no `last_active_at` = never checked, so "Not monitored" rather than "No activity" |
| `source` | choice | Yes | Where it came from |
| `sync_run_id`, `import_batch_id` | link | | Connector run or CSV import that last wrote it |
| `entered_by` | link → `user_accounts` | | Staff who typed it, for manual rows |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `usage_records`: usage per period

Usage that is not "one person, one seat": peak sessions of a CAD license, tokens used through an API, cores deployed on servers, or the number of active users when only a total is known. One figure per period, such as per day or per month.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `subject_id` | link → `subjects` | | Whose usage. Empty = total for the whole license |
| `metric` | choice | Yes | What is measured: `active_subjects` (active users), `peak_concurrent` (most sessions at once), `consumption` (tokens, requests, GB), `deployed_units` (cores, servers) |
| `period_start` | date | Yes | First day of the period |
| `period_end` | date | Yes | Last day of the period |
| `quantity` | quantity | Yes | The figure |
| `source` | choice | Yes | Where it came from |
| `sync_run_id`, `import_batch_id` | link | | Connector run or CSV import that last wrote it |
| `entered_by` | link → `user_accounts` | | Staff who typed it, for manual rows |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `plan_daily_snapshots`: daily photo of each license

Every day ELMS writes down how many of each license were purchased and what it costs per month. Vendors keep no history, so without these photos there would be no trends and no cost for past months. A photo is never changed afterwards.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `snapshot_date` | date | Yes | The day |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `purchased_qty` | quantity | | Total purchased that day. Empty = unknown, or unlimited |
| `is_unlimited` | yes/no | Yes | "Yes" when an unlimited purchase was valid that day |
| `effective_monthly_cost` | money | | What the license costs per month at the prices of that day, in VND. Empty = price or exchange rate unknown |
| `created_at` | date-time | Yes | When the photo was taken |

### `plan_unit_daily_snapshots`: daily photo per department

The same daily photo, per department: how many seats are held and how many are active, inactive, never used, or not monitored. It keeps the department of that day, so a person moving to another team does not change last month's figures.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `snapshot_date` | date | Yes | The day |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `org_unit_id` | link → `org_units` | | The department. Empty = holders with "Unknown department" |
| `active_count` | number | Yes | Seats used in the last 60 days |
| `inactive_count` | number | Yes | Seats not used for 60 days |
| `no_activity_count` | number | Yes | Seats never used |
| `not_monitored_count` | number | Yes | Seats where nobody can tell. Seats held (Assigned) = the four counts added up |
| `used_qty` | quantity | | For licenses that are not seats: the department's share of usage (tokens, peak sessions …) |
| `created_at` | date-time | Yes | When the photo was taken |

---

## 5. Budget, cost, and expenses

### `budget_plans`: yearly budgets

A unit's license budget for one year, for example "IT, 2027: 2 billion VND". It is a draft until the Manager activates it; only active budgets count.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `org_unit_id` | link → `org_units` | Yes | The unit. One budget per unit per year |
| `fiscal_year` | number | Yes | The year |
| `budget_amount` | money | Yes | Total budget, in VND |
| `note` | text | | Free notes |
| `activated_at` | date-time | | When it was activated. Empty = still a draft |
| `activated_by` | link → `user_accounts` | | Who activated it |
| `created_by` | link → `user_accounts` | Yes | Manager who created it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `budget_plan_lines`: what the budget is for

The budget line by line: "40 E3 seats, 450 million VND". These are the "Planned" figures compared with what was purchased, held, used, and paid.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `budget_plan_id` | link → `budget_plans` | Yes | The budget |
| `license_plan_id` | link → `license_plans` | Yes | The license planned |
| `planned_quantity` | quantity | Yes | How many |
| `planned_cost` | money | Yes | How much, in VND. ELMS suggests quantity × current yearly price |
| `note` | text | | Free notes |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `cost_allocations`: who carries the cost

Each month ELMS spreads the cost of each license over the departments whose people hold it. Seats nobody holds go to "Unallocated", holders without a department to "Unknown department"; all shares add up to the license's cost. When the month closes the figures are frozen.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `accounting_period_id` | link → `accounting_periods` | Yes | The month |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `bucket` | choice | Yes | Who gets this share: `unit` (a department or P&L), `unallocated`, `unknown_department` |
| `org_unit_id` | link → `org_units` | | The department, when `bucket` is `unit` |
| `method` | choice | Yes | How it was split: `per_seat` (by seats held), `per_usage` (by usage), `direct` (the bill names the unit), `none` (could not be split) |
| `basis_qty` | quantity | | What the share is based on: average seats or usage of the department that month. Explains "why Sales pays 30" |
| `amount` | money | | The share, in VND. Empty = unknown (price, rate, or seat data missing) |
| `computed_at` | date-time | Yes | Last computed |

### `expenses`: invoices and charges

What the bills say, on their dates. Compared with the allocated cost, and the real cost of pay-as-you-go licenses.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `expense_date` | date | Yes | Invoice or charge date. Decides which month it belongs to |
| `service_month` | date | | The month a pay-as-you-go bill pays for, when it is not the month of the bill: a bill dated October for September usage has September here and counts in September |
| `amount` | money | Yes | Amount. Negative only for a correction |
| `currency` | text | Yes | Currency |
| `license_plan_id` | link → `license_plans` | Yes | The license billed |
| `org_unit_id` | link → `org_units` | | The unit that pays. Required for bills typed or imported by Staff |
| `description` | text | | Description |
| `invoice_file_id` | link → `files` | | Scan of the invoice |
| `source` | choice | Yes | Where it came from |
| `external_ref` | text | | The bill's id at the vendor, so a re-run never adds it twice |
| `sync_run_id`, `import_batch_id` | link | | Connector run or CSV import that last wrote it |
| `created_by` | link → `user_accounts` | | Staff who entered it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `accounting_periods`: months

The calendar months and whether each one is closed. A closed month can no longer be edited; a mistake is fixed with a correcting entry in an open month. A month closes by itself on the 10th of the next month.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `fiscal_year` | number | Yes | Budget year the month belongs to |
| `period_year` | number | Yes | Calendar year |
| `period_month` | number | Yes | Month, 1 to 12 |
| `closed_at` | date-time | | When it was closed. Empty = still open |
| `closed_by` | link → `user_accounts` | | Who closed it. Empty = closed automatically |

### `exchange_rates`: currency rates

The rates used to turn USD and other currencies into VND. A rate is valid from its date until a newer one is entered.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `from_currency` | text | Yes | Currency converted to VND, such as `USD` |
| `rate` | number | Yes | 1 unit of `from_currency` = this many VND, such as 25,400 |
| `effective_from` | date | Yes | First day the rate applies |
| `declared_by` | link → `user_accounts` | | Who entered it |
| `created_at` | date-time | Yes | When it was entered |

---

## 6. Optimization

### `detection_runs`: daily checks

Each daily run of the waste and compliance checks. It keeps the threshold and rule version used, so an old result can still be explained after the rules change.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `data_date` | date | Yes | The day of data checked |
| `inactivity_threshold_days` | number | Yes | Days without use that counted as inactive (60) |
| `rule_version` | text | Yes | Version of the check rules, such as "2026.11" |
| `status` | choice | Yes | `running`, `success`, `partial`, `failed`. Screens show the latest successful run |
| `started_at` | date-time | Yes | Start |
| `finished_at` | date-time | | End |

### `detection_results`: what the checks found

One finding per license, unit, and check: seats nobody holds, seats unused for 60 days, seats of people who have left, or use above what was bought. When data is missing the answer is "Not evaluated", never a false "all fine".

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `detection_run_id` | link → `detection_runs` | Yes | The run |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `org_unit_id` | link → `org_units` | | The unit the finding belongs to. Empty = holders with "Unknown department" |
| `check_type` | choice | Yes | `unused` (seats nobody holds), `inactive` (seats not used), `overuse` (more used than bought), `leaver` (seats of people who left or disabled accounts) |
| `flagged_qty` | quantity | | How many: unheld seats, unused seats, or the excess. It also gives the verdict: empty = not evaluated, 0 = nothing found, more than 0 = flagged |
| `monthly_cost` | money | | What the flagged quantity costs per month, in VND |
| `flagged_since` | date | | First day of the current run of flagged days ("Since" on screens) |
| `created_at` | date-time | Yes | When it was found |

### `recommendations`: proposed actions

A proposed action such as "cut 20 E3 seats, saving about 220 million VND a year", with its evidence and its decision. ELMS never carries it out at the vendor; people do.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `target_plan_id` | link → `license_plans` | | For a downgrade: the cheaper license to move to, such as E3 → E1 |
| `org_unit_id` | link → `org_units` | | The unit concerned. Empty = holders with "Unknown department" |
| `detection_result_id` | link → `detection_results` | | The finding it came from. Empty when created by hand |
| `type` | choice | Yes | `reduce_seats`, `downgrade_plan`, `cancel`, `reassign` |
| `title` | text | Yes | Short text shown in the list |
| `description` | text | | Details |
| `evidence` | JSON | Yes | The figures that justified it, frozen when it was created |
| `affected_qty` | quantity | | How many seats or units are concerned |
| `estimated_yearly_saving` | money | | Expected saving per year, in VND. Empty = unknown (price not known) |
| `actual_saving` | money | | Saving actually achieved, in VND, required when marked done |
| `status` | choice | Yes | `proposed` → `accepted` or `rejected` → `done` |
| `rejection_reason` | text | | Why it was rejected, required for a rejection |
| `contract_id` | link → `contracts` | | The contract that decides when it can be done. The last day to tell the vendor is worked out from it, so a corrected renewal date shows at once. Empty = can be done any time |
| `due_date` | date | | Internal deadline for the owner. Not the vendor's notice deadline |
| `owner_id` | link → `user_accounts` | | Who is in charge of it |
| `created_by` | link → `user_accounts` | Yes | Who proposed it |
| `decided_by` | link → `user_accounts` | | Who accepted or rejected it |
| `decided_at` | date-time | | When |
| `done_at` | date-time | | When it was carried out |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

---

## 7. Audit

### `audit_logs`: history of changes

Who changed what, when, the old and new value, and why. Rows can only be added, never edited or deleted.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `actor_id` | link → `user_accounts` | | Who made the change. Empty = an automatic job |
| `action` | text | Yes | What was done: create, update, deactivate, role_change, import … |
| `entity_type` | text | Yes | Which table was changed |
| `entity_id` | number | Yes | Which row of that table |
| `old_values` | JSON | | Values before |
| `new_values` | JSON | | Values after |
| `reason` | text | | Why, required for some changes (active budget, permission, correcting a connector value) |
| `correlation_id` | text | | Groups the changes made by one action or one connector run |
| `ip_address` | text | | Network address the change came from |
| `occurred_at` | date-time | Yes | When |

### `data_overrides`: corrections to connector figures

When Staff correct a figure that came from a connector, for example a seat count the API reports wrongly. The original value stays beside the correction, and the next sync does not overwrite it.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `entity_type` | text | Yes | Table of the corrected row: `entitlement_lines` or `expenses` |
| `entity_id` | number | Yes | The corrected row |
| `field_name` | text | Yes | The corrected field, such as `quantity` |
| `original_value` | text | | What the connector says. Each sync keeps it up to date |
| `override_value` | text | Yes | The value Staff entered |
| `reason` | text | Yes | Why, required |
| `overridden_by` | link → `user_accounts` | Yes | Who corrected it |
| `overridden_at` | date-time | Yes | When |
| `reverted_at` | date-time | | When the correction was removed and the connector value used again. Empty = still in force |

**Related:** [Database design](README.md) · [`elms.dbml`](elms.dbml) · [Use cases](../02-use-cases.md)
