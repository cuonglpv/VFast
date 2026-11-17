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
| `created_by`, `paused_by`, `uploaded_by` … | The user who did it |
| `is_active` | No longer used when "No". Rows are switched off instead of deleted, so history stays intact |
| `source` | Where the data came from: `api` or `log` (a connector, ILVG, or BCA). Holders and usage always come from a connector, so their tables have no `source`, only `sync_run_id`. A purchase (PO line, invoice) has no `source` either: it came from the SAP file when `import_batch_id` is set, and was typed by Staff when `created_by` is set |
| `sync_run_id`, `import_batch_id` | The connector run or file import that last wrote the row, so every figure can be traced back |
| `currency` | Three-letter currency code next to an amount from outside (invoice, budget line), such as `USD`. Figures ELMS computes have no currency field: they are always in the reporting currency (VND) |

---

## 1. Organization and access

### `org_units`: the organization tree

The shape of the group in five fixed levels: **group > P&L > block > department > project**, for example the group, the P&L "VinFast", its block "Manufacturing", the department "IT", and the project "MES". Units come from ILVG. Budgets, costs, and what a Manager may see are all counted per unit, and every figure of a unit is the sum of the units under it.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `parent_id` | link → `org_units` | | The unit one level up. Empty only for the group |
| `level` | choice: `group`, `pnl`, `block`, `department`, `project` | Yes | The level of the unit. There is exactly one group |
| `code` | text | Yes | The unit code from ILVG, unique. The budget file and the connectors name units by this code |
| `name` | text | Yes | Unit name. Two units under the same parent cannot share a name |
| `is_active` | yes/no | Yes | "No" for a unit that no longer exists. When ILVG stops reporting a unit, the sync sets "No" even if people, budget lines, or licenses remain, and Admin sees the unit in a list to move them. Admin cannot set "No" on such a unit by hand |
| `sync_run_id` | link → `sync_runs` | | The ILVG run that last updated the unit |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `employees`: staff list

Everyone who works in the group, whether or not they log in to ELMS, loaded from ILVG. It tells ELMS which unit a person is in, so when Microsoft reports that `an@company.com` holds an E3 seat, the cost of that seat goes to An's unit. Which licenses a person holds is in `license_assignments` (through their identities in `subjects`), and how often they use each one is in `usage_records`.

ILVG gives no transfer date. Every day ELMS writes down the unit of each seat holder (`plan_unit_daily_snapshots`), so after a transfer the cost counts toward the new unit from the day ELMS receives it, and the days before stay with the old unit.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `employee_code` | text | | ILVG employee id. Stays the same when the email changes; it joins ILVG, BCA, and the accounts at each provider |
| `full_name` | text | Yes | Name shown on screens |
| `email` | text | Yes | Current company email, in lowercase; also the login email |
| `org_unit_id` | link → `org_units` | | The unit of the person's position, from ILVG: their department, or their block or P&L when the position is not in a department. Never a project: projects are in `project_ids`. Empty = "Unknown unit" |
| `project_ids` | list of links → `org_units` | | The projects the person works on, from ILVG, one or more. A seat they hold counts toward each project in equal parts — one project, the whole seat; two projects, half each — and nothing toward `org_unit_id`. Empty = no project: the seat counts toward `org_unit_id` |
| `left_on` | date | | Last working day, from ILVG. Empty = still with the company. After this day the account is disabled and any seat they still hold is flagged |
| `source` | choice | Yes | Always `api`: employees come only from ILVG |
| `sync_run_id` | link → `sync_runs` | Yes | ILVG run that last updated the person |
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

Every feature that can be switched on for a role, once for reading and once for editing, such as "connectors – read" and "connectors – write".

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `feature_code` | text | Yes | The code of the feature, such as `123FV@`, not its name. The name shown is in `description` |
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

The people who can log in: one row per person, kept as long as the person has an account — not one row per login. Each account belongs to one employee and has exactly one role. Each login opens a row in `user_sessions`; setting or resetting a password uses the link fields below.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `employee_id` | link → `employees` | Yes | The person. One person has at most one login; the login email is their company email |
| `role_id` | link → `roles` | Yes | Their role |
| `password_hash` | text | | The password, scrambled so nobody can read it. Empty until the user sets one: they cannot log in yet |
| `password_token_hash` | text | | The one-time link, sent by email, that a new user opens to set their password (or to reset a forgotten one), stored scrambled. Empty when no link is open |
| `password_token_expires_at` | date-time | | When that link stops working |
| `failed_login_count` | number | Yes | Wrong passwords in a row. Back to 0 after a successful login. Counted on the server, never in the browser: someone guessing passwords calls the API directly, so a count in the browser would not stop them |
| `locked_until` | date-time | | After 5 wrong passwords in a row, login is blocked until this time (15 minutes) |
| `last_login_at` | date-time | | Last successful login, shown in the user list |
| `disabled_at` | date-time | | When Admin, or the ILVG sync for a leaver, disabled the login. Empty = active. A disabled login cannot sign in, and open sessions end at once. The account stays, so its history in `audit_logs` still names the person |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `user_sessions`: who is logged in

One row per open login session. Sessions are kept on the server so that disabling an account logs the person out immediately: logging out, disabling the account, or changing its role deletes the row.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `user_account_id` | link → `user_accounts` | Yes | Whose session. On every request ELMS finds the session, then checks that this account is still enabled and reads its role |
| `token_hash` | text | Yes | The session key kept in the browser cookie, stored scrambled. On each request ELMS scrambles the cookie value the same way and looks for this row; a database leak gives nobody a usable key |
| `created_at` | date-time | Yes | Login time |
| `expires_at` | date-time | Yes | When the session ends on its own; after it the user logs in again. Expired rows are deleted by a daily job |

### `user_org_units`: what a Manager or Staff member may see

Which units a Manager is responsible for, and which companies a Staff member works on (formerly `manager_org_units`). A Manager can be given any unit, the whole group included, and sees it with everything under it. A Staff member is given P&Ls, or the group for group-level Staff, who see every company and keep the software catalog and the shared licenses. Admin and Employee have no rows.

It is not taken from `employees.org_unit_id`, because what a person looks after is not the unit they work in: a finance director who sits in the group's Finance department may manage P&L A and P&L B, and a Staff member of the group may work on three companies. `employees.org_unit_id` is one unit and decides where their own seats are charged; this table can hold several units and decides what they see.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `user_account_id` | link → `user_accounts` | Yes | The Manager or Staff member |
| `org_unit_id` | link → `org_units` | Yes | A unit they look after (Manager) or a company they work on (Staff) |

---

## 2. Software catalog and licenses

### `vendors`: providers

The providers licenses come from, such as Microsoft, Atlassian, Adobe, or OpenAI. A usage connector reads one provider for one company. A provider is the same whether its licenses are paid per seat or as you go: how a license is paid is on its PO lines (`entitlement_lines.commercial_term`).

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `code` | text | Yes | Short code of the provider, unique, such as `MSFT`, `ATLASSIAN` |
| `name` | text | Yes | Provider name, unique |
| `kind` | choice: `publisher`, `reseller` | Yes | `publisher` makes the software. `reseller` is not used |
| `website` | text | | Website |
| `support_contact` | text | | Who to call for support: name, email, phone |
| `is_active` | yes/no | Yes | "No" for a provider no longer used |
| `created_by` | link → `user_accounts` | | Staff who added it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `software_categories`: catalog folders

Categories of the software catalog, one level, kept by group-level Staff (UC02), for example "Productivity", "Design", "Development". A category in use cannot be deleted.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `name` | text | Yes | Name, unique |

### `software_products`: software of the catalog

A software of the catalog, such as "Microsoft 365" or "Jira" (UC02). Each license name a connector reports is mapped to one software, so "M365 E3" of one company and "Microsoft 365 E3" of another are counted together under the same software and category.

The figures of a software are not stored here: its seats Active, Inactive, No activity, and Not monitored, per unit and day, are the sum over its licenses of `plan_unit_daily_snapshots`.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `vendor_id` | link → `vendors` | Yes | The provider |
| `category_id` | link → `software_categories` | | Its category. Empty = "Uncategorized" |
| `name` | text | Yes | Software name |
| `description` | text | | Short description |
| `is_active` | yes/no | Yes | "No" for a software no longer used. A software with licenses mapped to it is merged into another, never deleted |
| `created_by` | link → `user_accounts` | | Staff who added it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `license_plans`: licenses

One license a connector reports for its company, such as "Microsoft 365 E3" of company A. This is what the rest of the docs call **a license**. Staff declare it when they create the connector; it is *Pending* until the first sync. It stays the same across renewals, so holders, usage, budgets, PO lines, and invoices keep their history. Budget lines and PO lines find it by its name in SAP among the licenses of their P&L and the shared licenses.

The figures of a license are kept elsewhere, by day:

| What | Where |
|---|---|
| Who holds it | `license_assignments` |
| Seats Active, Inactive, No activity, Not monitored, per unit (P&L, block, department, project) | `plan_unit_daily_snapshots`; a P&L adds up the units under it |
| How often each holder uses it | `usage_records`, metric `active_days`; per unit, the holders of that unit added up |
| Purchased quantity | `plan_daily_snapshots` |
| License type (monthly, yearly, pay-as-you-go …) | `commercial_term` of its PO line in force (`entitlement_lines`) |

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `connector_id` | link → `connectors` | Yes | The connector that reports it, and so its company and provider |
| `external_name` | text | Yes | The name as the source gives it (or as Staff typed it before the first sync). One name per connector |
| `external_ref` | text | | The license's id at the source, such as Microsoft's skuId. Empty until the first sync |
| `sap_name` | text | | The name SAP files use for it, when SAP names it differently from the connector. Example: P&L A's own GitHub is *GitHub Enterprise A* in SAP because the shared one is *GitHub Enterprise*. Empty = the connector's name |
| `product_id` | link → `software_products` | | The software it maps to in the catalog. Empty = "Not mapped", shown under "Uncategorized" |
| `archetype` | choice | Yes | How use is counted: `allocation` (seats), `concurrent` (sessions at once), `metered` (tokens, requests, GB), `capacity` (cores, servers) |
| `unit` | text | Yes | What is counted: seat, device, slot, token, core … |
| `owner_org_unit_id` | link → `org_units` | Yes | The owner: the P&L of the connector, or the group for a license shared by two or more companies. The owner carries the seats nobody holds and plans the license |
| `last_sync_run_id` | link → `sync_runs` | | The latest successful run that brought data for this license. It gives the license's connector status. Empty = no data yet (*Pending*) |
| `usage_granularity` | choice: `per_subject`, `aggregate` | | How the connector gives usage: per holder, or only as a total (such as "120 active users this month"). Empty = no usage source. With totals only or no source, seats are *Not monitored* and never counted as waste |
| `has_daily_activity` | yes/no | | For usage per holder: "Yes" when the source gives the days each person was active, so days used can be counted (6 / 22); "No" when it gives only the last activity date, so status works but days used is *Not tracked* |
| `monitoring_since` | date | | First day the connector sent usage for this license. A seat is called inactive only after 30 days of watching: connected on 1 March → nobody is inactive before 31 March. Empty = no usage yet |
| `is_active` | yes/no | Yes | "No" when the connector no longer reports it or was deleted |
| `created_by` | link → `user_accounts` | | Staff who declared it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `entitlement_lines`: PO lines (license terms)

One PO line of a license, imported each month from the SAP purchase file or typed by Staff for a purchase made outside SAP, for example "PO 4500012345 item 10: 500 GitHub Enterprise seats from 1 Mar 2027 to 29 Feb 2028". A renewal or an extra purchase is a new line under the same license. "Purchased" quantity on screens is the total of the lines valid that day; the end of the term is the expiry, which drives the License List and its timeline. Connectors no longer report quantities or terms.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `license_plan_id` | link → `license_plans` | Yes | The license, found by its name in SAP |
| `org_unit_id` | link → `org_units` | Yes | The company that issued the PO, or bought outside SAP: a P&L or the group. It stays the same if the license later becomes shared or stops being shared |
| `quantity` | quantity | | How many were bought: seats, slots, tokens, cores … Empty = unknown; always empty for `pay_as_you_go`, which has no limit |
| `valid_from` | date | Yes | Start of the term on the PO line. From this day the line counts in "Purchased" |
| `valid_to` | date | | End of the term on the PO line: the expiry. Empty = no end |
| `commercial_term` | choice | Yes | How it is paid, from the length of the term: `monthly`, `yearly`, `multi_year`, `perpetual`, `prepaid_credit`, `pay_as_you_go`. A `pay_as_you_go` line has no limit, so it can never be over-allocated |
| `external_ref` | text | | PO number and item, such as `4500012345/10`, so a re-import updates the line instead of adding one. Empty for a line typed by Staff |
| `pr_number` | text | | The purchase requisition the PO came from. Shown, not used in figures |
| `import_batch_id` | link → `import_batches` | | The SAP import that last wrote it. Empty = typed by Staff |
| `created_by` | link → `user_accounts` | | Staff who typed it. Empty = imported from SAP |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

`valid_from` and `valid_to` are needed because a license is bought again and again: the term says which PO lines count on a given day. They give the "Purchased" quantity of each day (the lines valid that day), the expiry shown in the License List, the commercial term, and the period an invoice is spread over when the invoice gives none. Example: 500 seats from 1 Mar 2027 to 29 Feb 2028, then a renewal of 600 from 1 Mar 2028 → Purchased is 500 on 15 Feb 2028 and 600 on 15 Mar 2028.

The price on the PO is not kept. The money figure "Purchased" is the accrued cost of the invoices (`expenses`, `cost_allocations`), and so is the monthly cost of the License List (UC01, UC04). The cost of one seat is that monthly cost divided by the seats of the license — the larger of purchased and given — for example 100 million for 500 seats = 200,000 a seat a month.

---

## 3. Collection pipeline

### `connectors`: connections to the sources

A configured, read-only connection. A **usage connector** reads one provider for one company — for example "VinFast – Microsoft Usage" — and returns its licenses, holders, and usage (UC10). ILVG (employees and units) and BCA (application usage) are connectors too, so every source is watched the same way (UC10). ELMS never changes anything at a source.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `kind` | choice: `usage`, `ilvg`, `bca` | Yes | What it reads |
| `org_unit_id` | link → `org_units` | | The company of a usage connector: a P&L, or the group for a group contract. Empty for ILVG and BCA |
| `vendor_id` | link → `vendors` | | The provider of a usage connector. One usage connector per company and provider |
| `name` | text | Yes | Generated name, "<Company> – <Provider> Usage", unique |
| `connector_type` | text | Yes | Which program runs it, such as `generic_rest`, `ms_graph`, `ilvg`, `bca` |
| `api_url` | text | Yes | Full HTTPS address of the API the P&L provides for its own data, such as `https://api.company.com/v1/usage` |
| `auth_type` | choice: `api_key`, `bearer_token` | Yes | How it signs in |
| `credentials_ref` | text | Yes | Where the API key or token is kept: a reference to the secret store, such as `vault:connectors/42`. At each run the worker reads the secret through it to call the API. The secret itself is never stored here, shown, exported, or logged |
| `contact_name` | text | | The person at the company who answers for its API, called when runs fail or the data looks wrong. Required for a usage connector |
| `contact_email` | text | | Email of that person. Staff can search connectors by it. Required for a usage connector |
| `sync_interval_hours` | number | Yes | How often it runs, typed freely by Staff in hours (at least 1). Default 6 |
| `reconfigured_at` | date-time | Yes | Last change of company, provider, authentication, or API URL. From that moment every license of the connector is *Pending* again |
| `paused_at` | date-time | | When Staff paused it. Empty = running. While paused, each scheduled run is recorded with status `paused` |
| `paused_by` | link → `user_accounts` | | Who paused it |
| `is_active` | yes/no | Yes | "No" once Staff delete it: no more runs, its licenses become inactive, and the data already collected stays. A new connector for the same company and provider can then be created |
| `created_by` | link → `user_accounts` | | Staff who created it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

The status of each license of a connector is worked out, not stored, from the runs of the connector and the license's `last_sync_run_id`: *Paused* while the connector is paused; *Pending* while no run since `reconfigured_at` has brought data for it, which includes a license added to a running connector; *Failed* when the latest run failed; *Delayed* when its latest data is older than the interval, which includes a license the latest runs brought nothing for; *Active* otherwise. *Sync issues* = Delayed + Failed.

### `sync_runs`: connector runs

The log of each connector run: when it ran, for which day's data, and whether it worked. It is the run table of UC10.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `connector_id` | link → `connectors` | Yes | The connector that ran |
| `trigger` | choice | Yes | `scheduled` (at its interval), `manual` (run now, or rerun a period), `backfill` (loading past history on the first connection) |
| `status` | choice | Yes | `running`, `success`, `failed` (nothing written), `paused` (the connector is paused: nothing read) |
| `data_date` | date | Yes | The day the fetched figures describe. A rerun of the same day replaces its figures, never duplicates them |
| `window_start`, `window_end` | date-time | | The time range read, for connectors that read only what is new since last time |
| `error_message` | text | | Why the run failed, such as "invalid credentials". Only filled when status is `failed` |
| `started_at` | date-time | Yes | Start |
| `finished_at` | date-time | | End. Empty while running; the same as the start for a paused run |

A day of a connector counts as complete when a run for that day succeeded. A day without one is *Unknown*: it is never read as "nobody used it", and it is never used to flag waste. The data lake cleans the data before ELMS reads it, so ELMS does not track gaps inside one license.

### `raw_records`: records read from the data lake

Connectors push what they collect to a data lake, which cleans it before ELMS reads it. This table keeps the cleaned records as ELMS read them, before they are written to the other tables — not the raw data of the provider. Kept for 180 days, so figures can be recomputed when a rule changes without reading the data lake again.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `sync_run_id` | link → `sync_runs` | Yes | The run that fetched it |
| `record_type` | text | Yes | What kind of record, as in the license data contract: `license`, `holder`, `usage` |
| `external_id` | text | | Its id at the source, such as the license id or the holder's account |
| `payload` | JSON | Yes | The cleaned record as the data lake delivered it |
| `fetched_at` | date-time | Yes | When ELMS read it |
| `normalized_at` | date-time | | When ELMS processed it. Empty = not processed yet |
| `normalize_error` | text | | Why ELMS could not use it, such as `undeclared_license` (a license the source reports but the connector does not list) or `missing_field`. Empty = used successfully. These are the rejected records Staff see in UC10 |

### `files`: uploaded files

Invoices typed by Staff, budget plan Excel files, and SAP purchase Excel files. The file itself is kept in file storage; this table describes it.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `storage_key` | text | Yes | Where the file is kept in file storage, such as `imports/2027/03/7f3a….xlsx`. The file itself is not in the database |
| `original_name` | text | Yes | File name as uploaded, such as `SAP_PO_2027-03.xlsx`, shown in the import history |
| `content_type` | text | Yes | File type, such as PDF, image, Excel, CSV. Checked from the content, not from the name |
| `size_bytes` | number | Yes | Size. At most 10 MB |
| `checksum` | text | Yes | Fingerprint of the content, so the import history can show the same file uploaded again. Whether a budget file changes anything is decided by its preview |
| `uploaded_by` | link → `user_accounts` | | Who uploaded it |
| `uploaded_at` | date-time | Yes | When |

### `import_batches`: file imports

Each import of a budget plan (UC04) or of SAP purchases (UC04): who, when, which file, and how many rows. A confirmed budget import is also a **version of the plan** of its target unit, for example "P&L A, 2027, January–December, version 3": it holds only the lines it added or replaced, it is never edited, and earlier versions are kept for comparison. Nothing is written until the preview is checked and confirmed; one bad row rejects the whole file. A budget import has a target unit and months, and changes only the licenses in its file: in that unit and every unit under it, for those months, a license already planned is overwritten (its lines the file no longer has are removed) and a new one is added. Every other license keeps its plan. Example: the group imports a file with only GitHub rows for P&L A and P&L B; their Microsoft 365 and Jira plans do not change. A purchase import adds or updates PO lines and invoices by their SAP numbers, so the same file twice adds nothing.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `import_type` | choice: `budget`, `purchase` | Yes | What the file contains: the budget plan (Manager), or PO lines and invoices from SAP (Staff) |
| `file_id` | link → `files` | Yes | The uploaded file |
| `target_org_unit_id` | link → `org_units` | | Budget only: the unit the Manager chose. The file changes the licenses it names in this unit and every unit under it, and nowhere else. Example: target Block A1 → the other blocks of P&L A keep their plan |
| `period_from`, `period_to` | date | | Budget only: first and last month the file covers, such as January to December 2027 |
| `preview_key` | text | Yes | A unique key given to each preview. *Confirm* sends it back, so pressing *Confirm* twice, or again after a time-out, applies the import once |
| `based_on_import_id` | link → `import_batches` | | Budget only: the latest confirmed budget import, of any unit, when the preview was made. If an import confirmed since then changed a line this file would change — at the same unit, above, or below — the confirm is refused: "The plan changed since your preview" |
| `version_no` | number | | Budget only: the version of the target unit's plan this import became once confirmed: 1, 2, 3 … per target unit. Empty while previewed, and when rejected or unchanged |
| `note` | text | | Budget only: free notes of the Manager on the version |
| `status` | choice | Yes | `previewed` (checked, nothing written yet), `confirmed` (written), `rejected` (at least one row has an error: nothing written), `unchanged` (the file changes nothing, for example the same file again: nothing written) |
| `rows_total` | number | Yes | Rows in the file |
| `rows_added` | number | Yes | Rows that add a line: a budget line, PO line, or invoice ELMS did not have |
| `rows_updated` | number | Yes | Rows that replace an existing line with another quantity, amount, or currency |
| `rows_removed` | number | Yes | Budget only: lines of the file's licenses, in the target and under it, that the file no longer has. Always 0 for a purchase import |
| `rows_rejected` | number | Yes | Rows with errors. More than 0 = the whole file is rejected |
| `error_report` | JSON | | Which rows were wrong and why, such as `[{"row": 12, "error": "Unit B9 not in the hierarchy"}]`, shown in the preview |
| `imported_by` | link → `user_accounts` | Yes | Who uploaded it |
| `created_at` | date-time | Yes | Upload time, when the preview was made |
| `confirmed_at` | date-time | | When it was confirmed. Empty until then |

---

## 4. Holders and usage

### `subjects`: accounts at a provider

The accounts that hold licenses on the provider's side: people, and also shared mailboxes, service accounts, devices, and API keys, which are not people. Each account belongs to the connector (company tenant) that reports it, so the same email in the tenants of two companies is two accounts.

A person is always an ILVG employee: a person the source reports whose employee code and email are not in ILVG does not exist for ELMS, and the record is rejected (`unknown_employee`, shown to Staff in UC10). One employee can have several accounts — an old and a new email, or accounts in two companies — and all of them count as the same person.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `connector_id` | link → `connectors` | Yes | The connector (company tenant) the account lives at |
| `holder_type` | choice: `person`, `shared`, `service`, `device`, `api_key` | Yes | What the account is. A `shared` mailbox or `service` account is judged as a whole: used by anyone in the last 30 days = Active. It is listed apart, never as an inactive person |
| `identifier` | text | Yes | How the provider names it, in lowercase: email, mailbox, device name, key label. Unique per connector, so each sync updates the same account |
| `employee_id` | link → `employees` | | The person, matched by ILVG employee code, otherwise by email. Set only for a `person`, and always set for one |
| `org_unit_id` | link → `org_units` | | The unit that owns an account that is not a person — mailbox, service account, device, key — and carries its cost. Empty for a person, whose unit is in `employees`; empty for the others = "Unknown unit" |
| `sync_run_id` | link → `sync_runs` | Yes | Connector run that last wrote it |

### `license_assignments`: who holds what

One identity holding one license, for example "An has held an E3 seat since 3 March and was last active 2 days ago". Ended rows stay for history. From the last activity ELMS works out the seat status over the last 30 days: **Active** (used in the last 30 days, or given less than 30 days ago and not used yet), **Inactive** (used before, not in the last 30 days), **No activity** (never used, held 30 days or more), or **Not monitored** (no usage source). How often the person uses it is shown as days used against working days, for example 6 / 22, from the active days in `usage_records`; *Not tracked* when the source gives only the last activity date.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `subject_id` | link → `subjects` | Yes | Who holds it |
| `assigned_on` | date | | Day the seat was given, as reported by the provider. When unknown, the day ELMS first saw the seat (`created_at`) is used |
| `ended_on` | date | | Day the seat was taken back. Empty = still held |
| `last_active_at` | date-time | | Last time the license was used. Empty = no use recorded |
| `sync_run_id` | link → `sync_runs` | Yes | Connector run that last wrote it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `usage_records`: usage per period

Usage per period: the days each holder was active (for the usage frequency), peak sessions of a CAD license, tokens used through an API, cores deployed on servers, or the number of active users when only a total is known. One figure per period, such as per day or per month.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `subject_id` | link → `subjects` | | Whose usage. Empty = total for the whole license |
| `metric` | choice | Yes | What is measured: `active_days` (days a holder was active, for days used), `active_subjects` (active users, total only), `peak_concurrent` (most sessions at once), `consumption` (tokens, requests, GB), `deployed_units` (cores, servers) |
| `period_start` | date | Yes | First day of the period |
| `period_end` | date | Yes | Last day of the period |
| `quantity` | quantity | Yes | The figure |
| `sync_run_id` | link → `sync_runs` | Yes | Connector run that last wrote it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `plan_daily_snapshots`: daily photo of each license

Every day ELMS writes down how many of each license were purchased. A new SAP import or an edit overwrites the quantity of a PO line, so without these photos there would be no trends. A photo is never changed afterwards. The money figure "Purchased" is the accrued cost in `cost_allocations`.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `snapshot_date` | date | Yes | The day |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `purchased_qty` | quantity | | Total purchased that day. Empty = unknown, or no limit |
| `is_unlimited` | yes/no | Yes | "Yes" when a `pay_as_you_go` PO line was valid that day: there is no limit |
| `created_at` | date-time | Yes | When the photo was taken |

### `plan_unit_daily_snapshots`: daily photo per unit

The same daily photo, per unit: how many seats are held, and in which status. Seats are counted as shares: a person on two projects counts half a seat in each, so the units always add up. It keeps the unit of that day, so a person moving to another team does not change last month's figures. The photos of every day of a month are the seat basis of that month's cost split, day by day; the seat counts shown for a month are those of its last day.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `snapshot_date` | date | Yes | The day |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `org_unit_id` | link → `org_units` | | The unit of the holders, at any level. Empty = "Unknown unit" |
| `active_qty` | quantity | Yes | Seats used in the last 30 days (new seats in their first 30 days included) |
| `inactive_qty` | quantity | Yes | Seats not used for 30 days |
| `no_activity_qty` | quantity | Yes | Seats never used |
| `not_monitored_qty` | quantity | Yes | Seats with no usage source. Seats held = these four added up |
| `shared_service_qty` | quantity | Yes | Of those seats, the ones held by shared mailboxes and service accounts, listed apart |
| `used_qty` | quantity | | For usage-based licenses: the unit's share of consumption (tokens, requests …) |
| `created_at` | date-time | Yes | When the photo was taken |

### `employee_app_usage`: applications employees use (BCA)

What BCA reports from company machines: which application each person used, day by day. One row = one person used one application on one day, so days used in a period is the number of rows and the last use is the latest day. Kept in its own table, apart from the license usage, so other services can use it later (BR-21). Only the Managers of the person's units can read it (UC03).

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `employee_id` | link → `employees` | Yes | The person BCA reports, matched by ILVG employee code, otherwise by email. A person not in ILVG is rejected |
| `application_name` | text | Yes | The application as BCA names it |
| `usage_date` | date | Yes | The day it was used |
| `active_minutes` | number | | Minutes the application was in use that day. Empty = unknown |
| `product_id` | link → `software_products` | | The catalog software the application maps to, set by Staff in the catalog (UC02). Empty = not mapped |
| `sync_run_id` | link → `sync_runs` | Yes | BCA run that wrote it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

A person whose machine does not report to BCA has no row: "Not tracked", never "not used". BCA reports per day the domain account of the user — which carries the ILVG employee code — and each application with its active minutes; the person is matched by employee code, otherwise by email.

---

## 5. Budget, cost, and expenses

### `budget_plan_lines`: the plan, line by line

One line per unit, license, and month: "Block A1, Microsoft 365 E3, March 2027: 40 seats, 45 million VND". These are the **Plan** figures compared with Purchased and Used. A line belongs to the deepest unit it names, so a unit's Plan is its own lines plus those of the units under it, and no line is counted twice. A newer import does not delete old lines: it marks them as replaced. P&L Managers can change or add the lines of a shared license for their own units. The file has no *Shared* column: a line plans a share when its license is a shared one. If a P&L has its own "Microsoft 365 E3" and also a share of the group's shared "Microsoft 365 E3", Staff give its own license another name in SAP (`license_plans.sap_name`), otherwise its lines match two licenses and are rejected.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `import_batch_id` | link → `import_batches` | Yes | The budget import (version) that wrote the line |
| `org_unit_id` | link → `org_units` | Yes | The unit planned: group, P&L, block, department, or project. A shared license is planned by the group per P&L, or deeper; a group line plans the seats the group keeps free |
| `license_name` | text | Yes | The license as written in the file |
| `license_plan_id` | link → `license_plans` | | The license the name matches, by its name in SAP, among the licenses of the unit's P&L and the shared licenses. Empty = "Not mapped". A name that matches two licenses is rejected in the preview |
| `month` | date | Yes | First day of the month planned |
| `planned_quantity` | quantity | Yes | How many |
| `planned_amount` | money | Yes | How much |
| `currency` | text | Yes | Currency of the amount |
| `superseded_by_import_id` | link → `import_batches` | | The later budget import that replaced or removed the line; when is its `confirmed_at`. Empty = the line is in force |

### `cost_allocations`: who carries the cost, and how much of it is used

Each month ELMS takes the accrued cost of each license (**Purchased**) and spreads it over its seats **day by day**: each day carries the month's cost divided by its days, shared by the seats of that day. Each unit carries the seats its people hold; seats nobody holds go to **Unallocated** under the owner (the P&L, or the group for a shared license); holders that cannot be placed go to **Unknown unit**. Each share is split into **Used**, **Wasted**, and **Not evaluated**. Example: 100 seats for 100 million, 60 Active, 25 Inactive, 15 Not monitored all month → Used 60, Wasted 25, Not evaluated 15; waste rate 25 %, so the unit is red (above 20 %).

- **Transfer:** An moves from IT to Sales on 15 March → IT carries his seat for 14 days, Sales for 17.
- **More seats given than bought:** 100 bought, 110 given → the cost spreads over the 110 seats and nothing is Unallocated.
- **A day without complete data** takes the seats of the nearest complete day of the same month, counted in `filled_days`. The cost of a day that cannot be split — Purchased quantity unknown, or no complete day in the whole month — is **Not evaluated** under the owner.

When the month closes the figures are frozen.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `accounting_period_id` | link → `accounting_periods` | Yes | The month, of the company that owned the license when the month was computed. A closed month keeps it if the license later becomes shared or stops being shared |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `bucket` | choice | Yes | Who gets this share: `unit` (the unit of the holders), `unallocated` (seats nobody holds, and cost that could not be split), `unknown_unit` (holders that cannot be placed) |
| `org_unit_id` | link → `org_units` | Yes | The unit of the holders; for `unallocated` and `unknown_unit`, the owner of the license |
| `method` | choice | Yes | How it was split: `per_seat` (by seats held), `per_usage` (by consumption), `direct` (the bill names the unit), `none` (could not be split) |
| `basis_qty` | quantity | | What the share is based on: average seats held over the month (seat-days ÷ days of the month), or consumption. Explains "why Sales pays 30" |
| `filled_days` | number | | Split by seats: days of the month whose seats were taken from the nearest complete day because their data was incomplete. 0 = every day had its own data. Empty for the other methods |
| `used_amount` | money | | Part of the share for seats in use (Active) or consumption. The share of Purchased is `used_amount` + `wasted_amount` + `not_evaluated_amount`, in VND; all three empty = unknown |
| `wasted_amount` | money | | Part for Inactive and No activity seats; all of an Unallocated share |
| `not_evaluated_amount` | money | | Part for seats that cannot be judged: Not monitored, or data Unknown. Never counted as used or wasted |
| `computed_at` | date-time | Yes | Last computed |

The shares of a shared license are its charge-back: each company carries the seats its people hold.

### `expenses`: invoices

The invoices from the SAP purchase file, each paying a PO line, and those Staff type for a purchase made outside SAP: what the bills say, on their dates, and the cost that the monthly accrual spreads (UC04). An invoice of 100 million for a 12-month term becomes 8,333,000 a month, rounded to the thousand VND, and 8,337,000 in the last month, so the months always add up to the invoice. An amount in USD is converted with the rate of the invoice date. A PO line without an invoice yet counts its seats, but its cost stays unknown.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `expense_date` | date | Yes | Invoice date. Decides which month it belongs to and the exchange rate |
| `service_from`, `service_to` | date | | The period the invoice pays for. Empty = the term of its PO line, or only the month of the invoice when it has none |
| `amount` | money | Yes | Amount. Negative only for a credit note or a correction |
| `currency` | text | Yes | Currency |
| `license_plan_id` | link → `license_plans` | Yes | The license billed: the license of its PO line |
| `entitlement_line_id` | link → `entitlement_lines` | | The PO line it pays. Empty only for an invoice typed by Staff without a PO |
| `org_unit_id` | link → `org_units` | Yes | The company that pays. It stays the same if the license later becomes shared or stops being shared |
| `description` | text | | Description |
| `invoice_file_id` | link → `files` | | Scan of an invoice typed by Staff |
| `accrual_schedule` | JSON | | The amount spread month by month over the term, such as `{"2026-01": 10000000, …}`. Months already closed never change |
| `external_ref` | text | | Invoice number and line in SAP, such as `5105600123/1`, so a re-import never adds it twice. Empty for an invoice typed by Staff |
| `import_batch_id` | link → `import_batches` | | The SAP import that last wrote it. Empty = typed by Staff |
| `created_by` | link → `user_accounts` | | Staff who typed it. Empty = imported from SAP |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `accounting_periods`: months of each company

The months of each company (and of the group, for shared licenses) and whether each one is closed. Staff close a month after checking its accrual (UC04); otherwise it closes by itself on the 10th of the next month. Until then its figures are marked *Provisional*. A P&L month that carries the cost of a shared license stays *Provisional* until the group's month is closed too. A closed month can no longer be edited; a mistake is fixed with a correcting entry in an open month. The fiscal year is the calendar year.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `org_unit_id` | link → `org_units` | Yes | The company: a P&L, or the group |
| `month` | date | Yes | First day of the month, such as 1 March 2027. Its year is the fiscal year |
| `closed_at` | date-time | | When it was closed. Empty = still open (Provisional) |
| `closed_by` | link → `user_accounts` | | Who closed it. Empty = closed automatically |

### `exchange_rates`: currency rates

The rates used to turn USD and other currencies into VND, entered by group-level Staff (UC04). A rate is valid from its date until a newer one is entered; an invoice is converted with the rate of its date.

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

Each daily run of the waste checks. It keeps the version of the rules used, thresholds included, so an old result can still be explained after the rules change.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `data_date` | date | Yes | The day of data checked |
| `rule_version` | text | Yes | Version of the check rules, such as "2026.11". The thresholds are part of it (30 days without use = inactive): changing a threshold makes a new version |
| `status` | choice | Yes | `running`, `success`, `failed`. Screens show the latest successful run |
| `started_at` | date-time | Yes | Start |
| `finished_at` | date-time | | End |

### `detection_results`: what the checks found

One finding per license, unit, and check: seats nobody holds, seats unused for 30 days, seats of people who have left, or more seats given than bought. When data is missing the answer is "Not evaluated", never a false "all fine".

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `detection_run_id` | link → `detection_runs` | Yes | The run |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `org_unit_id` | link → `org_units` | | The unit the finding belongs to: the owner for seats nobody holds, the holders' unit otherwise. Empty = holders with "Unknown unit" |
| `check_type` | choice | Yes | `unused` (seats nobody holds), `inactive` (seats not used for 30 days), `overuse` (more given than bought), `leaver` (seats of people who left) |
| `flagged_qty` | quantity | | How many. It also gives the verdict: empty = not evaluated, 0 = nothing found, more than 0 = flagged |
| `monthly_cost` | money | | What the flagged seats cost per month, in VND: the license's accrued cost of the month ÷ its seats (the larger of purchased and given) × `flagged_qty`. Empty = unknown, such as no invoice yet |
| `flagged_since` | date | | First day of the current run of flagged days |

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
| `reason` | text | | Why, required for some changes (permission, correcting a unit) |
| `correlation_id` | text | | Groups the changes made by one action or one connector run |
| `ip_address` | text | | Network address the change came from |
| `occurred_at` | date-time | Yes | When |

### `data_overrides`: corrections to ILVG data

When Admin corrects a value that came from ILVG, for example a unit placed under the wrong parent (UC09). The original value stays beside the correction, and the next ILVG sync does not overwrite it. Licenses, holders, and usage are never corrected in ELMS: they are corrected at the source.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `org_unit_id` | link → `org_units` | Yes | The corrected unit |
| `field_name` | text | Yes | The corrected field, such as `parent_id` |
| `original_value` | text | | What ILVG says. Each sync keeps it up to date |
| `override_value` | text | Yes | The value Admin entered |
| `reason` | text | Yes | Why, required |
| `overridden_by` | link → `user_accounts` | Yes | Who corrected it |
| `overridden_at` | date-time | Yes | When |
| `reverted_at` | date-time | | When the correction was removed and the ILVG value used again. Empty = still in force |

**Related:** [Database design](README.md) · [`elms.dbml`](elms.dbml) · [Use cases](../02-use-cases.md)
