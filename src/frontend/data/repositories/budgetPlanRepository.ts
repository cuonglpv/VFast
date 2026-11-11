import type { MonthlyBudgetPlan } from '@/types/budget';
import { budgetPlanError } from '@/utils/budgetPlan';

export interface BudgetPlanRepository {
  get(fiscalYear: number): Promise<MonthlyBudgetPlan | null>;
  save(plan: MonthlyBudgetPlan): Promise<MonthlyBudgetPlan>;
}

const storageKey = (year: number) => `vfast-monthly-budget-plan-v1-${year}`;

export const browserBudgetPlanRepository: BudgetPlanRepository = {
  async get(fiscalYear) {
    const saved = localStorage.getItem(storageKey(fiscalYear));
    if (saved === null) return null;
    const parsed: unknown = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object') throw new Error('Invalid saved budget plan.');
    const plan = parsed as MonthlyBudgetPlan;
    if (plan.fiscalYear !== fiscalYear || budgetPlanError(plan)) throw new Error('Invalid saved budget plan.');
    return plan;
  },
  async save(plan) {
    const error = budgetPlanError(plan);
    if (error) throw new Error(error);
    const serialized = JSON.stringify(plan);
    localStorage.setItem(storageKey(plan.fiscalYear), serialized);
    return JSON.parse(serialized) as MonthlyBudgetPlan;
  },
};
