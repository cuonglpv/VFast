# C4 Level 4 — Code

> **Status:** TARGET · **Audience:** developers
>
> **Baseline:** UI demo [`UI/VFast_UI_v90.html`](../../../UI/VFast_UI_v90.html). Flow, code structure, and responsibilities: [Code structure §3](../../05-code-structure.md#3-frontend).

Level 4 zooms into the **Web Frontend** from [C3 §3](03-component.md#3-web-frontend): each feature folder (`features/<area>`) with its pages, components, and hooks, the service it imports from `services/`, and the `shared/` parts it uses. Every diagram follows the [target flow](../../05-code-structure.md#31-target-frontend-flow) `Page / Component → Feature Hook → Feature Service → apiClient → ASP.NET Core API`; `apiClient` is left out of the diagrams. The backend is left to the source (§2), because a hand-drawn class diagram of it goes stale; its intended classes are in [UML](../uml/README.md).

Colour: dark blue = page, blue = inside the feature folder, grey = `shared/`, `services/`, or `app/`. Arrows never go from one feature to another.

## 1. Web Frontend

### 1.1 Shell, authentication, and routing

```mermaid
flowchart TB
    main["main.tsx / app/App.tsx<br/><i>ThemeProvider → AuthProvider → RouterProvider</i>"]
    router["app/router.tsx<br/><i>createBrowserRouter, lazy pages</i>"]
    guard["app/RequireRole<br/><i>role → allowed pages</i>"]
    authctx["features/auth · AuthContext<br/><i>user, role, organization,<br/>signIn, signOut, switchAccount</i>"]
    login["LoginPage<br/><i>role radio, organization select</i>"]
    layout["app/layout/MainLayout"]
    topbar["Topbar<br/><i>breadcrumb, Synced, fiscal year,<br/>session chip, Switch account</i>"]
    sidebar["Sidebar"]
    rail["MainRail<br/><i>menu filtered by role</i>"]
    usub["UsageSubnav<br/><i>org tree, License › Overview / items</i>"]
    csub["CloudSubnav<br/><i>P&L, Infrastructure</i>"]
    foot["SideFooter"]
    outlet["&lt;Outlet/&gt;<br/><i>the active page</i>"]
    authHook["useAuth"]
    authSvc["services/auth/authService.ts"]

    main --> router
    router --> login
    router --> guard --> layout
    login --> authHook
    authctx --> authHook --> authSvc
    guard --> authctx
    layout --> topbar
    layout --> sidebar
    layout --> outlet
    sidebar --> rail
    sidebar --> usub
    sidebar --> csub
    sidebar --> foot

    classDef page fill:#0B4F8A,stroke:#0F172A,color:#fff
    classDef sec fill:#2F7FC1,stroke:#0F67B1,color:#fff
    classDef shared fill:#94A3B8,stroke:#475569,color:#0F172A
    class login page
    class authctx,authHook sec
    class layout,topbar,sidebar,rail,usub,csub,foot,guard,authSvc shared
```

### 1.2 Usage (`/usage`, Manager)

```mermaid
flowchart TB
    page["UsagePage<br/><i>License Cost & Efficiency Analytics</i>"]
    scope["ScopePicker<br/><i>hierarchy multi-select, search, Apply</i>"]
    strip["OverviewStrip<br/><i>Plan / Spend / Actual</i>"]
    analytics["PlanActualAnalytics<br/><i>per P&L or per license, chart pager</i>"]
    heat["MonthlyHeatmap<br/><i>Heatmap | By License, Rate | Cost</i>"]
    units["SubordinateUnitsTable<br/><i>ranking, Export CSV</i>"]
    waste["LicenseWastePanel<br/><i>search, provider, type, sort</i>"]
    dialog["LicenseAnalysisDialog<br/><i>cause grid, contributors, drill</i>"]

    useScope["useOrgScope<br/><i>scope ↔ ?scope= (P2)</i>"]
    kpi["KpiCard"]
    charts["CompareBarChart, Heatmap"]
    table["DataTable + Pagination"]
    csv["useCsvExport"]
    tree["OrgTreeSelect"]
    hook["useUsage"]
    api["services/usage/usageService.ts"]
    org["services/org/orgService.ts"]

    page --> scope & strip & analytics & heat & units & waste
    waste --> dialog
    scope --> tree
    scope --> useScope
    strip --> kpi
    analytics --> charts
    heat --> charts
    units --> table
    units --> csv
    waste --> table
    strip & analytics & heat & units & waste & dialog --> hook
    hook --> api
    useScope --> org

    classDef page fill:#0B4F8A,stroke:#0F172A,color:#fff
    classDef sec fill:#2F7FC1,stroke:#0F67B1,color:#fff
    classDef shared fill:#94A3B8,stroke:#475569,color:#0F172A
    class page page
    class strip,analytics,heat,units,waste,dialog,hook sec
    class scope,useScope,kpi,charts,table,csv,tree,api,org shared
```

**License Overview** (`/usage/licenses`) and **License Detail** (`/usage/licenses/:licenseId`) reuse the same scope and live in `features/licenses`: `LicensePickerFilter`, `LicenseKpiStrip`, `LicenseCostChart` (Plan / Spend / Used), `LicenseSeatChart`, `UnitAllocationChart`, `LicenseDenseList`, and, on the detail page, `AssignedUsersTable`, through `useLicenses` → `services/license/licenseService.ts`. *View assigned users* in the usage dialog navigates to the detail route instead of importing from `licenses`.

### 1.3 Budget Plan (`/budget`, Manager and Staff)

```mermaid
flowchart TB
    page["BudgetPlanPage"]
    filters["BudgetFilters<br/><i>P&L hierarchy, fiscal year,<br/>Import Excel, Export CSV</i>"]
    kpis["BudgetKpis"]
    forecast["BudgetForecastCard<br/><i>plan pace, purchased, forecast</i>"]
    alloc["MonthlyAllocationTable<br/><i>From / To, expand, missing marker</i>"]
    edit["QuickEditBudgetDialog<br/><i>Update Monthly Budget</i>"]
    imp["ImportBudgetDialog<br/><i>upload → preview → confirm</i>"]

    tree["OrgTreeSelect"]
    kpi["KpiCard"]
    fc["ForecastChart"]
    range["MonthRangeFilter"]
    dlg["AppDialog"]
    bhook["useBudget"]
    hook["useBudgetImport<br/><i>preview → confirm</i>"]
    repo["services/budget/budgetService.ts"]

    page --> filters & kpis & forecast & alloc
    alloc --> edit
    filters --> imp
    filters --> tree
    kpis --> kpi
    forecast --> fc
    alloc --> range
    edit --> dlg
    imp --> dlg
    kpis & forecast & alloc & edit --> bhook
    imp --> hook
    bhook --> repo
    hook --> repo

    classDef page fill:#0B4F8A,stroke:#0F172A,color:#fff
    classDef sec fill:#2F7FC1,stroke:#0F67B1,color:#fff
    classDef shared fill:#94A3B8,stroke:#475569,color:#0F172A
    class page page
    class filters,kpis,forecast,alloc,edit,imp,hook,bhook sec
    class tree,kpi,fc,range,dlg,repo shared
```

The import is two calls: `POST /budget/imports` returns a preview and a preview key; `POST /budget/imports/{previewKey}/confirm` writes it once (BR-33). See [UML sequence 3](../uml/02-sequence-diagrams.md#3-import-budget-plan).

### 1.4 Cloud Usage (`/cloud/pnl`, `/cloud/infrastructure`, Manager)

```mermaid
flowchart TB
    pnl["CloudPnlPage<br/><i>SCR-CLOUD-PNL-01</i>"]
    infra["CloudInfrastructurePage<br/><i>SCR-CLOUD-INFRA-01</i>"]
    crumb["CloudPnlBreadcrumb"]
    overview["SpendingOverviewChart<br/><i>click a P&L to drill</i>"]
    breakdown["CloudBreakdownTable<br/><i>From / To month</i>"]
    records["CostRecordsDialog<br/><i>records, service costs over time</i>"]
    summary["BudgetSummaryOnMonth"]
    sources["InfrastructureSources<br/><i>FY forecast per provider</i>"]
    detail["InfrastructureCostDialog"]

    fc["ForecastChart"]
    range["MonthRangeFilter"]
    table["DataTable"]
    chook["useCloudSpend"]
    repo["services/cloud/cloudService.ts"]

    pnl --> crumb & overview & breakdown
    pnl --> fc
    breakdown --> records
    breakdown --> range
    breakdown --> table
    infra --> fc
    infra --> summary & sources
    sources --> detail
    overview & breakdown & records & summary & sources --> chook
    chook --> repo

    classDef page fill:#0B4F8A,stroke:#0F172A,color:#fff
    classDef sec fill:#2F7FC1,stroke:#0F67B1,color:#fff
    classDef shared fill:#94A3B8,stroke:#475569,color:#0F172A
    class pnl,infra page
    class crumb,overview,breakdown,records,summary,sources,detail,chook sec
    class fc,range,table,repo shared
```

### 1.5 Connector Management (`/connectors`)

```mermaid
flowchart TB
    page["ConnectorManagementPage"]
    metrics["ConnectorMetrics<br/><i>Companies, Providers,<br/>Licenses, Sync Issues</i>"]
    toolbar["ConnectorToolbar<br/><i>search, P&L menu, provider,<br/>status, sort, New Connector</i>"]
    table["ConnectorTable<br/><i>Coverage, Created, Last Sync,<br/>Status, Actions</i>"]
    form["ConnectorFormDialog<br/><i>company & contact · API URL,<br/>auth, secret · licenses</i>"]

    kpi["KpiCard"]
    search["SearchInput, FilterSelect"]
    dt["DataTable + Pagination"]
    badge["StatusBadge"]
    dlg["AppDialog"]
    khook["useConnectors"]
    repo["services/connector/connectorService.ts"]

    page --> metrics & toolbar & table
    toolbar --> form
    table --> form
    metrics --> kpi
    toolbar --> search
    table --> dt
    table --> badge
    form --> dlg
    metrics & table & form --> khook
    khook --> repo

    classDef page fill:#0B4F8A,stroke:#0F172A,color:#fff
    classDef sec fill:#2F7FC1,stroke:#0F67B1,color:#fff
    classDef shared fill:#94A3B8,stroke:#475569,color:#0F172A
    class page page
    class metrics,toolbar,table,form,khook sec
    class kpi,search,dt,badge,dlg,repo shared
```

The secret field is write-only: the form never reads a saved credential back (BR-18).

### 1.6 Other pages

| Feature · page | Components | Hook | Services |
|---|---|---|---|
| `admin` · UserManagementPage (`/admin/users`) | `UsersTable`, `UserEditDialog` | `useUsers` | `userService`, `orgService` |

## 2. Backend and data

| Component | Where to look |
|---|---|
| Backend solution layout | [Code structure §4](../../05-code-structure.md#4-backend): target flow, code structure, responsibilities |
| Intended classes and call order | [UML](../uml/README.md) |
| Entities and fields | [`database/tables.md`](../../database/tables.md), [`database/elms.dbml`](../../database/elms.dbml) |
| Reference DDL | [`database/schema.sql`](../../database/schema.sql) |
| Pure business rules | `Elms.Domain/Rules` (BR-03 seat status, BR-06 allocation, BR-09 and BR-22 Purchased / Used / Wasted, BR-20 waste flag, BR-23 accrual) |

---

[← C3 Component](03-component.md) · [C4 index](README.md)
