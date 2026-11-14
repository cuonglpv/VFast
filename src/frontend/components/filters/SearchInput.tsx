import type { InputHTMLAttributes } from 'react';
import PortalIcon from '@/components/PortalIcon';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string;
  onChange: (value: string) => void;
  'aria-label': string;
}

export function SearchInput({ value, onChange, ...props }: SearchInputProps) {
  return <label className="inventory-search">
    <PortalIcon name="search" />
    <input {...props} type="text" value={value} onChange={event => onChange(event.target.value)} />
  </label>;
}
