import { useLayoutEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HorizontalBarChart, SubscriptionDynamicsChart } from '@/components/LicenseHealthCharts';
import { dashboardRepository } from '@/data/repositories';
import { useRepositoryData } from '@/data/useRepositoryData';
import { PATHS } from '@/routes/paths';

export default function GeneralAnalyticsPage() {
  const { data, error } = useRepositoryData(dashboardRepository.getAnalytics);
  const { hash } = useLocation();
  const breakdowns = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (data && hash === '#analytics-breakdowns') breakdowns.current?.scrollIntoView({ block: 'start' });
  }, [data, hash]);
  if (error) return <p role="alert">Unable to load analytics.</p>;
  if (!data) return <p role="status">Loading analytics...</p>;
  const { metrics, applicationUsage, departmentSpend, subscriptionDynamics } = data;
  return <div className="license-health-page">
    <div className="page-heading"><h1>License Health</h1><p>Executive overview of license utilization and operational efficiency</p></div>
    <section className="health-metrics" aria-label="License health metrics">
      {metrics.map(metric => <article className="portal-card health-metric" key={metric.label}><h2>{metric.label}</h2><strong>{metric.value}</strong><span className={'metric-note ' + metric.tone}>{metric.note}</span></article>)}
    </section>
    <div className="health-chart-grid" id="analytics-breakdowns" ref={breakdowns}>
      <article className="portal-card health-chart-card"><div className="health-chart-heading"><h2>Application Usage</h2><Link className="chart-detail-link" to={PATHS.ANALYTICS_USAGE_DETAIL} aria-label="View Application Usage details">View details<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></Link></div><HorizontalBarChart rows={applicationUsage} max={600} /></article>
      <article className="portal-card health-chart-card"><div className="health-chart-heading"><h2>Department Spend</h2><Link className="chart-detail-link" to={PATHS.ANALYTICS_SPEND_DETAIL} aria-label="View Department Spend details">View details<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></Link></div><HorizontalBarChart rows={departmentSpend} max={600000} currency /></article>
    </div>
    <article className="portal-card lifecycle-card">
      <h2>Subscription Dynamics</h2>
      <p>Monthly license seats by status; unassigned seats shown alongside monitored usage.</p>
      <SubscriptionDynamicsChart data={subscriptionDynamics} />
    </article>
  </div>;
}
