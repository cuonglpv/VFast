import type { AnalyticsBreakdownRow, AnalyticsDashboardData } from '@/types/analytics';
import { subscriptionDynamics } from './subscriptionDynamics';

export const metrics = [
  { label: 'Annual Spend', value: '$1,420,000', note: 'Within Budget Cap', tone: 'positive' },
  { label: 'Managed Licenses', value: '1,284', note: '48 Active Apps', tone: 'neutral' },
  { label: 'Idle Accounts', value: '312', note: '24.3% Rate', tone: 'warning' },
  { label: 'Wasted Spend', value: '$285,600', note: '20.1% Leakage', tone: 'negative' },
];

const usageRecords = [
  { label: 'Engineering', value: 550 }, { label: 'Sales & BO', value: 410 },
  { label: 'Tech Support', value: 275 }, { label: 'Accounting', value: 210 },
  { label: 'Marketing', value: 175 }, { label: 'Operations', value: 108 },
];
// Full breakdown fixtures. Dashboard charts show only the first six ranked rows.
export const applicationUsageDetails: AnalyticsBreakdownRow[] = usageRecords.map(row => ({ ...row, id: row.label.toLowerCase().replace(/[^a-z0-9]+/g, '-') }));
export const departmentSpendDetails: AnalyticsBreakdownRow[] = applicationUsageDetails.map(row => ({ ...row, value: row.value * 1000 }));
export const applicationUsage = [...applicationUsageDetails].sort((a, b) => b.value - a.value).slice(0, 6);
export const departmentSpend = [...departmentSpendDetails].sort((a, b) => b.value - a.value).slice(0, 6);

export const mockAnalyticsDashboard: AnalyticsDashboardData = { metrics, applicationUsage, departmentSpend, subscriptionDynamics };
