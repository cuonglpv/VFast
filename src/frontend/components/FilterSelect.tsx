import { MenuItem, Select } from '@mui/material';

type Option = { value: string; label: string };

export function FilterSelect({ label, value, options, onChange }: {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
}) {
  return <Select
    className="portal-filter-select"
    size="small"
    displayEmpty
    value={value}
    onChange={event => onChange(event.target.value)}
    inputProps={{ 'aria-label': label }}
    MenuProps={{ PaperProps: { className: 'portal-filter-menu' } }}
  >
    {options.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
  </Select>;
}
