import { useMemo, useState } from 'react';
import { dashboardRepository } from '@/data/repositories';
import { useRepositoryData } from '@/hooks/useRepositoryData';
import { useDebounce } from '@/hooks/useDebounce';
import type { ToolbarFilter } from '@/components/filters/FilterToolbar';

export function useUserManagement() {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedTenant, setSelectedTenant] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const query = useDebounce(search).trim().toLowerCase();
  const { data: users, error } = useRepositoryData(dashboardRepository.listUsers);

  const filteredUsers = useMemo(() => (users ?? []).filter(user =>
    [user.name, user.email, user.department, user.tenant].some(value => value.toLowerCase().includes(query))
    && (!selectedRole || user.role === selectedRole)
    && (!selectedTenant || user.tenant === selectedTenant)
    && (!selectedDepartment || user.department === selectedDepartment)
  ), [users, query, selectedRole, selectedTenant, selectedDepartment]);

  const options = (field: 'tenant' | 'role' | 'department', allLabel: string) => [
    { value: '', label: allLabel },
    ...[...new Set((users ?? []).map(user => user[field]))].sort().map(value => ({ value, label: value })),
  ];
  const filters: ToolbarFilter[] = [
    { key: 'tenant', label: 'Filter by tenant', value: selectedTenant, onChange: setSelectedTenant, options: options('tenant', 'All Tenants') },
    { key: 'role', label: 'Filter by role', value: selectedRole, onChange: setSelectedRole, options: options('role', 'All Roles') },
    { key: 'department', label: 'Filter by department', value: selectedDepartment, onChange: setSelectedDepartment, options: options('department', 'All Departments') },
  ];
  return { users, error, search, setSearch, filters, filteredUsers };
}
