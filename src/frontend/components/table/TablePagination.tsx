import { Button } from '@/components/ui/Button';

interface TablePaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  label?: string;
}

export function TablePagination({ total, page, pageSize, onPageChange, onPageSizeChange, label = 'Table' }: TablePaginationProps) {
  const lastPage = Math.max(0, Math.ceil(total / pageSize) - 1);
  const currentPage = Math.max(0, Math.min(page, lastPage));
  return <div className="inventory-pagination">
    <label>Rows per page: <select aria-label={`${label} rows per page`} value={pageSize} onChange={event => onPageSizeChange(Number(event.target.value))}>
      {[10, 25, 50].map(size => <option key={size} value={size}>{size}</option>)}
    </select></label>
    <span aria-hidden="true">·</span>
    <span>{total ? currentPage * pageSize + 1 : 0}–{Math.min((currentPage + 1) * pageSize, total)} of {total}</span>
    {lastPage > 0 && <div className="pagination-controls">
      <Button variant="plain" aria-label={`${label} previous page`} disabled={currentPage === 0} onClick={() => onPageChange(currentPage - 1)}>‹</Button>
      <Button variant="plain" aria-label={`${label} next page`} disabled={currentPage === lastPage} onClick={() => onPageChange(currentPage + 1)}>›</Button>
    </div>}
  </div>;
}
