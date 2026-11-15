import type { HTMLAttributes, Key, ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  className?: string;
  headerClassName?: string;
  title?: string;
}

interface DataTableProps<T> {
  rows: readonly T[];
  columns: readonly TableColumn<T>[];
  getRowKey: (row: T, index: number) => Key;
  label: string;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  loadingMessage?: string;
  error?: boolean;
  errorMessage?: string;
  rowProps?: (row: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
}

export function DataTable<T>({ rows, columns, getRowKey, label, className = 'portal-table', emptyMessage = 'No results found.', loading = false, loadingMessage = 'Loading...', error = false, errorMessage = 'Unable to load data.', rowProps }: DataTableProps<T>) {
  const message = error ? errorMessage : loading ? loadingMessage : rows.length === 0 ? emptyMessage : null;
  return <table className={className} aria-label={label} aria-busy={loading || undefined}>
    <thead><tr>{columns.map(column => <th key={column.key} scope="col" className={column.headerClassName ?? column.className} title={column.title}>{column.header}</th>)}</tr></thead>
    <tbody>
      {message !== null ? <tr><td colSpan={columns.length} className="empty-state"><span role={error ? 'alert' : 'status'}>{message}</span></td></tr> : rows.map((row, index) => <tr key={getRowKey(row, index)} {...rowProps?.(row, index)}>
        {columns.map(column => <td key={column.key} className={column.className}>{column.cell(row, index)}</td>)}
      </tr>)}
    </tbody>
  </table>;
}
