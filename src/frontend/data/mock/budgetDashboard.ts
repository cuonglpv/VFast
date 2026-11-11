import type { BudgetDashboardData } from "@/types/budget";
import { mockRenewals } from "./renewals";

// These values reproduce the current design sample. They are not financial records.
export const mockBudgetDashboard: BudgetDashboardData = {
  fiscalYears: [2026, 2025, 2024],
  allocatedBudget: 160000,
  actualSpendMtd: 131600,
  remainingBudget: 28400,
  remainingPercentage: 17.8,
  renewalCommitmentPercentage: 115.6,
  burnRatePercentage: 82.3,
  recoverableWaste: 12450,
  idleSeats: 42,
  burnThresholdMargin: 15,
  categoryShares: [
    {
      category: "Dev & DevOps",
      spent: 41000,
      allocated: 46000,
      color: "#0F67B1",
    },
    {
      category: "Productivity",
      spent: 36000,
      allocated: 38000,
      color: "#38BDF8",
    },
    {
      category: "Security & Infra",
      spent: 19000,
      allocated: 22000,
      color: "#64748B",
    },
    {
      category: "Design & Creative",
      spent: 16000,
      allocated: 20000,
      color: "#94A3B8",
    },
    {
      category: "Cloud & Infra",
      spent: 15800,
      allocated: 18000,
      color: "#0EA5E9",
    },
  ],
  ledger: [
    {
      department: "Dev & DevOps",
      allocated: 460000,
      actual: 410000,
      color: "bg-blue-500",
      status: "Optimal",
    },
    {
      department: "Productivity",
      allocated: 380000,
      actual: 360000,
      color: "bg-indigo-500",
      status: "Optimal",
    },
    {
      department: "Security",
      allocated: 220000,
      actual: 190000,
      color: "bg-cyan-500",
      status: "Optimal",
    },
    {
      department: "Cloud & Infra",
      allocated: 180000,
      actual: 178000,
      color: "bg-sky-500",
      status: "Warning",
    },
  ],
  monthlySpend: [
    { month: "Jan", actual: 28000 },
    { month: "Feb", actual: 43000 },
    { month: "Mar", actual: 55000 },
    { month: "Apr", actual: 65000 },
    { month: "May", actual: 76000 },
    { month: "Jun", actual: 84000 },
    { month: "Jul", actual: 95000 },
    { month: "Aug", actual: 108000 },
    { month: "Sep", actual: 120000 },
    { month: "Oct", actual: 132000 },
    { month: "Nov", actual: 143000 },
    { month: "Dec", actual: 150000 },
  ],
  renewals: mockRenewals,
};
