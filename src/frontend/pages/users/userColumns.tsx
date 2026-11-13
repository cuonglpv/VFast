import { StatusBadge } from '@/components/StatusBadge';
import { IconButton } from '@/components/ui/Button';
import type { TableColumn } from '@/components/table/DataTable';
import type { UserRecord } from '@/types/user';

export const userColumns: TableColumn<UserRecord>[] = [
  { key: 'user', header: 'User', cell: user => <div className="flex items-center gap-3"><div><div className="table-name">{user.name}</div><div className="table-secondary">{user.email}</div></div></div> },
  { key: 'tenant', header: 'Tenant', cell: user => user.tenant },
  { key: 'department', header: 'Department', cell: user => user.department },
  { key: 'role', header: 'Role', className: 'table-status', cell: user => <StatusBadge domain="classification" status={user.role} /> },
  { key: 'licenses', header: 'Licenses Assigned', className: 'table-number', cell: user => <>{user.assignedLicensesCount} apps</> },
  { key: 'lastActive', header: 'Last Active', className: 'table-date', cell: user => user.lastActive },
  { key: 'status', header: 'Status', className: 'table-status', cell: user => <StatusBadge domain="account" status={user.status} /> },
  { key: 'actions', header: 'Actions', className: 'table-status', cell: user => <IconButton title="Manage User" aria-label={`Manage ${user.name}`}><span className="material-symbols-outlined text-base">more_vert</span></IconButton> },
];
