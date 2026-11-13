from pathlib import Path
import re

root = Path(__file__).resolve().parents[1] / 'src/frontend'

def read(path):
    return (root / path).read_text(encoding='utf-8')

def write(path, text):
    (root / path).write_text(text, encoding='utf-8', newline='\n')

budget = read('pages/budget/BudgetAnalyticsPage.tsx')
start = budget.index('  return (\n    <div className="budget-analytics-page')
budget = '''import { BudgetRenewalsDrawerSection } from './components/BudgetRenewalsDrawerSection';
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
''' + budget[start:]
start = budget.index('      <header className="budget-page-header">')
actions_start = budget.index('        <div className="budget-header-actions">', start)
end = budget.index('      </header>', actions_start)
actions = budget[actions_start:end].strip()
budget = budget[:start] + '''      <PageHeader title="Budget Management" tooltip="Predictive expenditure tracking, monthly budget planning, and renewal commitments." className="budget-page-header" contentClassName="budget-heading-copy" titleClassName="page-title inline-flex items-center gap-2" actions={
''' + actions + '\n      } />' + budget[end + len('      </header>'):]
start = budget.index('      <section className="budget-kpi-grid"')
end = budget.index('      </section>', start) + len('      </section>')
budget = budget[:start] + '''      <section className="budget-kpi-grid" aria-label="Budget overview">
        <KpiCard variant="budget" title="Remaining Budget" tooltipText="Available uncommitted budget for current cycle" value={formatCurrency(dashboard.remainingBudget)} status={<span className="metric-note positive">{dashboard.remainingPercentage}% Left</span>} />
        <KpiCard variant="budget" title="Next Month Renewals" tooltipText="Upcoming fixed license renewal obligations" value={`${dashboard.renewalCommitmentPercentage}%`} status={<>
          <span className="metric-note warning">{dashboard.renewals.length} Expiring</span>
          <Button variant="plain" className="budget-renewals-link" onClick={() => setDrawerOpen(true)}>View Renewals ({dashboard.renewals.length})<svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></Button>
        </>} footer={<p className="budget-kpi-description" />} />
        <KpiCard variant="budget" title="Budget Consumed" tooltipText="MTD burn rate compared to budget ceiling" value={`${dashboard.burnRatePercentage}%`} valueTooltip={`MTD Spend: ${formatCurrency(dashboard.actualSpendMtd)} / ${formatCurrency(dashboard.allocatedBudget)}`} status={<StatusBadge domain="budget" status="45K Surplus" />} />
        <KpiCard variant="budget" title="Recoverable Waste" tooltipText="Identified spend from idle accounts inactive >60 days" value={formatCurrency(dashboard.recoverableWaste)} status={<StatusBadge domain="budget" status="312 Idle Seats" />} />
      </section>''' + budget[end:]
start = budget.index('          <table')
end = budget.index('          </table>', start) + len('          </table>')
budget = budget[:start] + '          <DataTable rows={dashboard.ledger} columns={columns} getRowKey={row => row.department} label="Departmental budget ledger" className="data-table budget-ledger-table" />' + budget[end:]
budget = budget.replace('<BudgetInfo label=', '<InfoTooltip title=')
budget = budget.replace('<button', '<Button variant="plain"').replace('</button>', '</Button>')
write('pages/budget/BudgetAnalyticsPage.tsx', budget)

detail = read('pages/licenses/LicenseDetailPage.tsx')
start = detail.index('      <div className="page-heading detail-page-heading">')
end = detail.index('      {saved &&', start)
detail = detail[:start] + '''      <PageHeader title={<>{license.softwareName}{license.id === 'lic-m365-01' ? ' Enterprise' : ''}</>} tooltip="License details, entitlement, usage, cost and policy information" className="page-heading detail-page-heading" actions={<StatusBadge domain="compliance" status={license.complianceStatus} />} />

''' + detail[end:]
detail = detail.replace('<p className="form-message" role="status">{savedMessage}</p>', '<InlineAlert>{savedMessage}</InlineAlert>')
start = detail.index('            <div className="inventory-toolbar accounts-toolbar">')
end = detail.index('          <div className="accounts-table-wrap">', start)
detail = detail[:start] + '''            <FilterToolbar className="accounts-toolbar"
              search={{ value: accountSearch, onChange: setAccountSearch, 'aria-label': 'Search granted accounts by name or email', placeholder: 'Search account name or email' }}
              filters={[{ key: 'status', label: 'Filter accounts by usage status', value: accountStatus, onChange: value => { setAccountStatus(value); setAccountPage(0); }, options: [{ value: '', label: 'All Statuses' }, ...[...new Set(accountList.map(account => account.status))].sort().map(value => ({ value, label: value }))] }]}
            />
          )}
''' + detail[end:]
start = detail.index('            <table className="portal-table accounts-table"')
end = detail.index('        </section>', start)
detail = detail[:start] + '''            <DataTable rows={visibleAccounts} columns={accountColumns} getRowKey={account => accountList.indexOf(account)} label="Granted accounts" className="portal-table accounts-table" loading={!accounts && !accountsError} loadingMessage="Loading accounts..." error={accountsError} errorMessage="Unable to load accounts." emptyMessage={accountList.length ? 'No accounts match your filters.' : 'No account roster is available for this license.'} />
          </div>
          {accountList.length > 0 && <TablePagination total={filteredAccounts.length} page={currentAccountPage} pageSize={accountPageSize} onPageChange={setAccountPage} onPageSizeChange={size => { setAccountPageSize(size); setAccountPage(0); }} label="Granted accounts" />}
''' + detail[end:]
insert = detail.index('  return (\n    <div className="license-detail-page">')
detail = detail[:insert] + '''  const accountColumns: TableColumn<GrantedAccount>[] = [
    { key: 'user', header: 'User', cell: account => <><span className="table-name">{account.user}</span>{account.email && <div className="table-secondary">{account.email}</div>}</> },
    { key: 'tenant', header: 'Tenant', cell: account => account.tenant },
    { key: 'tier', header: 'Tier', cell: account => account.tier },
    { key: 'allocated', header: 'Allocated', className: 'table-date', cell: account => account.allocated },
    { key: 'status', header: 'Usage Status', className: 'table-status', cell: account => <StatusBadge domain="usage" status={account.status} /> },
    { key: 'actions', header: 'Actions', className: 'table-status', cell: account => <IconButton title={`Edit ${account.user}`} aria-label={`Edit ${account.user}`} onClick={() => { setEditingAccount({ index: accountList.indexOf(account), account: { ...account } }); setError(''); setSaved(false); }}><span className="material-symbols-outlined text-base">edit</span></IconButton> },
  ];
''' + detail[insert:]

def dialog(match):
    text = match.group(0)
    attrs = re.search(r'<Dialog (.*?)>', text, re.S).group(1)
    # Existing handlers contain arrow '=>' so read attributes by the known title marker.
    attrs = text[len('<Dialog '):text.index(' aria-labelledby=')]
    attrs = attrs.replace(' fullWidth', '').replace(' maxWidth="sm"', '')
    title = re.search(r'<DialogTitle[^>]*>(.*?)</DialogTitle>', text, re.S).group(1).strip()
    content = re.search(r'<DialogContent>(.*?)</DialogContent>', text, re.S).group(1)
    content = content.replace('            {error && <p role="alert" className="text-red-600 mt-2 text-sm">{error}</p>}\n', '')
    actions = re.search(r'<DialogActions>(.*?)</DialogActions>', text, re.S).group(1).strip()
    form = re.search(r'<form onSubmit=\{(\w+)\}>', text)
    extra = f' onSubmit={{{form.group(1)}}} error={{error}}' if form else ''
    return '<FormDialog ' + attrs + ' title={' + title + '}' + extra + ' actions={<>\n' + actions + '\n        </>}>\n' + content + '      </FormDialog>' if title.startswith('{') else '<FormDialog ' + attrs + ' title="' + title.replace('&amp;', '&') + '"' + extra + ' actions={<>\n' + actions + '\n        </>}>\n' + content + '      </FormDialog>'

detail = re.sub(r'<Dialog open=.*?</Dialog>', dialog, detail, flags=re.S)
# JSX expressions already have braces; the title prop needs one pair.
detail = detail.replace('title={{editingAccount', 'title={editingAccount').replace("'Add Granted Account'}}", "'Add Granted Account'}").replace('title={{policy}}', 'title={policy}')
detail = detail.replace('<button', '<Button').replace('</button>', '</Button>')
# Existing custom styles are preserved while common Save/Cancel buttons use variants.
detail = detail.replace('className="portal-button primary-button"', 'variant="primary"').replace('className="portal-button"', '')
detail = detail.replace('className="portal-button ', 'className="')
detail = detail.replace('<Button\n                type="button"\n                className="collapse-toggle-btn', '<Button\n                variant="plain"\n                type="button"\n                className="collapse-toggle-btn')
detail = detail.replace('<Button type="button" onClick={() => setPolicy(name)}>', '<Button variant="plain" type="button" onClick={() => setPolicy(name)}>')
write('pages/licenses/LicenseDetailPage.tsx', detail)

# Reuse the same chart card frame without changing SVG drawing or chart behavior.
charts = read('pages/budget/components/BudgetCharts.tsx')
charts = charts.replace('import { InfoTooltip } from "@/components/InfoTooltip";', 'import { SectionCard } from "@/components/cards/SectionCard";')
start = charts.index('    <article className="portal-card budget-chart-card budget-allocation-card">')
end = charts.index('      <div className="budget-allocation-list">', start)
charts = charts[:start] + '''    <SectionCard className="budget-chart-card budget-allocation-card" title="Category Budget Allocation" tooltip="Monthly burn rate vs allocated ceiling" headerClassName="budget-chart-heading" titleClassName="inline-flex items-center gap-2" actions={<span className="budget-chart-total">{formatCurrency(total)} Total</span>}>
''' + charts[end:]
start = charts.index('    <article className="portal-card budget-chart-card budget-spending-card">')
end = charts.index('      <ul className="budget-spending-legend"', start)
charts = charts[:start] + '''    <SectionCard className="budget-chart-card budget-spending-card" title="Annual Spending Trajectory" tooltip="Cumulative spend compared with the budget cap" headerClassName="budget-chart-heading" titleClassName="inline-flex items-center gap-2">
''' + charts[end:]
charts = charts.replace('    </article>', '    </SectionCard>')
write('pages/budget/components/BudgetCharts.tsx', charts)

write('sections/licenses/LicenseListSection.tsx', "export * from '@/pages/licenses/components/LicenseListSection';\nexport { default } from '@/pages/licenses/components/LicenseListSection';\n")

provider = read('data/licenses.tsx')
provider = "import { LoadingState } from '@/components/feedback/LoadingState';\nimport { ErrorState } from '@/components/feedback/ErrorState';\n" + provider
provider = provider.replace('<div role="alert">Unable to load licenses. Please reload the page.</div>', '<ErrorState message="Unable to load licenses. Please reload the page." />').replace('<div role="status">Loading licenses...</div>', '<LoadingState message="Loading licenses..." />')
write('data/licenses.tsx', provider)

router = read('routes/router.tsx')
router = router.replace("import { InfoTooltip } from '@/components/InfoTooltip';", "import { PageHeader } from '@/components/layout/PageHeader';")
start = router.index('          <div className="page-heading">')
end = router.index('          </div>', start) + len('          </div>')
router = router[:start] + '          <PageHeader title="Settings" tooltip="Workspace: VFast Enterprise · Profile: Dat Nguyen · Role: System Admin" />' + router[end:]
write('routes/router.tsx', router)

write('components/cards/index.ts', "export * from './KpiCard';\nexport * from './SectionCard';\n")
index = read('components/layout/index.ts')
write('components/layout/index.ts', index + "export * from './PageHeader';\nexport * from './BackLink';\n")
