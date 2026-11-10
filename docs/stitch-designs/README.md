# VFast ELMS – UI/UX Minimal Material-UI Designs (Google Stitch)
## Executive Management Portal: License Management & Analytics

> **Project:** VFast – Enterprise License Management System (ELMS)  
> **Google Stitch Project ID:** `5367452734173829716`  
> **Stitch Design System Asset:** `assets/8328167488966181312`  
> **Target Scope:** 2-View Focused Architecture (v4.2 Baseline)  
> **Branch / Worktree:** `uiux/stitch-material-minimal`  
> **Theme Palette:** **Xám - Trắng - Xanh biển** (Grey - White - Ocean Blue)  

---

## 🎨 Theme & Design Token Specifications

| Token Category | Token / Value | Hex Code | Visual Application & Material-UI Mapping |
|---|---|:---:|---|
| **Canvas Background** | Light Slate Grey | `#F8FAFC` | Main application background canvas, outer app frame |
| **Card & Surface** | Pure White | `#FFFFFF` | MUI `Card`, `Paper`, `TableContainer`, `Drawer` |
| **Primary Accent** | Ocean Blue | `#0F67B1` | MUI `primary.main`, active nav tabs, primary buttons, major chart bars |
| **Primary Container**| Soft Sky Container | `#E0F2FE` | Active menu container, selected table row indicator |
| **Secondary Accent**| Slate Grey | `#475569` | MUI `text.secondary`, column headers, metadata captions |
| **Neutral Inks** | Deep Slate | `#0F172A` / `#1E293B` | `text.primary`, bold KPI metrics, software titles |
| **Border / Outlines**| Subtle Hairline | `#E2E8F0` | 1px crisp non-intrusive borders between cards, tables, panels |
| **Success / Compliant** | Emerald Green | `#10B981` / `#4CAF50` | Active accounts, Compliant chips, healthy progress segments |
| **Warning / At Risk** | Warm Amber | `#F59E0B` / `#FF9800` | At Risk licenses (<30d, 95% capacity), Never Used chart segment |
| **Error / Over-allocated** | Crimson / Rose | `#EF4444` / `#E91E63` | Over-allocated licenses, Unassigned inventory column |

### Strict Design Principles Applied
1. **Material-UI (MUI v5/v6) Architecture:** Responsive grid, standard cards, structured data tables with pagination, and 640px right-anchored drawers.
2. **Zero-Bloat Minimization:** Strictly displaying documented metrics and columns. No speculative widgets, decorative fluff, or redundant nested cards.
3. **Icon Integrity Constraint:** Strictly utilizing official `@mui/icons-material` symbols (`Search`, `FilterList`, `Close`, `OpenInNew`, `ArrowUpward`, `KeyboardArrowRight`). No arbitrary or hallucinated icons. Vendor logos are rendered cleanly as two-letter monogram avatars (`MS`, `SL`, `GH`, `JR`, `FG`, `DD`).

---

## 📱 Generated Master Screen Catalog

### 1. View 1: License Management (`SCR-LIC-MGMT-01`)
- **Route:** `/manager/licenses`
- **Stitch Screen ID:** `f15ccbba39404967a93b70e24b6f75fe`
- **Files:** `SCR-LIC-MGMT-01.html`, `SCR-LIC-MGMT-01.png`
- **Key Sections:**
  - **Top Grid (3 MUI Cards, 300px height):**
    1. *Total Licenses Card (Col 1-3):* `1,284 Total`, Active Entitlements `1,142 (88.9%)`, Expiring in <=30 Days `18 licenses` (Amber Chip), MoM Growth `+4.5%`.
    2. *Category Distribution Donut (Col 4-7):* Development & DevOps 32%, Productivity & Office 28%, Communication 18%, Design & Creative 12%, Security & Compliance 7%, Other 3%.
    3. *Top 5 Usage Progress Widget (Col 8-12):* Ranked applications with MUI `LinearProgress` (Microsoft 365 94%, Slack 91%, GitHub 88%, Jira 85%, Zoom 81%).
  - **General License Data Grid (9 Core Columns):**
    - Quick search textfield with debounce and search icon adornment.
    - Category & Compliance dropdown filters.
    - Standardized 9 columns: License Name (with monogram avatar), Publisher Name, License Type (outlined chip), Compliance Status (success/warning/error chip), Purchased Amount ($ USD), Licence Entitlement (seats), Active Users, Total Users (ratio e.g. 470/500), Expiry Date (YYYY-MM-DD).
    - Rows: Microsoft 365 Enterprise, Slack Enterprise Grid, GitHub Enterprise, Jira Software & Confluence, Figma Enterprise, Datadog Pro.
    - MUI `TablePagination`: 10 rows per page, page navigation controls.

---

### 2. View 1 Drill-Down: License Detail Drawer (`SCR-LIC-DETAIL-01`)
- **Route:** `/manager/licenses?drawer=detail&id=ms-365`
- **Stitch Screen ID:** `d647069953a5420d9db1a112b92be7eb`
- **Files:** `SCR-LIC-DETAIL-01.html`, `SCR-LIC-DETAIL-01.png`
- **Key Sections:**
  - **Presentation:** 640px right-anchored MUI `Drawer` over the License Management dashboard with dimmed backdrop overlay and active row highlight.
  - **Header:** Software title "Microsoft 365 Enterprise", publisher "Microsoft Corporation", green "Compliant" chip, standard close icon button.
  - **Key Indicators (Compact 2x3 Grid):**
    1. Monthly Cost: `$15,000 / month` (amortized)
    2. Subscriptions: `3 Contracts / POs`
    3. Subscription Types: `2 Types (E3 Enterprise, E5 Security)`
    4. Total Users: `470 Assigned Users (94% utilization)`
    5. Unassigned Subscriptions: `30 Seats Available` (in inventory pool)
    6. Renewal Date: `2027-05-31` (auto-renew in 420 days)
  - **Detailed Information:** Structured clean key-value rows: Vendor contact, Functional description, Category, Subcategory, 36-Month contract term, Annual prepaid billing model.
  - **Useful Links & Policy:** Clean MUI text hyperlinks with `@mui/icons-material/OpenInNew` (Internal License Policy, Vendor Terms of Service, Security Compliance Guidelines, Microsoft Admin Center).
  - **Drawer Footer:** Audit timestamp and MUI action buttons (`Reallocate Seats`, `Manage Contract`).

---

### 3. View 2: Analytics & Health Dashboard (`SCR-ANALYTICS-01`)
- **Route:** `/manager/analytics`
- **Stitch Screen ID:** `bc364f2f2157438188c255f992e7b241`
- **Files:** `SCR-ANALYTICS-01.html`, `SCR-ANALYTICS-01.png`
- **Key Sections:**
  - **Top KPI Health Metrics (4 MUI Cards):**
    1. *Total Annual Spend:* `$1,420,000 USD` (`+3.2% vs approved ceiling`)
    2. *Managed Licenses:* `1,284 Licenses` (across 48 applications)
    3. *Underutilized Accounts:* `312 Accounts` (`24.3%` warning badge)
    4. *Underutilized License Cost:* `$285,600 USD / yr` (`20.1%` wasted spend reclamation target)
  - **Middle Charts:**
    - *Chart 1 (Col 1-7): Application Usage Optimization (ApexCharts Horizontal Stacked Bar)*:
      Segments: Never used (Orange `#FF9800`), Inactive >60d (Gray `#9E9E9E`), Actively used (Green `#4CAF50`).
      MUI ToggleButtonGroup: Top 5 | Top 10 | Top 20.
    - *Chart 2 (Col 8-12): Spend by Department (ApexCharts Donut)*:
      Annualized departmental allocations: Engineering & Product ($580k), Sales & BD ($320k), Tech Support ($180k), Accounting & Finance ($140k), Marketing & Creative ($120k), HR & Operations ($80k). Total center label: `$1.42M Total`.
  - **Bottom Full-Width Chart:**
    - *Chart 3 (Col 1-12): Subscription Usage 12-Month Comparative Dynamics (ApexCharts Dual-Column)*:
      Column 1 (Stacked Deployed Seats): Active (Green), Inactive (Amber), No activity (Dark Gray), Not monitored (Indigo).
      Column 2 (Single Inventory Column): Unassigned (Rose).
      12 monthly data points showing active utilization growth (+34.6%) and unassigned inventory reduction from 220 to 70 seats.
    - *Executive Insight Banner:* Key takeaway highlighting $82,400 in reclaimed software capital.
