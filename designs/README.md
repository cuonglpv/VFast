# VFast ELMS – UI/UX Minimal Material-UI Designs (Google Stitch)
## Executive Management Portal: 3-Pillar Architecture (IA v5.3)

> **Project:** VFast – Enterprise License Management System (ELMS)  
> **Google Stitch Project ID:** `5367452734173829716`  
> **Stitch Design System Asset:** `assets/8328167488966181312` (*VFast Minimal Ocean Design System*)  
> **Target Scope:** 3-Pillar Enterprise Architecture (IA v5.3 Specification)  
> **Branch / Worktree:** `uiux/stitch-material-minimal`  
> **Design Directory:** `/designs` (root level, kept outside of `/docs`)  
> **Theme Palette:** **Xám - Trắng - Xanh biển** (Grey - White - Ocean Blue)  

---

## 🎨 Theme & Design Token Specifications

| Token Category | Token / Value | Hex Code | Visual Application & Material-UI Mapping |
|---|---|:---:|---|
| **Canvas Background** | Light Slate Grey | `#F8FAFC` | Main application background canvas, outer app frame |
| **Card & Surface** | Pure White | `#FFFFFF` | MUI `Card`, `Paper`, `TableContainer`, `Drawer` |
| **Primary Accent** | Ocean Blue | `#0F67B1` | MUI `primary.main`, active nav tabs, primary buttons, major chart bars |
| **Primary Container**| Soft Sky Container | `#E0F2FE` | Active menu container, selected table row indicator |
| **Secondary Neutral**| Slate Grey | `#475569` | MUI `text.secondary`, column headers, metadata captions |
| **Neutral Inks** | Deep Slate | `#0F172A` / `#1E293B` | `text.primary`, bold KPI metrics, software titles |
| **Hairline Border** | Subtle Hairline | `#E2E8F0` | 1px crisp non-intrusive borders between cards, tables, panels |
| **Success / Compliant** | Emerald Green | `#10B981` / `#4CAF50` | Active accounts, Compliant chips, healthy progress segments |
| **Warning / At Risk** | Warm Amber | `#F59E0B` / `#FF9800` | At Risk licenses (<30d, 95% capacity), Never Used chart segment |
| **Error / Over-allocated** | Crimson / Rose | `#EF4444` / `#E91E63` | Over-allocated licenses, Unassigned inventory column |

### Strict Design Principles Applied (IA v5.3 Rules Contract)
1. **Material-UI (MUI v5/v6) Architecture:** Responsive grid, standard cards, structured data tables with pagination, and 640px right-anchored drawers.
2. **4-Element Minimalist KPI Cards:** Row 1 (Header + Tooltip), Row 2 (Hero Value), Row 3 (Single Status Chip), Row 4 (Optional Action Trigger). Strictly zero stacked sub-metrics or nested secondary bullet points.
3. **Selective Subtitles & Zero Visual Bloat:** Self-evident titles (`Total Users`, `Total Licenses`, `Annual Spend`) have zero subtitle text. Domain-specific titles (`Remaining Budget`, `Next Month Renewals`, `Idle Accounts`) use concise 1-line subtitles or tooltips.
4. **ApexCharts Minimalist Standard:** Strictly `dataLabels: { enabled: false }` across all charts. Hover tooltips reveal exact numbers. Horizontal bar charts feature calibrated bottom numeric X-axes with hairline gridlines.
5. **Icon Integrity Constraint:** Strictly utilizing official `@mui/icons-material` symbols (`vpn_key`, `insights`, `manage_accounts`, `Search`, `FilterList`, `Close`, `OpenInNew`, `InfoOutlined`, `ArrowForward`). Zero arbitrary or hallucinated icons. Vendor logos and user avatars are rendered as clean two-letter monogram circular avatars (`MS`, `SL`, `GH`, `JR`, `FG`, `DD`, `DN`).

---

## 📱 Master Screen Catalog & Specifications

### 1. View 1: License Management (`SCR-LIC-MGMT-01`)
- **Route:** `/manager/licenses`
- **Stitch Screen ID:** `7a00b13751114ba090fc901d8194b8a3`
- **Files:** `designs/SCR-LIC-MGMT-01.html`, `designs/SCR-LIC-MGMT-01.png`
- **Key Sections:**
  - **Minimalist 4-Element KPI Header:**
    1. *Total Licenses:* `1,284` (+4.5% MoM chip)
    2. *Active Entitlements:* `1,142` (88.9% allocated chip)
    3. *Next Month Renewals:* `18` (Requires review amber chip, subtitle: "Expiring in <=30 days")
    4. *Unallocated Waste:* `$34,200` (Potential savings chip)
  - **Quick Filters & Actions Toolbar:** Search text field, Category filter dropdown, Status dropdown, Export CSV, and `+ Add License` primary CTA.
  - **General License Data Grid (9 Core Columns):**
    - Columns: License Name (with monogram avatar), Publisher, License Type (outlined chip), Compliance Status (chip with status dot), Purchased Amount ($ USD), Entitlements, Active Users, Utilization Ratio (e.g. 470/500), Expiry Date (YYYY-MM-DD).
    - Rows: Microsoft 365 Enterprise, Slack Enterprise Grid, GitHub Enterprise, Jira Software & Confluence, Figma Enterprise, Datadog Pro.
    - MUI `TablePagination`: 10 rows per page with standard controls.

---

### 2. View 1 Drill-Down: License Detail & Granted Accounts Roster (`SCR-LIC-DETAIL-01`)
- **Route:** `/manager/licenses?drawer=detail&id=ms-365`
- **Stitch Screen ID:** `4a56961268e84d7399a66863ead51fb7`
- **Files:** `designs/SCR-LIC-DETAIL-01.html`, `designs/SCR-LIC-DETAIL-01.png`
- **Key Sections:**
  - **Presentation:** 640px right-anchored MUI `Drawer` over the License Management dashboard with dimmed backdrop overlay and active row highlight.
  - **Header:** Software title "Microsoft 365 Enterprise", publisher "Microsoft Corporation", green "Compliant" chip, close icon button.
  - **Key Indicators (Compact 2x3 Grid):**
    1. Monthly Cost: `$15,000 / month`
    2. Subscriptions: `3 Contracts / POs`
    3. Subscription Types: `2 Types (E3, E5)`
    4. Total Users: `470 Assigned Users (94%)`
    5. Unassigned Subscriptions: `30 Seats Available`
    6. Renewal Date: `2027-05-31`
  - **Metadata & Documentation:** Vendor contact, Category, Subcategory, Contract terms, and Policy hyperlinks with `OpenInNew` icons.
  - **Granted Accounts Roster Table:** Tabular listing of active assigned employees, departments, assignment dates, and individual license tiers.
  - **Drawer Footer:** Audit timestamp and MUI action buttons (`Reallocate Seats`, `Manage Contract`).

---

### 3. View 2A: License Health Analytics (`SCR-ANALYTICS-01`)
- **Route:** `/manager/analytics` (Health Tab)
- **Stitch Screen ID:** `86a7ad2dddd447ba9514192b0c944be2`
- **Files:** `designs/SCR-ANALYTICS-01.html`, `designs/SCR-ANALYTICS-01.png`
- **Key Sections & IA Enhancements:**
  - **Minimalist 4-Element KPI Header:** Total Annual Spend ($1,420,000), Managed Licenses (1,284), Underutilized Accounts (312), Underutilized Cost ($285,600/yr). Subtitles rendered as interactive MUI Info Tooltips.
  - **Chart 1: Application Usage Optimization (Col 7 - Horizontal Stacked Bar):**
    - Zero on-chart data labels (`dataLabels: false`).
    - Tooltip on hover reveals exact seat breakdown (Actively used, Inactive >60d, Never used).
    - Calibrated bottom numeric X-axis `[0, 100, 200, 300, 400, 500 users]`.
  - **Chart 2: Spend by Department (Col 5 - Horizontal Bar Chart):**
    - Clean horizontal bar chart in Ocean Blue (`#0F67B1`).
    - 6 Organizational departments on Y-axis.
    - Calibrated bottom currency X-axis `[$0, $150k, $300k, $450k, $600k]`.
  - **Chart 3: Subscription Usage (Col 12 - Grouped Dual-Column Bar Chart):**
    - Simplified title to **"Subscription Usage"**.
    - Calibrated horizontal X-axis (Jan-Dec) and vertical Y-axis (0-1250 seats).
    - Compact explanatory footnote at card bottom replacing redundant insight boxes.

---

### 4. View 2B: Budget Analytics (`SCR-BUDGET-ANALYTICS-01`)
- **Route:** `/manager/analytics/budget` (Budget Tab)
- **Stitch Screen ID:** `0f96faffa71d49e4aafb41b0c189aa91`
- **Files:** `designs/SCR-BUDGET-ANALYTICS-01.html`, `designs/SCR-BUDGET-ANALYTICS-01.png`
- **Key Sections:**
  - **Minimalist 4-Element Financial KPIs:**
    1. *Total Annual Budget:* `$1,800,000` (FY2026 Allocation chip)
    2. *Actual YTD Spend:* `$1,420,000` (78.9% Utilized chip)
    3. *Remaining Budget:* `$380,000` (On Track chip, subtitle: "Projected buffer through Q4")
    4. *Forecasted Variance:* `+2.1%` (Within tolerance emerald chip)
  - **Monthly Burn vs. Allocation Trajectory:** Smooth area/line comparison chart with dual series (`Allocated Budget` vs. `Actual Spend`), zero on-chart clutter, and hover tooltips showing delta.
  - **Departmental Budget Ledger:** High-density MUI table detailing Department, Allocated Budget, Actual Spend, Variance ($ and %), and Optimization Status.
  - **Forecasted Q4 Optimization Scenarios:** Minimalist scenario cards detailing potential savings from seat reclamation and vendor consolidation.

---

### 5. View 3: User Management – Role & Tenant Administration (`SCR-USER-MGMT-01`)
- **Route:** `/manager/users`
- **Stitch Screen ID:** `a37f968351d74e499f74213c04426a9f`
- **Files:** `designs/SCR-USER-MGMT-01.html`, `designs/SCR-USER-MGMT-01.png`
- **Key Sections:**
  - **Minimalist 4-Element Identity KPIs:**
    1. *Total Users:* `850` (+5.2% MoM chip)
    2. *Active Users:* `92.0%` (782 Active chip)
    3. *Tenants:* `12` (Isolation Active chip)
    4. *Privileged Roles:* `14` (4 Admins, 10 Mgrs amber chip, subtitle: "Admin & Manager accounts")
  - **Filter & Multi-Tenant Toolbar:** Search text field, Tenant filter dropdown (`All Tenants`, `HQ - Vietnam`, `North America Branch`, `EU Operations`), Role dropdown (`Admin`, `Manager`, `Staff`, `Employee`), Status filter (`Active`, `Suspended`, `Deactivated`), Export CSV button, and `+ Add User` primary CTA.
  - **9-Column Enterprise User & Tenant Grid:**
    - Columns: User Profile (Monogram avatar + Name + Email), Tenant / Organization, Assigned Role (Admin blue chip, Manager emerald chip, Staff slate chip, Employee outlined chip), Allocated Licenses, Department, Account Status (Active green dot, Suspended amber dot, Deactivated rose dot), Last Active (timestamp), Created Date, Actions (Edit Role & Tenant, Suspend/Activate toggle, More options).
    - Rows: Dat Nguyen (DN), Sarah Jenkins (SJ), Alex Mercer (AM), Linh Tran (LT), Michael Vance (MV), David Rossi (DR).
    - Table Pagination: `Showing 1-6 of 850 users` with rows-per-page dropdown and full pagination controls.
