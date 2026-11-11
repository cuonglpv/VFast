import { HorizontalBarChart, SubscriptionDynamicsChart } from '@/components/LicenseHealthCharts';

const metrics = [
  { label: 'Annual Spend', value: '$1,420,000', note: 'Within Budget Cap', tone: 'positive' },
  { label: 'Managed Licenses', value: '1,284', note: '48 Active Apps', tone: 'neutral' },
  { label: 'Idle Accounts', value: '312', note: '24.3% Rate', tone: 'warning' },
  { label: 'Wasted Spend', value: '$285,600', note: '20.1% Leakage', tone: 'negative' },
];

const applicationUsage = [
  { label: 'Engineering', value: 550 }, { label: 'Sales & BO', value: 410 },
  { label: 'Tech Support', value: 275 }, { label: 'Accounting', value: 210 },
  { label: 'Marketing', value: 175 }, { label: 'Operations', value: 108 },
];
const departmentSpend = applicationUsage.map(row => ({ ...row, value: row.value * 1000 }));

export default function GeneralAnalyticsPage() {
  return <div className="license-health-page">
    <div className="page-heading"><h1>License Health</h1><p>Executive overview of license utilization and operational efficiency</p></div>
    <section className="health-metrics" aria-label="License health metrics">{metrics.map(metric => <article className="portal-card health-metric" key={metric.label}><h2>{metric.label}</h2><strong>{metric.value}</strong><span className={'metric-note ' + metric.tone}>{metric.note}</span></article>)}</section>
    <div className="health-chart-grid"><article className="portal-card health-chart-card"><h2>Application Usage</h2><HorizontalBarChart rows={applicationUsage} max={600} /></article><article className="portal-card health-chart-card"><h2>Department Spend</h2><HorizontalBarChart rows={departmentSpend} max={600000} currency /></article></div>
    <article className="portal-card lifecycle-card"><h2>Subscription Dynamics</h2><p>Monthly license seats by status; unassigned seats shown alongside monitored usage.</p><SubscriptionDynamicsChart /></article>
  </div>;
}
