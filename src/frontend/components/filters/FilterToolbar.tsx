import type { ReactNode } from 'react';
import { FilterSelect } from '@/components/FilterSelect';
import { SearchInput, type SearchInputProps } from './SearchInput';

export interface ToolbarFilter {
  key: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

interface FilterToolbarProps {
  search: SearchInputProps;
  filters?: ToolbarFilter[];
  actions?: ReactNode;
  summary?: ReactNode;
  className?: string;
  groupControls?: boolean;
}

export function FilterToolbar({ search, filters = [], actions, summary, className = '', groupControls = false }: FilterToolbarProps) {
  const controls = <><SearchInput {...search} />{filters.map(({ key, ...filter }) => <FilterSelect key={key} {...filter} />)}</>;
  return <div className={`inventory-toolbar ${className}`.trim()}>
    {groupControls ? <div className="table-filter-controls">{controls}</div> : controls}
    {actions}{summary}
  </div>;
}
