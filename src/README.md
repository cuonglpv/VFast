# VFast Frontend Architecture Guide (`/src`)

This document outlines the architectural conventions and directory layout for the VFast Enterprise License Management System (ELMS) frontend application built with **React**, **Vite**, **TypeScript**, **Tailwind CSS v4**, and **Material-UI (MUI v6)**.

---

## 📁 Directory Structure Overview

```
src/
├── layouts/             # App shell layouts & navigation containers
│   ├── Header.tsx       # Top navigation bar (Brand, Monogram, Profile)
│   ├── Sidebar.tsx      # Left vertical navigation menu with route highlights
│   ├── MainLayout.tsx   # Base application shell combining Header, Sidebar & Outlet
│   └── index.ts         # Central layout barrel export
│
├── components/          # Reusable, atomic / molecular UI components
│   ├── cards/           # KPI cards, metric widgets (4-element minimalist contract)
│   ├── tables/          # Shared data grid tables and pagination wrappers
│   └── index.ts         # Central components barrel export
│
├── sections/            # Domain-specific feature blocks composing pages
│   ├── licenses/        # License tables, top filter bars, action modals
│   ├── budget/          # Budget KPI grids, 640px Renewals Drawer (SCR-BUDGET-RENEWALS-01)
│   └── index.ts         # Central sections barrel export
│
├── pages/               # Screen-level route views (corresponding to SCR-* IDs)
│   ├── licenses/        # License Management (SCR-LIC-MGMT-01)
│   ├── budget/          # Budget Analytics & Forecast (SCR-BUDGET-ANALYTICS-01)
│   ├── users/           # User & Access Management (SCR-USER-MGMT-01)
│   ├── analytics/       # Cross-platform General Analytics (SCR-ANALYTICS-01)
│   └── index.ts         # Central pages barrel export
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
├── layout/              # Alias re-export compatible with `layouts/`
├── page/                # Alias re-export compatible with `pages/`
├── componant/           # Alias re-export compatible with `components/`
├── section/             # Alias re-export compatible with `sections/`
├── route/               # Alias re-export compatible with `routes/`
│
├── App.tsx              # App provider tree (ThemeProvider, CssBaseline, RouterProvider)
├── main.tsx             # Application bootstrap & DOM mount
└── index.css            # Tailwind CSS v4 (@import "tailwindcss";) & @theme definitions
```

---

## 🎨 Styling: Tailwind CSS v4 + Material-UI (MUI v6)

The project leverages both **Tailwind CSS v4** (via `@tailwindcss/vite`) for rapid utility-first layout styling and **Material-UI v6** for enterprise accessible components (Modals, Drawers, Menus, DataGrids).

### Tailwind Theme Tokens (`@theme` in `src/index.css`)
- `bg-brand-blue` (`#0F67B1`)
- `bg-brand-sky` (`#E0F2FE`)
- `bg-brand-canvas` (`#F8FAFC`)
- `text-brand-ink` (`#0F172A`)
- `text-brand-muted` (`#64748B`)
- `border-brand-border` (`#E2E8F0`)
- `text-brand-success` (`#10B981`)
- `text-brand-warning` (`#F59E0B`)
- `text-brand-error` (`#EF4444`)

---

## 🚀 Running the Project

```bash
# Start Vite dev server
pnpm dev

# Build production bundle with type checking
pnpm build
```
