import { PATHS } from '@/routes/paths';
import type { AnalyticsBreakdownKind, AnalyticsBreakdownRow } from '@/types/analytics';
import { BackLink } from '@/components/layout/BackLink';
import { PageHeader } from '@/components/layout/PageHeader';
import { KpiCard } from '@/components/cards/KpiCard';
import { FilterToolbar } from '@/components/filters/FilterToolbar';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import { TablePagination } from '@/components/table/TablePagination';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useAnalyticsDetail } from './hooks/useAnalyticsDetail';

export default function AnalyticsDetailPage({ kind }: { kind: AnalyticsBreakdownKind }) {
  const { rows, error, currency, title, format, total, largest, filtered, currentPage, visible, search, setSearch, sort, setSort, pageSize, setPageSize, setPage } = useAnalyticsDetail(kind);
  const columns: TableColumn<AnalyticsBreakdownRow>[] = [
    { key: 'number', header: 'No.', cell: (_, index) => currentPage * pageSize + index + 1 },
    { key: 'department', header: 'Department', className: 'table-name', headerClassName: '', cell: row => row.label },
    { key: 'value', header: currency ? 'Spend (USD)' : 'Usage', className: 'table-number', cell: row => format(row.value) },
    { key: 'share', header: 'Share of Total', cell: row => {
      const percentage = total > 0 ? row.value / total * 100 : 0;
      return <div className="analytics-share"><span className="analytics-share-track" aria-hidden="true"><i style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }} /></span><span>{percentage.toFixed(1)}%</span></div>;
    } },
  ];

  return <div className="analytics-detail-page">
    <BackLink to={`${PATHS.ANALYTICS}#analytics-breakdowns`}>Back to License Health</BackLink>
    <PageHeader title={title} tooltip={currency ? 'Full spending breakdown across all departments · USD' : 'Full usage breakdown across all departments'} />
    {error ? <ErrorState message={`Unable to load ${title.toLowerCase()}. Please try again.`} /> : rows === null ? <LoadingState message={`Loading ${title.toLowerCase()}...`} /> : <>
      <section className="analytics-detail-summary" aria-label={`${title} summary`}>
        <KpiCard variant="compact" title="Departments" value={rows.length.toLocaleString('en-US')} subtitle="Full dataset" />
        <KpiCard variant="compact" title={currency ? 'Total Spend' : 'Total Usage'} value={format(total)} subtitle="Across all departments" />
        <KpiCard variant="compact" title="Largest Contributor" value={largest?.label ?? '—'} valueClassName="analytics-contributor-name" subtitle={largest && total > 0 ? `${(largest.value / total * 100).toFixed(1)}% of total` : 'No data available'} />
      </section>
      <section aria-label={`${title} full list`}>
        <FilterToolbar
          className="analytics-detail-toolbar"
          search={{ value: search, onChange: setSearch, 'aria-label': 'Search departments', placeholder: 'Search department' }}
          filters={[{ key: 'sort', label: `Sort ${title.toLowerCase()}`, value: sort, onChange: setSort, options: [{ value: 'highest', label: currency ? 'Highest spend' : 'Highest usage' }, { value: 'lowest', label: currency ? 'Lowest spend' : 'Lowest usage' }, { value: 'name', label: 'Department A–Z' }] }]}
          summary={<span className="table-secondary analytics-results-count">{filtered.length.toLocaleString('en-US')} departments</span>}
        />
        <div className="table-surface table-scroll"><DataTable rows={visible} columns={columns} getRowKey={row => row.id} label={`${title} by department`} className="portal-table analytics-breakdown-table" emptyMessage={rows.length ? 'No departments match your search.' : 'No department data available.'} /></div>
        <TablePagination total={filtered.length} page={currentPage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} label={title} />
        <p className="analytics-share-note">Share of total is calculated across all departments.</p>
      </section>
    </>}
  </div>;
}
