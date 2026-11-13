import { Link } from 'react-router-dom';
import { HorizontalBarChart } from '@/components/charts/HorizontalBarChart';
import { SectionCard } from '@/components/cards/SectionCard';
import { KpiCard } from '@/components/cards/KpiCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { InfoTooltip } from '@/components/InfoTooltip';
import { PATHS } from '@/routes/paths';
import { SubscriptionDynamicsChart } from './components/SubscriptionDynamicsChart';
import { useGeneralAnalytics } from './hooks/useGeneralAnalytics';

const number = new Intl.NumberFormat('en-US');
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

function ChartDetailLink({ to, title }: { to: string; title: string }) {
  return <Link className="chart-detail-link" to={to} aria-label={`View ${title} details`}>View details<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></Link>;
}

export default function GeneralAnalyticsPage() {
  const { data, error, breakdowns } = useGeneralAnalytics();
  if (error) return <ErrorState message="Unable to load analytics." />;
  if (!data) return <LoadingState message="Loading analytics..." />;
  const { metrics, applicationUsage, departmentSpend, subscriptionDynamics } = data;

  return <div className="license-health-page">
    <PageHeader title="License Health" tooltip="Executive overview of license utilization and operational efficiency" />
    <section className="health-metrics" aria-label="License health metrics">
      {metrics.map(metric => <KpiCard key={metric.label} title={metric.label} value={metric.value} status={<span className={`metric-note ${metric.tone}`}>{metric.note}</span>} />)}
    </section>
    <div className="health-chart-grid" id="analytics-breakdowns" ref={breakdowns}>
      <SectionCard className="health-chart-card" title="Application Usage" actions={<ChartDetailLink to={PATHS.ANALYTICS_USAGE_DETAIL} title="Application Usage" />}><HorizontalBarChart rows={applicationUsage} max={600} /></SectionCard>
      <SectionCard className="health-chart-card" title="Department Spend" actions={<ChartDetailLink to={PATHS.ANALYTICS_SPEND_DETAIL} title="Department Spend" />}><HorizontalBarChart rows={departmentSpend} max={600000} formatValue={money.format} formatAxis={value => value === 0 ? '$0' : `$${number.format(value / 1000)}k`} /></SectionCard>
    </div>
    <article className="portal-card lifecycle-card">
      <h2 className="inline-flex items-center gap-2"><span>Subscription Dynamics</span><InfoTooltip title="Monthly license seats by status; unassigned seats shown alongside monitored usage." /></h2>
      <SubscriptionDynamicsChart data={subscriptionDynamics} />
    </article>
  </div>;
}
