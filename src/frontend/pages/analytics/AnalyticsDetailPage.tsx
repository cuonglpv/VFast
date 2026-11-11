import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardRepository } from '@/data/repositories';
import { useRepositoryData } from '@/data/useRepositoryData';
import { FilterSelect } from '@/components/FilterSelect';
import PortalIcon from '@/components/PortalIcon';
import { PATHS } from '@/routes/paths';
import type { AnalyticsBreakdownKind, AnalyticsBreakdownRow } from '@/types/analytics';
import { formatCurrency } from '@/utils';

export default function AnalyticsDetailPage({ kind }: { kind: AnalyticsBreakdownKind }) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('highest');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const load = useCallback(() => dashboardRepository.getAnalyticsBreakdown(kind), [kind]);
  const { data: rows, error } = useRepositoryData(load);
  const currency = kind === 'spend';
  const title = currency ? 'Department Spend' : 'Application Usage';
  const format = (value: number) => currency ? formatCurrency(value) : value.toLocaleString('en-US');
  const total = (rows ?? []).reduce((sum, row) => sum + row.value, 0);
  const largest = (rows ?? []).reduce<AnalyticsBreakdownRow | null>((current, row) => !current || row.value > current.value ? row : current, null);
  const filtered = (rows ?? []).filter(row => row.label.toLowerCase().includes(search.trim().toLowerCase())).sort((a, b) => sort === 'name' ? a.label.localeCompare(b.label) : (sort === 'lowest' ? a.value - b.value : b.value - a.value) || a.label.localeCompare(b.label));
  const lastPage = Math.max(0, Math.ceil(filtered.length / pageSize) - 1);
  const currentPage = Math.min(page, lastPage);
  const visible = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return <div className="analytics-detail-page">
    <Link className="detail-back-link" to={`${PATHS.ANALYTICS}#analytics-breakdowns`}><svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16 10H4m5-5-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Back to License Health</Link>
    <div className="page-heading"><h1>{title}</h1><p>{currency ? 'Full spending breakdown across all departments · USD' : 'Full usage breakdown across all departments'}</p></div>
    {error ? <p role="alert">Unable to load {title.toLowerCase()}. Please try again.</p> : rows === null ? <p role="status">Loading {title.toLowerCase()}...</p> : <>
      <section className="analytics-detail-summary" aria-label={`${title} summary`}>
        <article className="portal-card"><span>Departments</span><strong>{rows.length.toLocaleString('en-US')}</strong><small>Full dataset</small></article>
        <article className="portal-card"><span>{currency ? 'Total Spend' : 'Total Usage'}</span><strong>{format(total)}</strong><small>Across all departments</small></article>
        <article className="portal-card"><span>Largest Contributor</span><strong className="analytics-contributor-name">{largest?.label ?? '—'}</strong><small>{largest && total > 0 ? `${(largest.value / total * 100).toFixed(1)}% of total` : 'No data available'}</small></article>
      </section>
      <section aria-label={`${title} full list`}>
        <div className="inventory-toolbar analytics-detail-toolbar">
          <label className="inventory-search"><PortalIcon name="search" /><input aria-label="Search departments" placeholder="Search department" value={search} onChange={event => { setSearch(event.target.value); setPage(0); }} /></label>
          <FilterSelect label={`Sort ${title.toLowerCase()}`} value={sort} onChange={value => { setSort(value); setPage(0); }} options={[{ value: 'highest', label: currency ? 'Highest spend' : 'Highest usage' }, { value: 'lowest', label: currency ? 'Lowest spend' : 'Lowest usage' }, { value: 'name', label: 'Department A–Z' }]} />
          <span className="table-secondary analytics-results-count">{filtered.length.toLocaleString('en-US')} departments</span>
        </div>
        <div className="table-surface table-scroll"><table className="portal-table analytics-breakdown-table" aria-label={`${title} by department`}>
          <thead><tr><th scope="col">No.</th><th scope="col">Department</th><th scope="col" className="table-number">{currency ? 'Spend (USD)' : 'Usage'}</th><th scope="col">Share of Total</th></tr></thead>
          <tbody>{visible.map((row, index) => {
            const percentage = total > 0 ? row.value / total * 100 : 0;
            return <tr key={row.id}><td>{currentPage * pageSize + index + 1}</td><td className="table-name">{row.label}</td><td className="table-number">{format(row.value)}</td><td><div className="analytics-share"><span className="analytics-share-track" aria-hidden="true"><i style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }} /></span><span>{percentage.toFixed(1)}%</span></div></td></tr>;
          })}{!visible.length && <tr><td colSpan={4} className="empty-state">{rows.length ? 'No departments match your search.' : 'No department data available.'}</td></tr>}</tbody>
        </table></div>
        <div className="inventory-pagination"><label>Rows per page: <select aria-label="Detail rows per page" value={pageSize} onChange={event => { setPageSize(Number(event.target.value)); setPage(0); }}><option>10</option><option>25</option><option>50</option></select></label><span aria-hidden="true">·</span><span>{filtered.length ? currentPage * pageSize + 1 : 0}–{Math.min((currentPage + 1) * pageSize, filtered.length)} of {filtered.length}</span>{lastPage > 0 && <div className="pagination-controls"><button type="button" aria-label="Previous detail page" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>‹</button><button type="button" aria-label="Next detail page" disabled={currentPage === lastPage} onClick={() => setPage(currentPage + 1)}>›</button></div>}</div>
        <p className="analytics-share-note">Share of total is calculated across all departments.</p>
      </section>
    </>}
  </div>;
}
