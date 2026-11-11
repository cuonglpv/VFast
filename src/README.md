# VFast Frontend Architecture Guide (`/src`)

This document outlines the architectural conventions and directory layout for the VFast Enterprise License Management System (ELMS) frontend application built with **React**, **Vite**, **TypeScript**, and **Material-UI (MUI v6)**.

---

## 📁 Directory Structure Overview

```
src/
├── components/          # Reusable, domain-agnostic or molecular UI components
│   ├── cards/           # KPI cards, metric widgets (4-element minimalist contract)
│   ├── layout/          # Shell layout: Header, Sidebar, MainLayout
│   ├── tables/          # Shared data grid tables and pagination wrappers
│   └── index.ts         # Central components barrel export
│
├── pages/               # Screen-level route views (corresponding to SCR-* IDs)
│   ├── licenses/        # License Management (SCR-LIC-MGMT-01)
│   ├── budget/          # Budget Analytics & Forecast (SCR-BUDGET-ANALYTICS-01)
│   ├── users/           # User & Access Management (SCR-USER-MGMT-01)
│   ├── analytics/       # Cross-platform General Analytics (SCR-ANALYTICS-01)
│   └── index.ts         # Central pages barrel export
│
├── sections/            # Domain-specific feature blocks composing pages
│   ├── licenses/        # License tables, top filter bars, action modals
│   ├── budget/          # Budget KPI grids, 640px Renewals Drawer (SCR-BUDGET-RENEWALS-01)
│   └── index.ts         # Central sections barrel export
│
├── routes/              # Client-side routing configuration
│   ├── paths.ts         # Strongly-typed constant route URL paths
│   ├── router.tsx       # React Router DOM (v7) browser router hierarchy
│   └── index.ts         # Central routes export
│
├── types/               # TypeScript interfaces, domain models, and API types
│   ├── license.ts       # LicenseItem, LicenseStatus, MeasurementArchetype
│   ├── budget.ts        # BudgetKpiOverview, RenewalObligation, CategoryBudgetShare
│   ├── user.ts          # UserAccount, UserRole
│   └── index.ts         # Central types barrel export
│
├── utils/               # Pure utility functions and formatters
│   ├── formatCurrency.ts # USD currency formatting ($1,280,000 / $1.2M compact)
│   ├── formatDate.ts    # Date localized display and countdown calculations
│   ├── calculations.ts  # Burn rate, seat utilization calculations
│   └── index.ts         # Central utils barrel export
│
├── theme/               # Material-UI Theme & Design Tokens
│   ├── theme.ts         # Minimal Ocean Blue design tokens (IA v5.3)
│   └── index.ts
│
├── App.tsx              # App provider tree (ThemeProvider, CssBaseline, RouterProvider)
├── main.tsx             # Application bootstrap & DOM mount
└── index.css            # Base CSS reset and typography foundations
```

---

## 🏛️ Layer Responsibilities & Architecture Rules

### 1. `components/` (Molecular UI Elements)
- **Role:** Pure, reusable UI building blocks independent of backend domain logic.
- **Rules:**
  - Must accept data and callbacks via props (`props-down, events-up`).
  - Follows strict **IA v5.3 Minimalist Design Rules**:
    - **KPI Cards (`KpiCard`):** Strictly 4 visual rows (Header + Tooltip, Hero Value, Single Status Chip/Subtitle, Optional Action Trigger). No nested bullet points or stacked sub-metrics.
    - Zero arbitrary icons — use official `@mui/icons-material`.

### 2. `sections/` (Feature Composite Blocks)
- **Role:** Feature-specific sections that assemble multiple components into a cohesive functional block (e.g., `LicenseListSection`, `BudgetKpiSection`, `BudgetRenewalsDrawerSection`).
- **Rules:**
  - Manages internal section state (e.g., filter dropdowns, table pagination).
  - Can be reused across different views or drawers without rewriting table/grid boilerplate.

### 3. `pages/` (View Containers)
- **Role:** The highest-level container rendered for each route in `routes/router.tsx`.
- **Rules:**
  - Corresponds 1-to-1 with screen specifications (`SCR-LIC-MGMT-01`, `SCR-BUDGET-ANALYTICS-01`, etc.).
  - Orchestrates page title, breadcrumbs, data fetching (loaders/hooks), and section composition.

### 4. `routes/` (Routing & Navigation)
- **Role:** Declarative routing using `react-router-dom`.
- **Rules:**
  - All URL strings must be centralized in `routes/paths.ts` to prevent broken links and magic strings.
  - Supports nested route hierarchies within `MainLayout`.

### 5. `types/` (TypeScript Domain Definitions)
- **Role:** Single source of truth for all data structures, API responses, and filter states.
- **Rules:**
  - Strictly typed — no `any` types.
  - Matches business domain models (e.g. Allocation, Concurrent, Metered, Capacity archetypes).

### 6. `utils/` (Pure Helper Functions)
- **Role:** Stateless helper functions for calculations, date/time formatting, and currency manipulation.
- **Rules:**
  - Pure functions with 100% deterministic outputs suitable for unit testing.

---

## 🎨 Theme Tokens & Palette (Minimal Ocean)
- **Canvas Background:** Light Slate Grey (`#F8FAFC`)
- **Card Surface:** Pure White (`#FFFFFF`) with 1px hairline border (`#E2E8F0`)
- **Primary Brand:** Ocean Blue (`#0F67B1`)
- **Primary Container:** Soft Sky (`#E0F2FE`)
- **Text Primary:** Deep Slate (`#0F172A`)
- **Text Secondary:** Slate Grey (`#64748B`)
- **Status Accents:** Emerald Green (`#10B981`), Warm Amber (`#F59E0B`), Crimson (`#EF4444`)

---

## 🚀 Running the Project

```bash
# Install dependencies
pnpm install
# or
npm install

# Start Vite dev server
pnpm dev
# or
npm run dev

# Build production bundle with type checking
pnpm build
# or
npm run build
```
