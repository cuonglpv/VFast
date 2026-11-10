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
- **Stitch Screen ID:** `99181e31efcc4fbba7d2cd7931f780f9`
- **Files:** `designs/SCR-LIC-MGMT-01.html`, `designs/SCR-LIC-MGMT-01.png`
- **Key Sections & Layout Refinements:**
  - **Balanced Top Visuals Row (Matching ~270px Height):**
    - *Col 1 (Stacked KPIs):* Two uniform compact cards: `Total Licenses` (1,284 | +4.5% MoM chip) and `Seat Utilization` (88.9% | 1,142 / 1,284 Active chip).
    - *Col 2:* `Category Breakdown` (ApexCharts Donut, center '1,284 Total', zero on-slice numbers).
    - *Col 3:* `Top 5 App Usage` (5 linear progress bars with active percentages).
  - **Single Horizontal Filter Toolbar:** Search input, Category dropdown, Status dropdown, Agreement types.
  - **10-Column Data Grid (table-fixed 100% Fit):** Proportional column widths ensuring all 10 columns (including Expiry Date and Actions `more_vert` button) fit 100% within the container with zero horizontal clipping.

---

### 2. View 1 Drill-Down: License Detail & Granted Accounts Roster (`SCR-LIC-DETAIL-01`)
- **Route:** `/manager/licenses?drawer=detail&id=ms-365`
- **Stitch Screen ID:** `76d3bd7ba07348ee88220893dca94938`
- **Files:** `designs/SCR-LIC-DETAIL-01.html`, `designs/SCR-LIC-DETAIL-01.png`
- **Key Sections & Layout Refinements:**
  - **Presentation:** 640px right-anchored MUI `Drawer` over the License Management dashboard with dimmed backdrop overlay and active row highlight. Background view sidebar strictly reflects the 3-pillar model.
  - **Header:** Software title "Microsoft 365 Enterprise", publisher "Microsoft Corporation", green "Compliant" chip, `[Edit]` button, close icon button.
  - **Key Indicators (Compact 2x3 Grid):** 6 compact indicator cards (Monthly Cost $15k/mo, Subscriptions 3 Contracts, Tiers 2 Tiers, Assigned Users 470, Available Seats 30, Renewal Date 2027-05-31).
  - **Metadata & Documentation:** Streamlined vendor metadata and 2x2 governance links.
  - **Granted Accounts Roster Table:** Tabular listing of active assigned employees (Dat Nguyen, Sarah Jenkins, Alex Mercer) with active status badges and seat actions, clearly visible in the viewport without being obscured by the bottom sticky footer.
  - **Drawer Sticky Footer:** Audit timestamp and MUI action buttons (`Reallocate Seats`, `Manage Contract`).

---

### 3. View 2A: License Health Analytics (`SCR-ANALYTICS-01`)
- **Route:** `/manager/analytics` (Health Tab)
- **Stitch Screen ID:** `42c8ba2218114b489421b09e60fbe0d2`
- **Files:** `designs/SCR-ANALYTICS-01.html`, `designs/SCR-ANALYTICS-01.png`
- **Key Sections & IA Enhancements:**
  - **Balanced 4-Column Key Metrics (Uniform min-h-[120px]):**
    1. *Annual Spend:* `$1,420,000` (Hero on row 2) | `Within Budget Cap` (Chip on row 3)
    2. *Managed Licenses:* `1,284` (Hero on row 2) | `48 Active Apps` (Chip on row 3)
    3. *Idle Accounts:* `312` (Hero on row 2) | `24.3% Rate (Inactive >60d)` (Chip on row 3)
    4. *Wasted Spend:* `$285,600 / yr` (Hero on row 2) | `20.1% Leakage` (Chip on row 3)
    (Subtitles exclusively in interactive tooltips, zero number wrapping or collision).
  - **Chart 1: Application Usage (Col 7 - Horizontal Stacked Bar):**
    - Zero on-chart data labels (`dataLabels: false`), hover tooltips reveal exact seats.
    - Calibrated bottom numeric X-axis `[0, 100, 200, 300, 400, 500 users]`.
  - **Chart 2: Department Spend (Col 5 - Horizontal Bar Chart):**
    - 6 Organizational departments in Ocean Blue (`#0F67B1`), calibrated bottom currency X-axis `[$0, $150k, $300k, $450k, $600k]`.
  - **Chart 3: Subscription Dynamics (Col 12 - Grouped Dual-Column Bar Chart):**
    - Full 12-month dual-column bars rendered (Jan-Dec) comparing allocated states (Active, Inactive, No activity, Not monitored) vs unassigned inventory.
    - Calibrated Y-axis (0-1250 seats) and explanatory footnote at bottom.

---

### 4. View 2B: Budget Analytics (`SCR-BUDGET-ANALYTICS-01`)
- **Route:** `/manager/analytics/budget` (Budget Tab)
- **Stitch Screen ID:** `ba49883ef01d4fa881eb6c495f66deaf`
- **Files:** `designs/SCR-BUDGET-ANALYTICS-01.html`, `designs/SCR-BUDGET-ANALYTICS-01.png`
- **Key Sections & Layout Refinements:**
  - **Balanced 4-Column Financial KPIs (Uniform min-h-[135px]):**
    1. *Remaining Budget:* `$28,400` | `23.7% Left` (Chip on row 3) | `Current Month Safe Pace`
    2. *Next Month Renewals:* `72.5%` | `High Renewal Load` (Chip on row 3) | `[View Renewals (6) →]`
    3. *Budget Consumed:* `77.8%` | `-$45k Surplus` (Chip on row 3) | `YTD Outlay vs Approved Cap`
    4. *Recoverable Waste:* `$23,800 / mo` | `312 Idle Seats` (Chip on row 3) | `[Reclaim Seats →]`
    (Zero internal progress bar clutter, chips neatly placed below hero numbers).
  - **Chart 1: Budget by Category (Col 6):** Horizontal bars comparing Allocated vs Actual across 6 categories with bottom X-axis `[$0 - $500k]`.
  - **Chart 2: Historical Spend Trend (Col 6):** Smooth SVG area trajectory from Jan to Dec against monthly budget ceiling.
  - **Departmental Budget Ledger Table (Full Width):** High-density MUI table detailing 6 departments, Allocated Budget, Actual Spend, Variance ($ and %), and Optimization Status.

---

### 5. View 3: User Management – Role & Tenant Administration (`SCR-USER-MGMT-01`)
- **Route:** `/admin/users`
- **Stitch Screen ID:** `82cc0692d4c24c1bb4e2801f46cf4fe0`
- **Files:** `designs/SCR-USER-MGMT-01.html`, `designs/SCR-USER-MGMT-01.png`
- **Key Sections & Layout Refinements:**
  - **Balanced 4-Column Identity KPIs (Uniform min-h-[120px]):**
    1. *Total Users:* `850` | `+5.2% MoM` (Chip on row 3)
    2. *Active Users:* `92.0%` | `782 Active` (Chip on row 3)
    3. *Tenants:* `12` | `Isolation Active` (Chip on row 3)
    4. *Privileged Roles:* `14` | `4 Admins, 10 Mgrs` (Chip on row 3)
  - **Single Horizontal Filter Toolbar:** Search input, Tenant dropdown, Role dropdown, Status dropdown, Reset button. (Duplicate Export CSV and Add User buttons removed from filter bar, kept only in page header).
  - **9-Column Enterprise User & Tenant Grid (table-fixed 100% Fit):**
    - Columns: User Profile (Monogram avatar + Name + Email), Tenant / Organization, Assigned Role, Allocated Licenses, Department, Account Status, Last Active, Created Date, Actions (Manage Accounts & Block buttons).
    - Proportional percentage widths ensure all 9 columns are completely visible inside the card boundary with zero horizontal clipping.
