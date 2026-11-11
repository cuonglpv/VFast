export type AnalyticsBreakdownKind = 'usage' | 'spend';

export interface AnalyticsBreakdownRow {
  id: string;
  label: string;
  value: number;
}

export interface AnalyticsDashboardData {
  metrics: { label: string; value: string; note: string; tone: string }[];
  applicationUsage: { label: string; value: number }[];
  departmentSpend: { label: string; value: number }[];
  subscriptionDynamics: {
    months: string[];
    seatStatuses: { name: string; color: string; values: number[] }[];
    unassigned: { name: string; color: string; values: number[] };
  };
}
