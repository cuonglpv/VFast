from pathlib import Path

root = Path(__file__).resolve().parents[1] / 'src/frontend'

def read(path):
    return (root / path).read_text(encoding='utf-8')

def write(path, content):
    target = root / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding='utf-8', newline='\n')

def replace(text, before, after):
    assert before in text, before[:160]
    return text.replace(before, after, 1)

# Keep the working copy, including the user's chart edits, when relocating files.
write('hooks/useRepositoryData.ts', read('data/useRepositoryData.ts'))
write('data/useRepositoryData.ts', "export { useRepositoryData } from '@/hooks/useRepositoryData';\n")
for path in root.rglob('*.tsx'):
    if 'node_modules' not in path.parts and 'dist' not in path.parts:
        text = path.read_text(encoding='utf-8')
        if '@/data/useRepositoryData' in text:
            path.write_text(text.replace('@/data/useRepositoryData', '@/hooks/useRepositoryData'), encoding='utf-8', newline='\n')

charts = read('components/LicenseHealthCharts.tsx')
subscription = charts[charts.index('export function SubscriptionDynamicsChart'):]
write('pages/analytics/components/SubscriptionDynamicsChart.tsx', "import { useId, useState } from 'react';\nimport type { AnalyticsDashboardData } from '@/types/analytics';\n\nconst number = new Intl.NumberFormat('en-US');\n\n" + subscription)
bar = charts[charts.index('export function HorizontalBarChart'):charts.index('export function SubscriptionDynamicsChart')]
bar = replace(bar, '({ rows, max, currency = false }: {', '({ rows, max, formatValue = number.format, formatAxis = number.format }: {')
bar = replace(bar, '  currency?: boolean;', '  formatValue?: (value: number) => string;\n  formatAxis?: (value: number) => string;')
start = bar.index('  const axisLabel =')
end = bar.index('  return ', start)
bar = bar[:start] + bar[end:]
bar = bar.replace('valueLabel(', 'formatValue(').replace('axisLabel(', 'formatAxis(')
write('components/charts/HorizontalBarChart.tsx', "const number = new Intl.NumberFormat('en-US');\n\n" + bar)
write('components/LicenseHealthCharts.tsx', "// Compatibility exports for existing imports.\nexport { HorizontalBarChart } from './charts/HorizontalBarChart';\nexport { SubscriptionDynamicsChart } from '@/pages/analytics/components/SubscriptionDynamicsChart';\n")

for name in ['Header', 'Sidebar', 'MainLayout']:
    write(f'components/layout/{name}.tsx', f"export {{ default, default as {name} }} from '@/layouts/{name}';\n")

for source, target, symbol in [
    ('components/BudgetCharts.tsx', 'pages/budget/components/BudgetCharts.tsx', 'CategoryBudgetAllocation, AnnualSpendingTrajectory'),
    ('sections/licenses/LicenseDetailDrawer.tsx', 'pages/licenses/components/LicenseDetailDrawer.tsx', 'LicenseDetailDrawer'),
    ('sections/budget/BudgetKpiSection.tsx', 'pages/budget/components/BudgetKpiSection.tsx', 'BudgetKpiSection'),
    ('sections/budget/BudgetRenewalsDrawerSection.tsx', 'pages/budget/components/BudgetRenewalsDrawerSection.tsx', 'BudgetRenewalsDrawerSection'),
]:
    write(target, read(source))
    write(source, f"export * from '@/{target[:-4]}';\n" + (f"export {{ default }} from '@/{target[:-4]}';\n" if symbol.count(',') == 0 else ''))

license_page = read('pages/licenses/LicenseManagementPage.tsx')
hook_start = license_page.index('const categoryColors:')
component_start = license_page.index('export default function LicenseManagementPage() {')
body_start = component_start + len('export default function LicenseManagementPage() {\n')
jsx_start = license_page.index('  return (\n    <div className="license-management">')
hook = "import { useState, type MouseEvent } from 'react';\nimport { useLicenses } from '@/data/licenses';\n\n" + license_page[hook_start:component_start] + 'export function useLicenseOverview() {\n' + license_page[body_start:jsx_start] + '  return { records, categoryCounts, categoryGradient, highlightedCategory, highlightSlice, setActiveCategory };\n}\n'
write('pages/licenses/hooks/useLicenseOverview.ts', hook)
license_page = "import { LicenseListSection } from './components/LicenseListSection';\nimport { PageHeader } from '@/components/layout/PageHeader';\nimport { KpiCard } from '@/components/cards/KpiCard';\nimport { useLicenseOverview } from './hooks/useLicenseOverview';\n\nexport default function LicenseManagementPage() {\n  const { records, categoryCounts, categoryGradient, highlightedCategory, highlightSlice, setActiveCategory } = useLicenseOverview();\n" + license_page[jsx_start:]
start = license_page.index('      <div className="page-heading">')
end = license_page.index('      <section', start)
license_page = license_page[:start] + '      <PageHeader title="License Management" tooltip="View the total number of licenses, compliance status, category breakdown, and top 5 app usage." />\n' + license_page[end:]
start = license_page.index('          <article className="portal-card summary-card">')
end = license_page.index('        </div>', start)
license_page = license_page[:start] + '''          <KpiCard variant="summary" title="Total Licenses" value={records.length} footer={<span style={{ marginTop: '1.5rem' }}>+5 MoM</span>} />
          <KpiCard variant="summary" title="Unsanitized" value={records.filter(record => record.complianceStatus !== 'Compliant').length} footer={<span style={{ marginTop: '1.5rem' }}>+1 MoM</span>} />
''' + license_page[end:]
write('pages/licenses/LicenseManagementPage.tsx', license_page)

# Inventory keeps its route-scoped filters and scroll restoration.
inventory = read('sections/licenses/LicenseListSection.tsx')
logic_start = inventory.index('  const navigate =')
jsx_start = inventory.index('  return (\n    <section')
logic = inventory[logic_start:jsx_start]
logic = replace(logic, '  const filtered = records.filter(', '  const query = useDebounce(search).trim().toLowerCase();\n  const filtered = records.filter(')
logic = replace(logic, '.includes(search.trim().toLowerCase()),', '.includes(query),')
start = logic.index('  const lastPage =')
end = logic.index('  function detailPath', start)
logic = logic[:start] + '  const { currentPage, visible } = paginateRows(filtered, page, rowsPerPage);\n\n' + logic[end:]
# Skip the mount reset so returning from a detail page restores the prior page.
logic += '''  const previousQuery = useRef(query);
  useEffect(() => {
    if (previousQuery.current !== query) {
      previousQuery.current = query;
      updateInventory({ page: 0 });
    }
  }, [query, updateInventory]);
  return { records, search, category, compliance, rowsPerPage, currentPage, visible, filtered, updateInventory, position, importOpen, setImportOpen, message, setMessage, fileInput, tableWrap, detailPath, openDetail, importFile, downloadTemplate, rememberScroll };
'''
imports = '''import { useEffect, useLayoutEffect, useRef, useState, type ChangeEvent, type MouseEvent } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useLicenses } from '@/data/licenses';
import { PATHS } from '@/routes/paths';
import { parseLicenseCsv, licenseCsvTemplate } from '@/utils/licenseCsv';
import { paginateRows } from '@/utils/pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useLicenseInventoryView } from '@/layouts/LicenseWorkspaceLayout';

'''
write('pages/licenses/hooks/useLicenseInventory.ts', imports + 'export function useLicenseInventory() {\n' + logic + '}\n')

# Move license detail state and actions together; the page retains its form fields.
detail = read('pages/licenses/LicenseDetailPage.tsx')
logic_start = detail.index('  const { licenseId } =')
jsx_start = detail.index('  return (\n    <div className="license-detail-page">')
logic = detail[logic_start:jsx_start]
start = logic.index('  if (!license) {')
end = logic.index('  const metrics =', start)
logic = logic[:start] + logic[end:]
logic = replace(logic, '  const metrics = [', '  const metrics = license ? [')
logic = replace(logic, "  ];\n\n  async function submit", "  ] : [];\n\n  async function submit")
logic = replace(logic, '  const query = accountSearch.trim().toLowerCase();', '  const query = useDebounce(accountSearch).trim().toLowerCase();\n  useEffect(() => { setAccountPage(0); }, [query]);')
start = logic.index('  const lastAccountPage =')
end = logic.index('  const metrics =', start)
logic = logic[:start] + '  const { currentPage: currentAccountPage, visible: visibleAccounts } = paginateRows(filteredAccounts, accountPage, accountPageSize);\n\n' + logic[end:]
imports = '''import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useLicenses, type LicenseRecord } from '@/data/licenses';
import type { GrantedAccount } from '@/types/license';
import { formatCurrency } from '@/utils';
import { licenseRepository } from '@/data/repositories';
import { useRepositoryData } from '@/hooks/useRepositoryData';
import { useDebounce } from '@/hooks/useDebounce';
import { paginateRows } from '@/utils/pagination';

'''
bindings = 'license, draft, setDraft, error, setError, saved, setSaved, savedMessage, setSavedMessage, policy, setPolicy, metadataCollapsed, setMetadataCollapsed, metadataDraft, setMetadataDraft, accountList, setAccountList, editingAccount, setEditingAccount, accountSearch, setAccountSearch, accountStatus, setAccountStatus, setAccountPage, accountPageSize, setAccountPageSize, accounts, accountsError, filteredAccounts, currentAccountPage, visibleAccounts, metrics, submit, submitMetadata, submitAccount'
write('pages/licenses/hooks/useLicenseDetail.ts', imports + 'export function useLicenseDetail() {\n' + logic + '  return { ' + bindings + ' };\n}\n')
write('pages/licenses/LicenseDetailPage.tsx', '''import { PATHS } from '@/routes/paths';
import { StatusBadge } from '@/components/StatusBadge';
import { PageHeader } from '@/components/layout/PageHeader';
import { BackLink } from '@/components/layout/BackLink';
import { InlineAlert } from '@/components/feedback/InlineAlert';
import { FilterToolbar } from '@/components/filters/FilterToolbar';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import { TablePagination } from '@/components/table/TablePagination';
import { Button, IconButton } from '@/components/ui/Button';
import { FormDialog } from '@/components/dialogs/FormDialog';
import type { GrantedAccount } from '@/types/license';
import { useLicenseDetail } from './hooks/useLicenseDetail';

function BackToLicenses() {
  return <BackLink to={PATHS.LICENSES}>Back to License Management</BackLink>;
}

export default function LicenseDetailPage() {
  const { ''' + bindings + ''' } = useLicenseDetail();
  if (!license) return <div className="license-detail-page"><BackToLicenses /><PageHeader title="License not found" description="This license is not available." /></div>;
''' + detail[jsx_start:])
