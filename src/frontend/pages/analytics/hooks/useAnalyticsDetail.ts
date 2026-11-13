import { useCallback, useEffect, useState } from 'react';
import { dashboardRepository } from '@/data/repositories';
import { useRepositoryData } from '@/hooks/useRepositoryData';
import { useDebounce } from '@/hooks/useDebounce';
import type { AnalyticsBreakdownKind, AnalyticsBreakdownRow } from '@/types/analytics';
import { formatCurrency } from '@/utils';
import { paginateRows } from '@/utils/pagination';

export function useAnalyticsDetail(kind: AnalyticsBreakdownKind) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('highest');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const query = useDebounce(search).trim().toLowerCase();
  const load = useCallback(() => dashboardRepository.getAnalyticsBreakdown(kind), [kind]);
  const { data: rows, error } = useRepositoryData(load);
  const currency = kind === 'spend';
  const title = currency ? 'Department Spend' : 'Application Usage';
  const format = (value: number) => currency ? formatCurrency(value) : value.toLocaleString('en-US');
  const total = (rows ?? []).reduce((sum, row) => sum + row.value, 0);
  const largest = (rows ?? []).reduce<AnalyticsBreakdownRow | null>((current, row) => !current || row.value > current.value ? row : current, null);
  const filtered = (rows ?? []).filter(row => row.label.toLowerCase().includes(query)).sort((a, b) => sort === 'name' ? a.label.localeCompare(b.label) : (sort === 'lowest' ? a.value - b.value : b.value - a.value) || a.label.localeCompare(b.label));
  const { currentPage, visible } = paginateRows(filtered, page, pageSize);

  useEffect(() => { setPage(0); }, [query]);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return {
    rows, error, currency, title, format, total, largest, filtered, currentPage, visible,
    search, setSearch,
    sort, setSort: (value: string) => { setSort(value); setPage(0); },
    pageSize, setPageSize: (value: number) => { setPageSize(value); setPage(0); },
    setPage,
  };
}
