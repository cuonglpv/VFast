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
