# ELMS entity-relationship diagrams (Mermaid)

> Generated from [`elms.dbml`](elms.dbml), which is the source of truth. Do not edit by hand: change the DBML, then regenerate. Design status: **target** (nothing implemented yet).

37 tables in 7 groups. Relationship legend: `||--o{` one-to-many, `||--o|` one-to-one, `|o--` optional parent (nullable foreign key). Enum columns show the enum name as their type; enum values are listed in the DBML. Tables from another group appear as bare boxes so cross-group foreign keys stay visible.

## Contents

- [Organization and access](#organization-and-access) — `org_units`, `employees`, `roles`, `permissions`, `role_permissions`, `user_accounts`, `user_sessions`, `manager_org_units`
- [License catalog](#license-catalog) — `vendors`, `software_categories`, `software_products`, `product_links`, `license_plans`, `contracts`, `entitlement_lines`, `entitlement_allocations`
- [Collection pipeline](#collection-pipeline) — `connectors`, `plan_data_sources`, `sync_runs`, `raw_records`, `files`, `import_batches`
- [Holders and usage](#holders-and-usage) — `subjects`, `license_assignments`, `usage_records`, `plan_daily_snapshots`, `plan_unit_daily_snapshots`
- [Budget and expenses](#budget-and-expenses) — `budget_plans`, `budget_plan_lines`, `expenses`, `accounting_periods`, `exchange_rates`
- [Optimization](#optimization) — `detection_runs`, `detection_results`, `recommendations`
- [Audit](#audit) — `audit_logs`, `data_overrides`

## Organization and access

```mermaid
erDiagram
  org_units {
    bigint id PK
    bigint parent_id FK
    org_unit_type unit_type
    varchar name
    data_source source
    varchar external_ref
    boolean is_active
    timestamptz created_at
    timestamptz updated_at
  }
  employees {
    bigint id PK
    varchar employee_code
    varchar full_name
    varchar email
    bigint org_unit_id FK
    employee_status status
    data_source source
    varchar external_ref
    timestamptz created_at
    timestamptz updated_at
  }
  roles {
    bigint id PK
    varchar code
    varchar name
    text description
  }
  permissions {
    bigint id PK
    varchar feature_code
    permission_action action
    text description
  }
  role_permissions {
    bigint role_id FK
    bigint permission_id FK
    bigint granted_by FK
    timestamptz granted_at
  }
  user_accounts {
    bigint id PK
    bigint employee_id FK
    bigint role_id FK
    varchar password_hash
    int failed_login_count
    timestamptz locked_until
    timestamptz last_login_at
    timestamptz disabled_at
    bigint created_by FK
    timestamptz created_at
    timestamptz updated_at
  }
  user_sessions {
    bigint id PK
    bigint user_account_id FK
    char token_hash
    timestamptz created_at
    timestamptz last_seen_at
    timestamptz expires_at
    timestamptz revoked_at
    varchar ip_address
    text user_agent
  }
  manager_org_units {
    bigint user_account_id FK
    bigint org_unit_id FK
    bigint assigned_by FK
    timestamptz assigned_at
  }
  org_units |o--o{ org_units : "parent_id"
  org_units |o--o{ employees : "org_unit_id"
  roles ||--o{ role_permissions : "role_id"
  permissions ||--o{ role_permissions : "permission_id"
  user_accounts |o--o{ role_permissions : "granted_by"
  employees ||--o| user_accounts : "employee_id"
  roles ||--o{ user_accounts : "role_id"
  user_accounts |o--o{ user_accounts : "created_by"
  user_accounts ||--o{ user_sessions : "user_account_id"
  user_accounts ||--o{ manager_org_units : "user_account_id"
  org_units ||--o{ manager_org_units : "org_unit_id"
  user_accounts |o--o{ manager_org_units : "assigned_by"
```

## License catalog

```mermaid
erDiagram
  vendors {
    bigint id PK
    varchar name
    varchar website
    varchar support_contact
    data_source collection_method
    boolean is_active
    bigint created_by FK
    timestamptz created_at
    timestamptz updated_at
  }
  software_categories {
    bigint id PK
    bigint parent_id FK
    varchar name
  }
  software_products {
    bigint id PK
    bigint vendor_id FK
    bigint category_id FK
    varchar name
    text description
    boolean is_active
    bigint created_by FK
    timestamptz created_at
    timestamptz updated_at
  }
  product_links {
    bigint id PK
    bigint product_id FK
    varchar label
    varchar url
    int sort_order
  }
  license_plans {
    bigint id PK
    bigint product_id FK
    varchar name
    license_archetype archetype
    varchar unit
    text description
    boolean is_active
    bigint created_by FK
    timestamptz created_at
    timestamptz updated_at
  }
  contracts {
    bigint id PK
    bigint vendor_id FK
    varchar contract_no
    varchar title
    date start_date
    date renewal_date
    int notice_period_days
    boolean auto_renew
    numeric commitment_amount
    numeric total_value
    char currency
    date ended_on
    bigint attachment_file_id FK
    text notes
    bigint created_by FK
    timestamptz created_at
    timestamptz updated_at
  }
  entitlement_lines {
    bigint id PK
    bigint license_plan_id FK
    bigint contract_id FK
    numeric quantity
    boolean is_unlimited
    date valid_from
    date valid_to
    commercial_term commercial_term
    numeric unit_price
    char currency
    data_source source
    varchar external_ref
    bigint sync_run_id FK
    bigint import_batch_id FK
    bigint created_by FK
    timestamptz created_at
    timestamptz updated_at
  }
  entitlement_allocations {
    bigint id PK
    bigint entitlement_line_id FK
    bigint org_unit_id FK
    numeric quantity
    bigint created_by FK
    timestamptz created_at
    timestamptz updated_at
  }
  user_accounts |o--o{ vendors : "created_by"
  software_categories |o--o{ software_categories : "parent_id"
  vendors ||--o{ software_products : "vendor_id"
  software_categories |o--o{ software_products : "category_id"
  user_accounts |o--o{ software_products : "created_by"
  software_products ||--o{ product_links : "product_id"
  software_products ||--o{ license_plans : "product_id"
  user_accounts |o--o{ license_plans : "created_by"
  vendors ||--o{ contracts : "vendor_id"
  files |o--o{ contracts : "attachment_file_id"
  user_accounts |o--o{ contracts : "created_by"
  license_plans ||--o{ entitlement_lines : "license_plan_id"
  contracts |o--o{ entitlement_lines : "contract_id"
  sync_runs |o--o{ entitlement_lines : "sync_run_id"
  import_batches |o--o{ entitlement_lines : "import_batch_id"
  user_accounts |o--o{ entitlement_lines : "created_by"
  entitlement_lines ||--o{ entitlement_allocations : "entitlement_line_id"
  org_units ||--o{ entitlement_allocations : "org_unit_id"
  user_accounts |o--o{ entitlement_allocations : "created_by"
```

## Collection pipeline

```mermaid
erDiagram
  connectors {
    bigint id PK
    bigint vendor_id FK
    varchar name
    varchar connector_type
    varchar base_url
    text credentials_encrypted
    varchar schedule_cron
    boolean is_simulated
    boolean is_active
    timestamptz created_at
    timestamptz updated_at
  }
  plan_data_sources {
    bigint id PK
    bigint license_plan_id FK
    data_kind data_type
    data_source source_type
    bigint connector_id FK
    varchar external_ref
    usage_granularity granularity
    timestamptz created_at
    timestamptz updated_at
  }
  sync_runs {
    bigint id PK
    bigint connector_id FK
    sync_trigger trigger
    run_status status
    date data_date
    timestamptz window_start
    timestamptz window_end
    int records_read
    int records_written
    text error_message
    timestamptz started_at
    timestamptz finished_at
  }
  raw_records {
    bigint id PK
    bigint sync_run_id FK
    varchar record_type
    varchar external_id
    jsonb payload
    char payload_hash
    timestamptz fetched_at
    timestamptz normalized_at
  }
  files {
    bigint id PK
    varchar storage_key
    varchar original_name
    varchar content_type
    bigint size_bytes
    char checksum
    bigint uploaded_by FK
    timestamptz uploaded_at
  }
  import_batches {
    bigint id PK
    data_kind import_type
    bigint license_plan_id FK
    bigint file_id FK
    import_status status
    int rows_total
    int rows_added
    int rows_updated
    int rows_rejected
    jsonb error_report
    bigint imported_by FK
    timestamptz created_at
    timestamptz confirmed_at
  }
  vendors ||--o{ connectors : "vendor_id"
  license_plans ||--o{ plan_data_sources : "license_plan_id"
  connectors |o--o{ plan_data_sources : "connector_id"
  connectors ||--o{ sync_runs : "connector_id"
  sync_runs ||--o{ raw_records : "sync_run_id"
  user_accounts |o--o{ files : "uploaded_by"
  license_plans |o--o{ import_batches : "license_plan_id"
  files ||--o{ import_batches : "file_id"
  user_accounts ||--o{ import_batches : "imported_by"
```

## Holders and usage

```mermaid
erDiagram
  subjects {
    bigint id PK
    bigint vendor_id FK
    subject_type subject_type
    varchar identifier
    varchar external_id
    varchar display_name
    bigint employee_id FK
    bigint org_unit_id FK
    boolean is_enabled
    data_source source
    timestamptz first_seen_at
    timestamptz last_seen_at
  }
  license_assignments {
    bigint id PK
    bigint license_plan_id FK
    bigint subject_id FK
    bigint entitlement_line_id FK
    date assigned_on
    date first_seen_on
    date ended_on
    timestamptz last_active_at
    data_source source
    bigint sync_run_id FK
    bigint import_batch_id FK
    bigint entered_by FK
    timestamptz created_at
    timestamptz updated_at
  }
  usage_records {
    bigint id PK
    bigint license_plan_id FK
    bigint subject_id FK
    usage_metric metric
    date period_start
    date period_end
    numeric quantity
    data_source source
    bigint sync_run_id FK
    bigint import_batch_id FK
    bigint entered_by FK
    timestamptz created_at
    timestamptz updated_at
  }
  plan_daily_snapshots {
    date snapshot_date
    bigint license_plan_id FK
    numeric purchased_qty
    boolean is_unlimited
    numeric effective_monthly_cost
    char currency
    timestamptz created_at
  }
  plan_unit_daily_snapshots {
    bigint id PK
    date snapshot_date
    bigint license_plan_id FK
    bigint org_unit_id FK
    int assigned_count
    int active_count
    int inactive_count
    int no_activity_count
    int not_monitored_count
    numeric used_qty
    timestamptz created_at
  }
  vendors ||--o{ subjects : "vendor_id"
  employees |o--o{ subjects : "employee_id"
  org_units |o--o{ subjects : "org_unit_id"
  license_plans ||--o{ license_assignments : "license_plan_id"
  subjects ||--o{ license_assignments : "subject_id"
  entitlement_lines |o--o{ license_assignments : "entitlement_line_id"
  sync_runs |o--o{ license_assignments : "sync_run_id"
  import_batches |o--o{ license_assignments : "import_batch_id"
  user_accounts |o--o{ license_assignments : "entered_by"
  license_plans ||--o{ usage_records : "license_plan_id"
  subjects |o--o{ usage_records : "subject_id"
  sync_runs |o--o{ usage_records : "sync_run_id"
  import_batches |o--o{ usage_records : "import_batch_id"
  user_accounts |o--o{ usage_records : "entered_by"
  license_plans ||--o{ plan_daily_snapshots : "license_plan_id"
  license_plans ||--o{ plan_unit_daily_snapshots : "license_plan_id"
  org_units |o--o{ plan_unit_daily_snapshots : "org_unit_id"
```

## Budget and expenses

```mermaid
erDiagram
  budget_plans {
    bigint id PK
    bigint org_unit_id FK
    int fiscal_year
    numeric budget_amount
    char currency
    text note
    budget_plan_status status
    timestamptz activated_at
    bigint activated_by FK
    bigint created_by FK
    timestamptz created_at
    timestamptz updated_at
  }
  budget_plan_lines {
    bigint id PK
    bigint budget_plan_id FK
    bigint license_plan_id FK
    numeric planned_quantity
    numeric planned_cost
    text note
    timestamptz created_at
    timestamptz updated_at
  }
  expenses {
    bigint id PK
    date expense_date
    numeric amount
    char currency
    bigint license_plan_id FK
    bigint org_unit_id FK
    text description
    bigint invoice_file_id FK
    bigint corrects_expense_id FK
    data_source source
    varchar external_ref
    bigint sync_run_id FK
    bigint import_batch_id FK
    bigint created_by FK
    timestamptz created_at
    timestamptz updated_at
  }
  accounting_periods {
    bigint id PK
    int fiscal_year
    int period_year
    int period_month
    period_status status
    timestamptz closed_at
    bigint closed_by FK
  }
  exchange_rates {
    bigint id PK
    char from_currency
    char to_currency
    numeric rate
    date effective_from
    bigint declared_by FK
    timestamptz created_at
  }
  org_units ||--o{ budget_plans : "org_unit_id"
  user_accounts |o--o{ budget_plans : "activated_by"
  user_accounts ||--o{ budget_plans : "created_by"
  budget_plans ||--o{ budget_plan_lines : "budget_plan_id"
  license_plans ||--o{ budget_plan_lines : "license_plan_id"
  license_plans ||--o{ expenses : "license_plan_id"
  org_units |o--o{ expenses : "org_unit_id"
  files |o--o{ expenses : "invoice_file_id"
  expenses |o--o{ expenses : "corrects_expense_id"
  sync_runs |o--o{ expenses : "sync_run_id"
  import_batches |o--o{ expenses : "import_batch_id"
  user_accounts |o--o{ expenses : "created_by"
  user_accounts |o--o{ accounting_periods : "closed_by"
  user_accounts |o--o{ exchange_rates : "declared_by"
```

## Optimization

```mermaid
erDiagram
  detection_runs {
    bigint id PK
    date data_date
    int inactivity_threshold_days
    run_status status
    timestamptz started_at
    timestamptz finished_at
  }
  detection_results {
    bigint id PK
    bigint detection_run_id FK
    bigint license_plan_id FK
    bigint org_unit_id FK
    detection_check check_type
    detection_outcome outcome
    numeric flagged_qty
    numeric monthly_cost
    char currency
    date flagged_since
    timestamptz created_at
  }
  recommendations {
    bigint id PK
    bigint license_plan_id FK
    bigint target_plan_id FK
    bigint org_unit_id FK
    bigint detection_result_id FK
    recommendation_type type
    varchar title
    text description
    jsonb evidence
    numeric affected_qty
    numeric estimated_yearly_saving
    numeric actual_saving
    char currency
    recommendation_status status
    text rejection_reason
    date earliest_action_date
    date due_date
    bigint owner_id FK
    bigint created_by FK
    bigint decided_by FK
    timestamptz decided_at
    timestamptz done_at
    timestamptz created_at
    timestamptz updated_at
  }
  detection_runs ||--o{ detection_results : "detection_run_id"
  license_plans ||--o{ detection_results : "license_plan_id"
  org_units |o--o{ detection_results : "org_unit_id"
  license_plans ||--o{ recommendations : "license_plan_id"
  license_plans |o--o{ recommendations : "target_plan_id"
  org_units |o--o{ recommendations : "org_unit_id"
  detection_results |o--o{ recommendations : "detection_result_id"
  user_accounts |o--o{ recommendations : "owner_id"
  user_accounts ||--o{ recommendations : "created_by"
  user_accounts |o--o{ recommendations : "decided_by"
```

## Audit

```mermaid
erDiagram
  audit_logs {
    bigint id PK
    bigint actor_id FK
    varchar action
    varchar entity_type
    bigint entity_id
    jsonb old_values
    jsonb new_values
    text reason
    varchar ip_address
    timestamptz occurred_at
  }
  data_overrides {
    bigint id PK
    varchar entity_type
    bigint entity_id
    varchar field_name
    text original_value
    text override_value
    text reason
    bigint overridden_by FK
    timestamptz overridden_at
    timestamptz reverted_at
  }
  user_accounts |o--o{ audit_logs : "actor_id"
  user_accounts ||--o{ data_overrides : "overridden_by"
```
