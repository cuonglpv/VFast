import React, { useState } from 'react';
import { BudgetRenewalsDrawerSection } from '@/sections/budget';
import { dashboardRepository } from '@/data/repositories';
import { useRepositoryData } from '@/data/useRepositoryData';
import { formatCurrency } from '@/utils';
import { StatusBadge } from '@/components/StatusBadge';
import { AnnualSpendingTrajectory, CategoryBudgetAllocation } from '@/components/BudgetCharts';

function BudgetInfo({ label }: { label: string }) {
  return <span className="budget-kpi-info" role="img" aria-label={label} title={label}>
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" /><path d="M8 7v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><circle cx="8" cy="4.7" r=".75" fill="currentColor" /></svg>
  </span>;
}

export const BudgetAnalyticsPage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'VND'>('USD');
  const { data: dashboard, error } = useRepositoryData(dashboardRepository.getBudget);

  if (error) return <p role="alert">Unable to load budget analytics.</p>;
  if (!dashboard) return <p role="status">Loading budget analytics...</p>;

  return (
    <div className="budget-analytics-page space-y-6">

      <header className="budget-page-header">
        <div className="budget-heading-copy">
          <h1 className="page-title">Budget &amp; Financial Intelligence</h1>
          <p className="page-description">Predictive expenditure tracking, monthly budget planning, and renewal commitments.</p>
        </div>
        <div className="budget-header-actions">
          <div className="budget-year-control">
            <select aria-label="Fiscal year">
              {dashboard.fiscalYears.map(year => <option key={year}>FY {year}</option>)}
            </select>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="budget-currency-control" role="group" aria-label="Display currency">
            <button type="button" aria-pressed={currency === 'USD'} onClick={() => setCurrency('USD')}>USD ($)</button>
            <button type="button" aria-pressed={currency === 'VND'} onClick={() => setCurrency('VND')}>VND (₫)</button>
          </div>
          <button type="button" className="budget-primary-action">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
            Set Monthly Budget
          </button>
        </div>
      </header>

      <section className="budget-kpi-grid" aria-label="Budget overview">
        <article className="budget-kpi-card">
          <div className="budget-kpi-heading">
            <h2>Remaining Budget</h2>
            <BudgetInfo label="Available uncommitted budget for current cycle" />
          </div>
          <strong className="budget-kpi-value">{formatCurrency(dashboard.remainingBudget)}</strong>
          <div className="budget-kpi-footer">
            <div className="budget-kpi-state"><span className="metric-note positive">{dashboard.remainingPercentage}% Left</span></div>
            <p className="budget-kpi-description">Current Month Safe Pace</p>
          </div>
        </article>

        <article className="budget-kpi-card">
          <div className="budget-kpi-heading">
            <h2>Next Month Renewals</h2>
            <BudgetInfo label="Upcoming fixed license renewal obligations" />
          </div>
          <strong className="budget-kpi-value">{dashboard.renewalCommitmentPercentage}%</strong>
          <div className="budget-kpi-footer">
            <div className="budget-kpi-state">
              <span className="metric-note warning">{dashboard.renewals.length} Expiring</span>
              <button type="button" className="budget-renewals-link" onClick={() => setDrawerOpen(true)}>
                View Renewals ({dashboard.renewals.length})
                <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            <p className="budget-kpi-description">Committed to recurring contracts</p>
          </div>
        </article>

        <article className="budget-kpi-card">
          <div className="budget-kpi-heading">
            <h2>Budget Consumed</h2>
            <BudgetInfo label="MTD burn rate compared to budget ceiling" />
          </div>
          <strong className="budget-kpi-value">{dashboard.burnRatePercentage}%</strong>
          <div className="budget-kpi-footer">
            <div className="budget-kpi-state"><StatusBadge domain="budget" status="High Burn" /></div>
            <p className="budget-kpi-description">MTD Spend: {formatCurrency(dashboard.actualSpendMtd)} / {formatCurrency(dashboard.allocatedBudget)}</p>
          </div>
        </article>

        <article className="budget-kpi-card">
          <div className="budget-kpi-heading">
            <h2>Recoverable Waste</h2>
            <BudgetInfo label="Identified spend from idle accounts inactive >60 days" />
          </div>
          <strong className="budget-kpi-value">{formatCurrency(dashboard.recoverableWaste)}</strong>
          <div className="budget-kpi-footer">
            <div className="budget-kpi-state"><StatusBadge domain="budget" status="Actionable" /></div>
            <p className="budget-kpi-description">{dashboard.idleSeats} idle seats ready to reclaim</p>
          </div>
        </article>
      </section>

      <div className="budget-chart-grid">
        <CategoryBudgetAllocation shares={dashboard.categoryShares} total={dashboard.allocatedBudget} margin={dashboard.burnThresholdMargin} />
        <AnnualSpendingTrajectory data={dashboard.monthlySpend} budgetCap={dashboard.allocatedBudget} />
      </div>

      {/* BOTTOM SECTION: DEPARTMENTAL BUDGET LEDGER TABLE */}
      <div className="table-surface">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="section-title">Departmental Budget Ledger</h2>
            <p className="section-description mt-0.5">
              Breakdown of approved allocations, spend burn rate, and variance reconciliation.
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
            <span className="material-symbols-outlined text-base text-slate-500">file_download</span>
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table budget-ledger-table" aria-label="Departmental budget ledger">
            <thead><tr>
              <th scope="col">Department</th>
              <th scope="col" className="table-number">Allocated Budget (USD)</th>
              <th scope="col" className="table-number">Actual Spend (USD)</th>
              <th scope="col" className="table-number">Variance (USD)</th>
              <th scope="col" className="table-number">Variance (%)</th>
              <th scope="col" className="table-status">Status</th>
            </tr></thead>
            <tbody>
              {dashboard.ledger.map(row => {
                const variance = row.allocated - row.actual;
                const variancePercentage = row.allocated ? Math.abs(variance / row.allocated * 100).toFixed(1) : '0.0';
                const sign = variance >= 0 ? '+' : '?';
                return <tr key={row.department}>
                  <td className="table-name">{row.department}</td>
                  <td className="table-number">{formatCurrency(row.allocated)}</td>
                  <td className="table-number">{formatCurrency(row.actual)}</td>
                  <td className="table-number">{sign}{formatCurrency(Math.abs(variance))}</td>
                  <td className="table-number">{sign}{variancePercentage}%</td>
                  <td className="table-status"><StatusBadge domain="budget" status={row.status} /></td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 640px Slide-over Renewals Drawer (`SCR-BUDGET-RENEWALS-01`) */}
      <BudgetRenewalsDrawerSection
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        renewals={dashboard.renewals}
      />
    </div>
  );
};

export default BudgetAnalyticsPage;
