import type { MonthlyBudgetPlan } from '@/types/budget';

export const budgetMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** Parse USD text to integer cents; invalid or incomplete input stays invalid. */
export function parseBudgetAmount(input: string): number | null {
  const text = input.trim().replace(/^\$\s*/, '');
  if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/.test(text)) return null;
  const [whole, fraction = ''] = text.replace(/,/g, '').split('.');
  const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  return Number.isSafeInteger(cents) && cents >= 0 ? cents : null;
}

export function formatBudgetAmount(cents: number): string {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 }).format(cents / 100);
}

export function distributeBudgetEvenly(cents: number): number[] {
  const base = Math.floor(cents / 12);
  const remainder = cents % 12;
  return budgetMonths.map((_, index) => base + (index < remainder ? 1 : 0));
}

export function budgetPlanError(plan: MonthlyBudgetPlan): string | null {
  const moneyValid = (value: number) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && Number.isSafeInteger(Math.round(value * 100)) && Math.abs(value * 100 - Math.round(value * 100)) < .00001;
  if (!Number.isInteger(plan.fiscalYear) || plan.fiscalYear < 1900 || plan.fiscalYear > 9999) return 'Choose a valid fiscal year.';
  if (plan.currency !== 'USD' || plan.status !== 'Draft') return 'This form saves USD budget drafts.';
  if (!moneyValid(plan.annualCeiling) || plan.annualCeiling <= 0) return 'Enter an annual ceiling greater than zero, with up to two decimal places.';
  if (!Array.isArray(plan.monthlyAllocations) || plan.monthlyAllocations.length !== 12 || !plan.monthlyAllocations.every(moneyValid)) return 'Enter a non-negative amount for all 12 months, with up to two decimal places.';
  const total = plan.monthlyAllocations.reduce((sum, value) => sum + Math.round(value * 100), 0);
  if (!Number.isSafeInteger(total) || total > Math.round(plan.annualCeiling * 100)) return 'The sum of 12 months exceeds the annual ceiling. Reduce allocations or increase the ceiling.';
  if (!Array.isArray(plan.categoryCaps) || !plan.categoryCaps.length || !plan.categoryCaps.every(cap => cap && typeof cap.category === 'string' && cap.category.trim() && Number.isInteger(cap.percentage) && cap.percentage >= 0 && cap.percentage <= 100)) return 'Category caps must be between 0% and 100%.';
  if (new Set(plan.categoryCaps.map(cap => cap.category)).size !== plan.categoryCaps.length) return 'Each category can have only one cap.';
  if (plan.categoryCaps.reduce((sum, cap) => sum + cap.percentage, 0) > 100) return 'Category caps exceed 100%. Reduce a cap before saving.';
  return null;
}
