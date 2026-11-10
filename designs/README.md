# VFast ELMS – UI/UX Minimal Material-UI Designs (Google Stitch)
## Executive Management Portal: License Management & Analytics

> **Project:** VFast – Enterprise License Management System (ELMS)  
> **Google Stitch Project ID:** `5367452734173829716`  
> **Stitch Design System Asset:** `assets/8328167488966181312`  
> **Target Scope:** 2-View Focused Architecture (v4.2 Baseline)  
> **Branch / Worktree:** `uiux/stitch-material-minimal`  
> **Design Directory:** `/designs` (root level)  
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

### Strict Design Principles Applied
1. **Material-UI (MUI v5/v6) Architecture:** Responsive grid, standard cards, structured data tables with pagination, and 640px right-anchored drawers.
2. **Zero-Bloat Minimization:** Strictly displaying documented metrics and columns. All descriptive secondary text converted to clean interactive tooltips (`@mui/material/Tooltip` + `@mui/icons-material/InfoOutlined`).
3. **Icon Integrity Constraint:** Strictly utilizing official `@mui/icons-material` symbols (`Search`, `FilterList`, `Close`, `OpenInNew`, `InfoOutlined`, `ArrowForward`). No arbitrary or hallucinated icons. Vendor logos are rendered cleanly as two-letter monogram avatars (`MS`, `SL`, `GH`, `JR`, `FG`, `DD`).

---

## 📱 Master Screen Catalog & Specifications

### 1. View 1: License Management (`SCR-LIC-MGMT-01`)
- **Route:** `/manager/licenses`
- **Stitch Screen ID:** `f15ccbba39404967a93b70e24b6f75fe`
- **Files:** `designs/SCR-LIC-MGMT-01.html`, `designs/SCR-LIC-MGMT-01.png`
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
- **Files:** `designs/SCR-LIC-DETAIL-01.html`, `designs/SCR-LIC-DETAIL-01.png`
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

### 3. View 2: Analytics & Health Dashboard (`SCR-ANALYTICS-01` - Redesigned v2)
- **Route:** `/manager/analytics`
- **Stitch Screen ID:** `30fc56d9d28a4f23a810fc4324717c95`
- **Files:** `designs/SCR-ANALYTICS-01.html`, `designs/SCR-ANALYTICS-01.png`
- **Key Enhancements (Feedback Applied):**
  - **Subtitles as Tooltips:** All secondary descriptive subtitles under headers, KPI cards, and charts are converted into interactive MUI Tooltip buttons (`@mui/icons-material/InfoOutlined`), keeping the main layout completely uncluttered.
  - **Top 4 KPI Health Metrics:** Total Annual Spend ($1,420,000), Managed Licenses (1,284), Underutilized Accounts (312), and Underutilized License Cost ($285,600/yr).
  - **Chart 1: Application Usage Optimization (Col 7 - Horizontal Stacked Bar):**
    - Zero hardcoded numbers/percentages on bars.
    - Hover tooltip displays exact numbers for Actively used, Inactive (>60d), and Never used.
    - Calibrated horizontal X-axis at bottom `[0, 100, 200, 300, 400, 500 users]` with hairline gridlines for visual referencing.
  - **Chart 2: Spend by Department (Col 5 - Horizontal Bar Chart):**
    - Redesigned from donut chart to a clean **Horizontal Bar Chart** in Ocean Blue (`#0F67B1`).
    - 6 Organizational departments on Y-axis.
    - Calibrated currency X-axis at bottom `[$0, $150k, $300k, $450k, $600k]`.
    - Hover tooltip reveals exact dollar amount and department percentage.
  - **Chart 3: Subscription Usage (Col 12 - Grouped Dual-Column Bar Chart):**
    - Simplified title to **"Subscription Usage"** (removed "12-Month Comparative").
    - Explicit horizontal X-axis (`Jan` to `Dec`) and vertical Y-axis (`0` to `1250 seats`) with horizontal gridlines.
    - Group 1 (Deployed 4-state stacked) vs. Group 2 (Unassigned single column).
    - Removed bulky management insight callout box, replaced with a concise footnote chú thích at the card bottom:
      `* Chú thích: Cột 1 biểu thị các trạng thái bản quyền đã cấp phát (Active, Inactive, No activity, Not monitored); Cột 2 biểu thị tồn kho chưa cấp phát (Unassigned).`
