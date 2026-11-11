import type { AnalyticsBreakdownKind, AnalyticsBreakdownRow, AnalyticsDashboardData } from '@/types/analytics';
import type { BudgetDashboardData } from '@/types/budget';
import type { UserRecord } from '@/types/user';
import { mockUsers } from '@/data/mock/users';
import { applicationUsageDetails, departmentSpendDetails, mockAnalyticsDashboard } from '@/data/mock/analytics';
import { mockBudgetDashboard } from '@/data/mock/budgetDashboard';

export interface DashboardRepository {
  listUsers(): Promise<UserRecord[]>;
  getAnalytics(): Promise<AnalyticsDashboardData>;
  getAnalyticsBreakdown(kind: AnalyticsBreakdownKind): Promise<AnalyticsBreakdownRow[]>;
  getBudget(): Promise<BudgetDashboardData>;
}

export const mockDashboardRepository: DashboardRepository = {
  async listUsers() { return mockUsers; },
  async getAnalytics() { return mockAnalyticsDashboard; },
  async getAnalyticsBreakdown(kind) { return kind === 'usage' ? applicationUsageDetails : departmentSpendDetails; },
  async getBudget() { return mockBudgetDashboard; },
};
