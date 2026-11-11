export interface MonthlyBudgetPlan {
  fiscalYear: number;
  currency: 'USD';
  status: 'Draft';
  annualCeiling: number;
  monthlyAllocations: number[];
  categoryCaps: { category: string; percentage: number }[];
}

export interface BudgetKpiOverview {
  fiscalYear: number;
  month: number;
  allocatedBudget: number;
  actualSpendMtd: number;
  remainingBudget: number;
  burnRatePercentage: number;
  fixedRenewalsAmount: number;
  expiringLicensesCount: number;
  commitmentPercentage: number;
  recoverableWaste: number;
}

export interface RenewalObligation {
  id: string;
  softwareName: string;
  publisher: string;
  category: string;
  renewalDate: string;
  renewalCost: number;
  activeUtilizationRate: number;
  status: 'Critical' | 'Warning' | 'Healthy';
}

export interface CategoryBudgetShare {
  category: string;
  allocated: number;
  spent: number;
  percentage: number;
}

export interface BudgetDashboardData {
  fiscalYears: number[];
  allocatedBudget: number;
  actualSpendMtd: number;
  remainingBudget: number;
  remainingPercentage: number;
  renewalCommitmentPercentage: number;
  burnRatePercentage: number;
  recoverableWaste: number;
  idleSeats: number;
  burnThresholdMargin: number;
  categoryShares: { category: string; spent: number; allocated: number; color: string }[];
  ledger: { department: string; allocated: number; actual: number; color: string; status: 'Optimal' | 'Warning' }[];
  monthlySpend: { month: string; actual: number }[];
  renewals: RenewalObligation[];
}
