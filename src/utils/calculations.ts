/**
 * Calculates seat utilization rate
 */
export function calculateUtilizationRate(assigned: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((assigned / total) * 1000) / 10);
}

/**
 * Calculates budget burn rate percentage
 */
export function calculateBurnRate(spent: number, totalBudget: number): number {
  if (totalBudget <= 0) return 0;
  return Math.round((spent / totalBudget) * 1000) / 10;
}
