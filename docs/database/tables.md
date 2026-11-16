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
| `source` | Where the data came from: `api` or `log` (a connector, ILVG, or BCA), `import` (a file: budget plan, or purchases from SAP), `manual` (typed by Staff: purchases made outside SAP). Licenses, holders, and usage always come from a connector |
| `sync_run_id`, `import_batch_id` | The connector run or file import that last wrote the row, so every figure can be traced back |
| `currency` | Three-letter currency code next to an amount from outside (price, invoice, budget line), such as `USD`. Figures ELMS computes have no currency field: they are always in the reporting currency (VND) |

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

Everyone who works in the group, whether or not they log in to ELMS, loaded from ILVG. It tells ELMS which unit a person is in, so when Microsoft reports that `an@company.com` holds an E3 seat, the cost of that seat goes to An's unit.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `employee_code` | text | | ILVG employee id. Stays the same when the email changes; it joins ILVG, BCA, and the accounts at each provider |
| `full_name` | text | Yes | Name shown on screens |
| `email` | text | Yes | Current company email, in lowercase; also the login email |
| `org_unit_id` | link → `org_units` | | Current unit, at any level. Empty = "Unknown unit" |
| `unit_since` | date | | Day the person joined that unit. After a transfer, usage and cost count toward the old unit before this day and the new unit from it, day by day. A transfer ILVG reports late counts from the day ELMS receives it |
| `project_ids` | list of links → `org_units` | | The projects the person works on, when more than one. A seat they hold counts toward each project in equal parts: two projects, half each, and nothing toward `org_unit_id`. Empty = only `org_unit_id` |
| `left_on` | date | | Last working day. Empty = still with the company. After this day the account is disabled and any seat they still hold is flagged |
| `source` | choice | Yes | `api` (ILVG) or `manual` (created with an account by Admin before ILVG knows the person) |
| `sync_run_id` | link → `sync_runs` | | ILVG run that last updated the person |
| `import_batch_id` | link → `import_batches` | | Not used since the HR file import was retired |
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
| `feature_code` | text | Yes | The feature, such as `license_list`, `usage`, `budget_plan`, `connectors`, `software_catalog` |
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

### `user_org_units`: what a Manager or Staff member may see

Which units a Manager is responsible for, and which companies a Staff member works on (formerly `manager_org_units`). A Manager can be given any unit, the whole group included, and sees it with everything under it. A Staff member is given P&Ls, or the group for group-level Staff, who see every company and keep the software catalog and the shared licenses. Admin and Employee have no rows.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `user_account_id` | link → `user_accounts` | Yes | The Manager or Staff member |
| `org_unit_id` | link → `org_units` | Yes | A unit they look after (Manager) or a company they work on (Staff) |

---

## 2. Software catalog and licenses

### `vendors`: providers

The providers licenses come from, such as Microsoft, Atlassian, or Adobe. A usage connector reads one provider for one company.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `name` | text | Yes | Provider name, unique |
| `kind` | choice: `publisher`, `reseller` | Yes | `publisher` makes the software. `reseller` was used for contracts, which are retired |
| `website` | text | | Website |
| `support_contact` | text | | Who to call for support: name, email, phone |
| `is_active` | yes/no | Yes | "No" for a provider no longer used |
| `created_by` | link → `user_accounts` | | Staff who added it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `software_categories`: catalog folders

Categories and subcategories of the software catalog, kept by group-level Staff (UC01), for example "Productivity" › "Office & Collaboration". A category in use cannot be deleted.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `parent_id` | link → `software_categories` | | The category a subcategory sits in. Empty for a top-level category |
| `name` | text | Yes | Name |

### `software_products`: software of the catalog

A software of the catalog, such as "Microsoft 365" or "Jira" (UC01). Each license name a connector reports is mapped to one software, so "M365 E3" of one company and "Microsoft 365 E3" of another are counted together under the same software and category.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `vendor_id` | link → `vendors` | Yes | The provider |
| `category_id` | link → `software_categories` | | Its category or subcategory. Empty = "Uncategorized" |
| `name` | text | Yes | Software name |
| `description` | text | | Short description |
| `is_active` | yes/no | Yes | "No" for a software no longer used. A software with licenses mapped to it is merged into another, never deleted |
| `created_by` | link → `user_accounts` | | Staff who added it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `product_links`: useful links

Handy links of a software: admin portal, terms of service, license policy. Not used by the agreed use cases; kept for later.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `product_id` | link → `software_products` | Yes | The product |
| `label` | text | Yes | Text shown, such as "Admin portal" |
| `url` | text | Yes | The address |

### `license_plans`: licenses

One license a connector reports for its company, such as "Microsoft 365 E3" of company A. This is what the rest of the docs call **a license**. Staff declare it when they create the connector; it is *Pending* until the first sync. It stays the same across renewals, so holders, usage, budgets, PO lines, and invoices keep their history. Budget lines and PO lines find it by its name in SAP among the licenses of their P&L and the shared licenses.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `connector_id` | link → `connectors` | Yes | The connector that reports it, and so its company and provider |
| `external_name` | text | Yes | The name as the source gives it (or as Staff typed it before the first sync). One name per connector |
| `external_ref` | text | | The license's id at the source, such as Microsoft's skuId. Empty until the first sync |
| `sap_name` | text | | The name SAP files use for it, when SAP names it differently from the connector. Example: P&L A's own GitHub is *GitHub Enterprise A* in SAP because the shared one is *GitHub Enterprise*. Empty = the connector's name |
| `product_id` | link → `software_products` | | The software it maps to in the catalog. Empty = "Not mapped", shown under "Uncategorized" |
| `license_type` | choice: `monthly`, `yearly`, `usage_based` | | As the source reports it. Empty until the first sync |
| `archetype` | choice | Yes | How use is counted: `allocation` (seats), `concurrent` (sessions at once), `metered` (tokens, requests, GB), `capacity` (cores, servers) |
| `unit` | text | Yes | What is counted: seat, device, slot, token, core … |
| `owner_org_unit_id` | link → `org_units` | Yes | The owner: the P&L of the connector, or the group for a license shared by two or more companies. The owner carries the seats nobody holds and plans the license |
| `duplicate_of_id` | link → `license_plans` | | Set when the same license is reported by two connectors and Staff chose the other one as the source; this row is then counted nowhere |
| `is_active` | yes/no | Yes | "No" when the connector no longer reports it or was deleted |
| `created_by` | link → `user_accounts` | | Staff who declared it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `contracts`: signed agreements (retired)

Retired: contracts are no longer entered in ELMS. The license terms of UC04 (start, expiry, quantity, cost) come from the PO lines in SAP and are kept in `entitlement_lines`. The table and its fields stay as they were and are not written.

### `entitlement_lines`: PO lines (license terms)

One PO line of a license, imported each month from the SAP purchase file or typed by Staff for a purchase made outside SAP, for example "PO 4500012345 item 10: 500 GitHub Enterprise seats from 1 Mar 2027 to 29 Feb 2028". A renewal or an extra purchase is a new line under the same license. "Purchased" quantity on screens is the total of the lines valid that day; the end of the term is the expiry, which drives the License List and its timeline. Connectors no longer report quantities or terms.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `license_plan_id` | link → `license_plans` | Yes | The license, found by its name in SAP |
| `org_unit_id` | link → `org_units` | Yes | The company that issued the PO, or bought outside SAP: a P&L or the group. It stays the same if the license later becomes shared or stops being shared |
| `contract_id` | link → `contracts` | | Retired; always empty |
| `quantity` | quantity | | How many were bought: seats, slots, tokens, cores … Empty = unknown, or unlimited |
| `is_unlimited` | yes/no | Yes | "Yes" when there is no limit (usage-based pay-as-you-go). Such a line can never be over-allocated |
| `valid_from` | date | Yes | Start of the term on the PO line |
| `valid_to` | date | | End of the term on the PO line: the expiry. Empty = no end |
| `auto_renew` | yes/no | | Not in SAP; shown as "—" |
| `commercial_term` | choice | Yes | How it is paid, from the length of the term: `monthly`, `yearly`, `multi_year`, `perpetual`, `prepaid_credit`, `pay_as_you_go` |
| `unit_price` | money | | Net price on the PO line for the period of the term. Empty = unknown |
| `price_per_qty` | quantity | Yes | How many units that price is for: 1 for a seat, 1,000,000 for "2.50 USD per 1 million tokens". Default 1 |
| `currency` | text | Yes | Currency of the price |
| `source` | choice | Yes | `import` (SAP purchase file) or `manual` (typed by Staff) |
| `external_ref` | text | | PO number and item, such as `4500012345/10`, so a re-import updates the line instead of adding one. Empty for a line typed by Staff |
| `pr_number` | text | | The purchase requisition the PO came from. Shown, not used in figures |
| `import_batch_id` | link → `import_batches` | | The import that last wrote it |
| `created_by` | link → `user_accounts` | | Staff who typed it; empty for imported lines |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

The money figure "Purchased" is not this price: it is the accrued cost of the invoices (`expenses`, `cost_allocations`). The monthly cost of the License List is the accrued cost too (UC57, UC42).

### `entitlement_allocations`: quotas per unit (retired)

Retired: quotas per unit are not part of the agreed use cases; the cost of a license goes to the units of the people who hold its seats. The table stays as it was and is not written.

---

## 3. Collection pipeline

### `connectors`: connections to the sources

A configured, read-only connection. A **usage connector** reads one provider for one company — for example "VinFast – Microsoft Usage" — and returns its licenses, holders, and usage (UC55). ILVG (employees and units) and BCA (application usage) are connectors too, so every source is watched the same way (UC26). ELMS never changes anything at a source.

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
| `credentials_ref` | text | Yes | Where the key or token is kept. The secret itself is never stored, shown, exported, or logged |
| `contact_name` | text | | API contact of the company. Required for a usage connector |
| `contact_email` | text | | Email of the API contact. Required for a usage connector |
| `sync_interval_hours` | number | Yes | How often it runs, typed freely by Staff in hours (at least 1). Default 6 |
| `reconfigured_at` | date-time | Yes | Last change of company, provider, authentication, or API URL. From that moment every license of the connector is *Pending* again |
| `paused_at` | date-time | | When Staff paused it. Empty = running. While paused, each scheduled run is recorded with status `paused` |
| `paused_by` | link → `user_accounts` | | Who paused it |
| `is_simulated` | yes/no | Yes | "Yes" for a demo connector with fake data, so its figures are labelled as mock |
| `is_active` | yes/no | Yes | "No" once Staff delete it: no more runs, its licenses become inactive, and the data already collected stays. A new connector for the same company and provider can then be created |
| `created_by` | link → `user_accounts` | | Staff who created it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

The status of each license of a connector is worked out, not stored, from what the runs since `reconfigured_at` brought for that license (`collection_coverage`): *Paused* while the connector is paused; *Pending* while no data has come for it yet, which includes a license added to a running connector; *Failed* when the latest run failed as a whole or failed for this license; *Delayed* when its latest data is older than the interval; *Active* otherwise. *Sync issues* = Delayed + Failed.

### `plan_data_sources`: what each license's connector delivers

For each license: which kinds of data its connector delivers — purchases, holders, usage — and how. Licenses, holders, and usage always come from the connector; nobody types them.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `data_type` | choice | Yes | Which data: `assignment` (holders), `usage`. `entitlement` (terms) and `expense` (bills) are no longer read from connectors: they come from SAP |
| `source_type` | choice | Yes | `api` or `log` |
| `external_ref` | text | | The license's code in this kind of data, when it differs from `license_plans.external_ref`, such as the product name a usage report uses. Empty = the same. The connector is the license's own (`license_plans.connector_id`) |
| `granularity` | choice: `per_subject`, `aggregate` | | For usage only: known per person, or only as a total. With totals only, seats show as "Not monitored" |
| `has_daily_activity` | yes/no | | For usage per person: "Yes" when the source gives activity day by day, so days used can be counted; "No" when it gives only the last activity date, so days used is "Not tracked" |
| `monitoring_since` | date | Yes | First day this source sent data. A seat is called inactive only after 30 days of watching |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `sync_runs`: connector runs

The log of each connector run: when it ran, for which day's data, and whether it worked. It is the run table of UC26.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `connector_id` | link → `connectors` | Yes | The connector that ran |
| `trigger` | choice | Yes | `scheduled` (at its interval), `manual` (run now, or rerun a period), `backfill` (loading past history on the first connection) |
| `status` | choice | Yes | `running`, `success`, `partial` (some licenses failed; see `collection_coverage`), `failed` (nothing written), `paused` (the connector is paused: nothing read) |
| `data_date` | date | Yes | The day the fetched figures describe. A rerun of the same day replaces its figures, never duplicates them |
| `window_start`, `window_end` | date-time | | The time range read, for connectors that read only what is new since last time |
| `error_message` | text | | Why the whole run failed, such as "invalid credentials". Only filled when status is `failed` |
| `started_at` | date-time | Yes | Start |
| `finished_at` | date-time | | End. Empty while running; the same as the start for a paused run |

### `collection_coverage`: did we get everything?

For each license, kind of data, and day: was the data complete? This stops the classic mistake of reading a failed sync as "nobody used it". Days that are not complete are never used to flag waste.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `data_type` | choice | Yes | Which data: terms, holders, usage, or bills |
| `data_date` | date | Yes | The day |
| `status` | choice | Yes | `complete`, `partial` (some missing), `failed` (nothing) |
| `sync_run_id` | link → `sync_runs` | Yes | The run that wrote this day |
| `error_code` | text | | Why it is not complete, such as `permission_denied`, `anonymized_report`, `contract_violation` (records that failed the license data contract) |
| `error_message` | text | | The provider's own message for this license, such as "Insufficient privileges to access reports" |
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
| `normalize_error` | text | | Why ELMS could not use it, such as `undeclared_license` (a license the source reports but the connector does not list) or `missing_field`. Empty = used successfully. These are the rejected records Staff see in UC26 |

### `files`: uploaded files

Invoices typed by Staff, budget plan Excel files, and SAP purchase Excel files. The file itself is kept in file storage; this table describes it.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `storage_key` | text | Yes | Where the file is kept in file storage |
| `original_name` | text | Yes | File name as uploaded |
| `content_type` | text | Yes | File type, such as PDF, image, Excel, CSV |
| `size_bytes` | number | Yes | Size. At most 10 MB |
| `checksum` | text | Yes | Fingerprint of the content, so the import history can show the same file uploaded again. Whether a budget file changes anything is decided by its preview |
| `contract_id` | link → `contracts` | | Retired; always empty |
| `uploaded_by` | link → `user_accounts` | | Who uploaded it |
| `uploaded_at` | date-time | Yes | When |

### `import_batches`: file imports

Each import of a budget plan (UC33) or of SAP purchases (UC07): who, when, which file, and how many rows. Nothing is written until the preview is checked and confirmed; one bad row rejects the whole file. A budget import has a target unit and months, and changes only the licenses in its file: in that unit and every unit under it, for those months, a license already planned is overwritten (its lines the file no longer has are removed) and a new one is added. Every other license keeps its plan. Example: the group imports a file with only GitHub rows for P&L A and P&L B; their Microsoft 365 and Jira plans do not change. A purchase import adds or updates PO lines and invoices by their SAP numbers, so the same file twice adds nothing.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `import_type` | choice: `budget`, `purchase` | Yes | What the file contains: the budget plan, or PO lines and invoices from SAP |
| `file_id` | link → `files` | Yes | The uploaded file |
| `target_org_unit_id` | link → `org_units` | | Budget: the unit where, with every unit under it, the file changes the licenses it names |
| `period_from`, `period_to` | date | | Budget: first and last month the file covers |
| `preview_key` | text | Yes | A unique key per preview. Pressing *Confirm* twice, or again after a time-out, applies the import once |
| `based_on_budget_plan_id` | link → `budget_plans` | | Budget: the latest plan version of any unit when the preview was made. If another import changed a line this file would change since then — at the same unit, above, or below — the confirm is refused: "The plan changed since your preview" |
| `budget_plan_id` | link → `budget_plans` | | Budget: the version this import created |
| `status` | choice | Yes | `previewed` (checked, nothing written), `confirmed` (written), `rejected` (has errors), `unchanged` (the file changes nothing, for example the same file again: nothing to do) |
| `rows_total` | number | Yes | Rows in the file |
| `rows_added` | number | Yes | New rows |
| `rows_updated` | number | Yes | Rows that replace an existing line with another quantity, amount, or currency |
| `rows_removed` | number | Yes | Budget: lines of the file's licenses, in the target and under it, that the file no longer has |
| `rows_rejected` | number | Yes | Rows with errors |
| `error_report` | JSON | | Which rows were wrong and why |
| `imported_by` | link → `user_accounts` | Yes | Who uploaded it |
| `created_at` | date-time | Yes | Upload time |
| `confirmed_at` | date-time | | When it was confirmed |

---

## 4. Holders and usage

### `subjects`: identities at a provider

Who or what holds a license on the provider's side: a user account, a shared mailbox, a device, a project, or an API key. Each identity belongs to the connector (company tenant) that reports it. Kept apart from `employees` because some identities match no employee. One employee can have several identities over time — an old and a new email, or accounts in two companies — and all of them count as the same person.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `connector_id` | link → `connectors` | Yes | The connector it was reported by |
| `subject_type` | choice | Yes | `user`, `device`, `project`, `api_key`, `other` |
| `account_type` | choice: `personal`, `shared`, `service` | Yes | A person, a group mailbox, or a service account. A shared or service account is judged as a whole: used by anyone in the last 30 days = Active. It is listed apart, never as an inactive person |
| `identifier` | text | Yes | How the provider names it, in lowercase: email, device name, project name, key label |
| `external_id` | text | | The provider's permanent id. Keeps the same identity when a user is renamed |
| `display_name` | text | | Name shown when it matches no employee |
| `employee_id` | link → `employees` | | The person, matched by ILVG employee id or email. Empty = "Unknown employee" |
| `org_unit_id` | link → `org_units` | | The unit that owns a shared or service account, a project, or a key |
| `is_enabled` | yes/no | | Whether the account is still enabled at the provider. "No" while it still holds a seat = flagged. Empty = unknown |
| `source` | choice | Yes | Always a connector |
| `sync_run_id`, `import_batch_id` | link | | Connector run that last wrote it |
| `first_seen_at` | date-time | Yes | First time ELMS saw it |

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
| `source` | choice | Yes | Always a connector |
| `sync_run_id`, `import_batch_id` | link | | Connector run that last wrote it |
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
| `source` | choice | Yes | Always a connector |
| `sync_run_id`, `import_batch_id` | link | | Connector run that last wrote it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `plan_daily_snapshots`: daily photo of each license

Every day ELMS writes down how many of each license were purchased and its list cost per month. A new SAP import or an edit overwrites the quantity of a PO line, so without these photos there would be no trends. A photo is never changed afterwards. The money figure "Purchased" is the accrued cost in `cost_allocations`, not this list cost.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `snapshot_date` | date | Yes | The day |
| `license_plan_id` | link → `license_plans` | Yes | The license |
| `purchased_qty` | quantity | | Total purchased that day. Empty = unknown, or unlimited |
| `is_unlimited` | yes/no | Yes | "Yes" when an unlimited purchase was valid that day |
| `effective_monthly_cost` | money | | List cost of a month at the PO prices of that day, in VND. Empty = price or exchange rate unknown |
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

What BCA reports from company machines: which application each person used, on how many days. Kept in its own table, apart from the license usage, so other services can use it later (BR-23). Only the Managers of the person's units can read it (UC32).

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `employee_id` | link → `employees` | | The person BCA reports. Empty = BCA identity not matched to an employee yet |
| `bca_identity` | text | Yes | How BCA names the person (machine user or email), in lowercase |
| `application_name` | text | Yes | The application as BCA names it |
| `active_minutes` | number | | Minutes the application was in use in the period |
| `product_id` | link → `software_products` | | The catalog software the application maps to, set by Staff in the catalog (UC01). Empty = not mapped |
| `period_start`, `period_end` | date | Yes | The period |
| `days_used` | number | Yes | Days the application was used in the period |
| `last_used_at` | date-time | | Last use |
| `source` | choice | Yes | Always `api` (BCA) |
| `sync_run_id` | link → `sync_runs` | Yes | BCA run that wrote it |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

A person whose machine does not report to BCA has no row: "Not tracked", never "not used". Until the BCA API is known, ELMS assumes that BCA reports per day the domain account of the user — which carries the ILVG employee code — and each application with its active minutes; the person is matched by employee code, otherwise by email.

---

## 5. Budget, cost, and expenses

### `budget_plans`: budget versions

Each confirmed budget import creates a new version for its target unit and months, for example "P&L A, 2027, January–December, version 3". A version holds only the lines its import added or replaced. A Manager imports for their own unit or any unit under it: the Manager of a P&L can change the plan of the P&L and of each block; the Manager of a block only that block and what is under it. Versions are never edited; earlier ones are kept for comparison.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `org_unit_id` | link → `org_units` | Yes | The target unit of the import |
| `fiscal_year` | number | Yes | The year, which is the calendar year |
| `period_from`, `period_to` | date | Yes | First and last month the import covered |
| `version_no` | number | Yes | 1, 2, 3 … per target unit |
| `note` | text | | Free notes |
| `created_by` | link → `user_accounts` | Yes | Manager who confirmed the import |
| `created_at` | date-time | Yes | When |

### `budget_plan_lines`: the plan, line by line

One line per unit, license, and month: "Block A1, Microsoft 365 E3, March 2027: 40 seats, 45 million VND". These are the **Plan** figures compared with Purchased and Used. A line belongs to the deepest unit it names, so a unit's Plan is its own lines plus those of the units under it, and no line is counted twice. A newer import does not delete old lines: it marks them as replaced. P&L Managers can change or add the lines of a shared license for their own units. The file has no *Shared* column: a line plans a share when its license is a shared one. If a P&L has its own "Microsoft 365 E3" and also a share of the group's shared "Microsoft 365 E3", Staff give its own license another name in SAP (`license_plans.sap_name`), otherwise its lines match two licenses and are rejected.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `budget_plan_id` | link → `budget_plans` | Yes | The version that wrote the line |
| `org_unit_id` | link → `org_units` | Yes | The unit planned: group, P&L, block, department, or project. A shared license is planned by the group per P&L, or deeper; a group line plans the seats the group keeps free |
| `license_name` | text | Yes | The license as written in the file |
| `license_plan_id` | link → `license_plans` | | The license the name matches, by its name in SAP, among the licenses of the unit's P&L and the shared licenses. Empty = "Not mapped". A name that matches two licenses is rejected in the preview |
| `month` | date | Yes | First day of the month planned |
| `planned_quantity` | quantity | Yes | How many |
| `planned_amount` | money | Yes | How much |
| `currency` | text | Yes | Currency of the amount |
| `superseded_at` | date-time | | When a later import replaced the line. Empty = the line is in force |
| `superseded_by_plan_id` | link → `budget_plans` | | The version that replaced it |
| `created_at` | date-time | Yes | When |

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
| `amount` | money | | The share of Purchased, in VND. Empty = unknown |
| `used_amount` | money | | Part of the share for seats in use (Active) or consumption |
| `wasted_amount` | money | | Part for Inactive and No activity seats; all of an Unallocated share |
| `not_evaluated_amount` | money | | Part for seats that cannot be judged: Not monitored, or data Unknown. Never counted as used or wasted |
| `computed_at` | date-time | Yes | Last computed |

The shares of a shared license are its charge-back: each company carries the seats its people hold.

### `expenses`: invoices

The invoices from the SAP purchase file, each paying a PO line, and those Staff type for a purchase made outside SAP: what the bills say, on their dates, and the cost that the monthly accrual spreads (UC42). An invoice of 100 million for a 12-month term becomes 8,333,000 a month, rounded to the thousand VND, and 8,337,000 in the last month, so the months always add up to the invoice. An amount in USD is converted with the rate of the invoice date. A PO line without an invoice yet counts its seats, but its cost stays unknown.

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
| `source` | choice | Yes | `import` (SAP purchase file) or `manual` (typed by Staff) |
| `external_ref` | text | | Invoice number and line in SAP, such as `5105600123/1`, so a re-import never adds it twice. Empty for an invoice typed by Staff |
| `import_batch_id` | link → `import_batches` | | The import that last wrote it |
| `created_by` | link → `user_accounts` | | Staff who typed it; empty for imported invoices |
| `created_at`, `updated_at` | date-time | Yes | Created, last changed |

### `accounting_periods`: months of each company

The months of each company (and of the group, for shared licenses) and whether each one is closed. Staff close a month after checking its accrual (UC42); otherwise it closes by itself on the 10th of the next month. Until then its figures are marked *Provisional*. A P&L month that carries the cost of a shared license stays *Provisional* until the group's month is closed too. A closed month can no longer be edited; a mistake is fixed with a correcting entry in an open month. The fiscal year is the calendar year.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `org_unit_id` | link → `org_units` | Yes | The company: a P&L, or the group |
| `period_year` | number | Yes | Calendar year |
| `period_month` | number | Yes | Month, 1 to 12 |
| `closed_at` | date-time | | When it was closed. Empty = still open (Provisional) |
| `closed_by` | link → `user_accounts` | | Who closed it. Empty = closed automatically |

### `exchange_rates`: currency rates

The rates used to turn USD and other currencies into VND, entered by group-level Staff (UC62). A rate is valid from its date until a newer one is entered; an invoice is converted with the rate of its date.

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

Each daily run of the waste checks. It keeps the threshold and rule version used, so an old result can still be explained after the rules change.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `data_date` | date | Yes | The day of data checked |
| `inactivity_threshold_days` | number | Yes | Days without use that counted as inactive (30) |
| `rule_version` | text | Yes | Version of the check rules, such as "2026.11" |
| `status` | choice | Yes | `running`, `success`, `partial`, `failed`. Screens show the latest successful run |
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
| `check_type` | choice | Yes | `unused` (seats nobody holds), `inactive` (seats not used for 30 days), `overuse` (more given than bought), `leaver` (seats of people who left or of disabled accounts) |
| `flagged_qty` | quantity | | How many. It also gives the verdict: empty = not evaluated, 0 = nothing found, more than 0 = flagged |
| `monthly_cost` | money | | What the flagged seats cost per month, in VND |
| `flagged_since` | date | | First day of the current run of flagged days |
| `created_at` | date-time | Yes | When it was found |

### `recommendations`: proposed actions (retired)

Retired with UC13 and UC14: ELMS no longer tracks actions on licenses. The table and its fields stay as they were and are not written.

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

When Admin corrects a value that came from ILVG, for example a unit placed under the wrong parent (UC20). The original value stays beside the correction, and the next ILVG sync does not overwrite it. Licenses, holders, and usage are never corrected in ELMS: they are corrected at the source.

| Field | Type | Required | Meaning |
|---|---|---|---|
| `id` | number | Yes | Row number |
| `entity_type` | text | Yes | Table of the corrected row: `org_units` |
| `entity_id` | number | Yes | The corrected row |
| `field_name` | text | Yes | The corrected field, such as `parent_id` |
| `original_value` | text | | What ILVG says. Each sync keeps it up to date |
| `override_value` | text | Yes | The value Admin entered |
| `reason` | text | Yes | Why, required |
| `overridden_by` | link → `user_accounts` | Yes | Who corrected it |
| `overridden_at` | date-time | Yes | When |
| `reverted_at` | date-time | | When the correction was removed and the ILVG value used again. Empty = still in force |

**Related:** [Database design](README.md) · [`elms.dbml`](elms.dbml) · [Use cases](../02-use-cases.md)
