import { BudgetRenewalsDrawerSection } from './components/BudgetRenewalsDrawerSection';
import { CategoryBudgetAllocation, AnnualSpendingTrajectory } from './components/BudgetCharts';
import { useBudgetAnalytics } from './hooks/useBudgetAnalytics';
import { formatCurrency } from '@/utils';
import { StatusBadge } from '@/components/StatusBadge';
import { InfoTooltip } from '@/components/InfoTooltip';
import { PageHeader } from '@/components/layout/PageHeader';
import { KpiCard } from '@/components/cards/KpiCard';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import type { BudgetDashboardData } from '@/types/budget';

export function BudgetAnalyticsPage() {
  const { dashboard, error, drawerOpen, setDrawerOpen, currency, setCurrency } = useBudgetAnalytics();
  if (error) return <ErrorState message="Unable to load budget analytics." />;
  if (!dashboard) return <LoadingState message="Loading budget analytics..." />;
  const columns: TableColumn<BudgetDashboardData['ledger'][number]>[] = [
    { key: 'department', header: 'Department', className: 'table-name', headerClassName: '', cell: row => row.department },
    { key: 'allocated', header: 'Allocated Budget (USD)', className: 'table-number', cell: row => formatCurrency(row.allocated) },
    { key: 'actual', header: 'Actual Spend (USD)', className: 'table-number', cell: row => formatCurrency(row.actual) },
    { key: 'variance', header: 'Variance (USD)', className: 'table-number', cell: row => <>{row.allocated >= row.actual ? '+' : '?'}{formatCurrency(Math.abs(row.allocated - row.actual))}</> },
    { key: 'percentage', header: 'Variance (%)', className: 'table-number', cell: row => <>{row.allocated >= row.actual ? '+' : '?'}{row.allocated ? Math.abs((row.allocated - row.actual) / row.allocated * 100).toFixed(1) : '0.0'}%</> },
    { key: 'status', header: 'Status', className: 'table-status', cell: row => <StatusBadge domain="budget" status={row.status} /> },
  ];
  return (
    <div className="budget-analytics-page space-y-6">
      <PageHeader title="Budget Management" tooltip="Predictive expenditure tracking, monthly budget planning, and renewal commitments." className="budget-page-header" contentClassName="budget-heading-copy" titleClassName="page-title inline-flex items-center gap-2" actions={
<div className="budget-header-actions">
          <div className="budget-year-control">
            <select aria-label="Fiscal year">
              {dashboard.fiscalYears.map((year) => (
                <option key={year}>FY {year}</option>
              ))}
            </select>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="m4 6 4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div
            className="budget-currency-control"
            role="group"
            aria-label="Display currency"
          >
            <Button variant="plain"
              type="button"
              aria-pressed={currency === "USD"}
              onClick={() => setCurrency("USD")}
            >
              USD ($)
            </Button>
            <Button variant="plain"
              type="button"
              aria-pressed={currency === "VND"}
              onClick={() => setCurrency("VND")}
            >
              VND (₫)
            </Button>
          </div>
          <Button variant="plain" type="button" className="budget-primary-action">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M10 4v12M4 10h12"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            Set Monthly Budget
          </Button>
        </div>
      } />

      <section className="budget-kpi-grid" aria-label="Budget overview">
        <KpiCard variant="budget" title="Remaining Budget" tooltipText="Available uncommitted budget for current cycle" value={formatCurrency(dashboard.remainingBudget)} status={<span className="metric-note positive">{dashboard.remainingPercentage}% Left</span>} />
        <KpiCard variant="budget" title="Next Month Renewals" tooltipText="Upcoming fixed license renewal obligations" value={`${dashboard.renewalCommitmentPercentage}%`} status={<>
          <span className="metric-note warning">{dashboard.renewals.length} Expiring</span>
          <Button variant="plain" className="budget-renewals-link" onClick={() => setDrawerOpen(true)}>View Renewals ({dashboard.renewals.length})<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></Button>
        </>} footer={<p className="budget-kpi-description" />} />
        <KpiCard variant="budget" title="Budget Consumed" tooltipText="MTD burn rate compared to budget ceiling" value={`${dashboard.burnRatePercentage}%`} valueTooltip={`MTD Spend: ${formatCurrency(dashboard.actualSpendMtd)} / ${formatCurrency(dashboard.allocatedBudget)}`} status={<StatusBadge domain="budget" status="45K Surplus" />} />
        <KpiCard variant="budget" title="Recoverable Waste" tooltipText="Identified spend from idle accounts inactive >60 days" value={formatCurrency(dashboard.recoverableWaste)} status={<StatusBadge domain="budget" status="312 Idle Seats" />} />
      </section>

      <div className="budget-chart-grid">
        <CategoryBudgetAllocation
          shares={dashboard.categoryShares}
          total={dashboard.allocatedBudget}
          margin={dashboard.burnThresholdMargin}
        />
        <AnnualSpendingTrajectory
          data={dashboard.monthlySpend}
          budgetCap={dashboard.allocatedBudget}
        />
      </div>

      {/* BOTTOM SECTION: DEPARTMENTAL BUDGET LEDGER TABLE */}
      <div className="table-surface">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="section-title inline-flex items-center gap-2">
              <span>Departmental Budget Ledger</span>
              <InfoTooltip title="Breakdown of approved allocations, spend burn rate, and variance reconciliation." />
            </h2>
          </div>
          <Button variant="plain" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
            <span className="material-symbols-outlined text-base text-slate-500">
              file_download
            </span>
            <span>Export CSV</span>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <DataTable rows={dashboard.ledger} columns={columns} getRowKey={row => row.department} label="Departmental budget ledger" className="data-table budget-ledger-table" />
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
