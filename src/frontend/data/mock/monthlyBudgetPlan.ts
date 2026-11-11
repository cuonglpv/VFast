import type { MonthlyBudgetPlan } from '@/types/budget';

export function createMockBudgetPlan(fiscalYear: number): MonthlyBudgetPlan {
  return {
    fiscalYear,
    currency: 'USD',
    status: 'Draft',
    annualCeiling: 1440000,
    monthlyAllocations: Array.from({ length: 12 }, () => 120000),
    categoryCaps: [
      { category: 'Dev & DevOps', percentage: 40 },
      { category: 'Productivity', percentage: 30 },
      { category: 'Security', percentage: 15 },
      { category: 'Cloud & Infra', percentage: 15 },
    ],
  };
}
