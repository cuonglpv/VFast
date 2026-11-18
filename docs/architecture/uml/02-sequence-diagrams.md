# 2. Sequence Diagrams

Four user scenarios from UI demo v90. Paths are relative to `/api/v1`. Every request passes the three checks of [§8](../arc42/08-crosscutting-concepts.md): authentication (`401`), RBAC (`403`), data scope (`404`).

## 1. Login and role routing

```mermaid
sequenceDiagram
    autonumber
    actor U as User
    participant L as LoginPage
    participant A as AuthContext / useAuth
    participant AS as authService
    participant R as RequireRole / router
    participant API as Elms.Api
    participant DB as PostgreSQL

    U->>L: email, password, Sign in
    L->>A: signIn(email, password)
    A->>AS: login(email, password)
    AS->>API: POST /auth/login
    API->>DB: find active account, check lockout (BR-16)
    alt valid
        API->>DB: create server-side session
        API-->>AS: 200, Set-Cookie (HttpOnly, Secure, SameSite=Lax), { role, scope }
        AS-->>A: session
        A->>R: navigate to landing of role
        R-->>U: Manager → License List · Staff → Connector Management · Admin → Users
    else wrong password or locked
        API-->>AS: 401 ProblemDetails
        AS-->>A: ApiError
        A-->>L: show error, keep form
    end
    Note over R: Opening a path the role may not use redirects to the landing page.<br/>the API still answers 403 (BR-14)
```

## 2. Usage for a scope

```mermaid
sequenceDiagram
    autonumber
    actor M as Manager
    participant SP as ScopePicker
    participant H as useOrgScope
    participant P as UsagePage + useUsage
    participant UR as usageService
    participant API as Elms.Api
    participant DB as PostgreSQL views

    M->>SP: choose units, Apply
    SP->>H: setScope(unitIds)
    H->>H: write ?scope= to the URL (P2)
    H-->>P: scope changed
    par balance, trend, units, waste
        P->>UR: balance / trend / units / wasteRanking(scope)
        UR->>API: GET /usage/{scopeId}/balance, /trend, /units, /waste-ranking
        API->>API: AccessScope: scope inside the Manager's units?
        alt inside scope
            API->>DB: Dapper over materialized views
            DB-->>API: rows
            API-->>UR: 200 { data, dataDate, source }
            UR-->>P: render, null shown as Unknown (BR-04)
        else outside scope
            API-->>UR: 404
            UR-->>P: EmptyState, reset scope
        end
    end
    M->>P: View analysis on a license
    P-->>M: LicenseAnalysisDialog (cause grid, contributors)
```

## 3. Import budget plan

```mermaid
sequenceDiagram
    autonumber
    actor M as Manager
    participant D as ImportBudgetDialog + useBudgetImport
    participant BR as budgetService
    participant API as Elms.Api
    participant DB as PostgreSQL
    participant W as Elms.Worker

    M->>D: choose Excel file, target unit, months
    D->>BR: previewImport(file, target, months)
    BR->>API: POST /budget/imports (multipart)
    API->>API: validate template, units, licenses
    alt file invalid
        API-->>BR: 400 ProblemDetails with row errors
        BR-->>D: show errors, no change
    else valid
        API->>DB: store file and preview (import_batches)
        API-->>BR: 200 { previewKey, rows, summary, unchanged? }
        BR-->>D: preview table, "Valid File"
        M->>D: Confirm
        D->>BR: confirmImport(previewKey)
        BR->>API: POST /budget/imports/{previewKey}/confirm
        API->>DB: enqueue ImportConfirmJob (keyed by previewKey)
        API-->>BR: 202
        W->>DB: write new budget version in one transaction
        Note over API,W: Confirming the same previewKey again returns the first result (BR-33)
        BR-->>D: close, refresh plan
    end
```

## 4. New connector

```mermaid
sequenceDiagram
    autonumber
    actor S as Staff
    participant F as ConnectorFormDialog + useConnectors
    participant CR as connectorService
    participant API as Elms.Api
    participant W as Elms.Worker
    participant P as P&L license API
    participant DB as PostgreSQL

    S->>F: company, provider, contact, API URL, auth, secret, licenses
    F->>CR: test(draft)
    CR->>API: POST /connectors/test
    API->>W: enqueue TestConnectionJob, wait for result
    W->>P: read-only call (ECS)
    alt reachable, read-only, ECS valid
        P-->>W: 200 sample
        W-->>API: ok
        API-->>CR: 200 { ok }
        S->>F: Save
        F->>CR: create(draft)
        CR->>API: POST /connectors
        API->>DB: insert connector, secret encrypted (Data Protection)
        API-->>CR: 201 (secret never returned, BR-18)
        CR-->>F: close, table shows Pending until the first sync
    else fails
        W-->>API: error (auth, scope not read-only, contract)
        API-->>CR: 400 ProblemDetails
        CR-->>F: show reason, Save stays disabled
    end
```

Open question: the API never calls a source, so the test runs on the Worker; whether the API waits for it (as drawn) or the form polls is to be decided.
