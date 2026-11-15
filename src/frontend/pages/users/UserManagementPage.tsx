import { PageHeader } from '@/components/layout/PageHeader';
import { FilterToolbar } from '@/components/filters/FilterToolbar';
import { DataTable } from '@/components/table/DataTable';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/feedback/LoadingState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { useUserManagement } from './hooks/useUserManagement';
import { userColumns } from './userColumns';

export function UserManagementPage() {
  const { users, error, search, setSearch, filters, filteredUsers } = useUserManagement();
  if (error) return <ErrorState message="Unable to load users." />;
  if (!users) return <LoadingState message="Loading users..." />;

  return <div className="users-page space-y-6">
    <PageHeader
      title="User Management"
      tooltip="Manage employee licensing assignments, role permissions, and access lifecycle."
      className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      titleClassName="page-title inline-flex items-center gap-2"
      actions={<div className="flex items-center gap-2.5">
        <Button variant="plain" className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F67B1] hover:bg-[#004f8b] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer" icon={<span className="material-symbols-outlined text-base" data-icon="person_add">person_add</span>}><span>Add User</span></Button>
      </div>}
    />
    <FilterToolbar
      className="users-toolbar mb-6"
      groupControls
      search={{ value: search, onChange: setSearch, 'aria-label': 'Search users by name, email, department or tenant', placeholder: 'Search user by name, email, department, tenant...' }}
      filters={filters}
      summary={<div className="table-secondary tabular-nums">Showing <span className="font-semibold text-slate-900">{filteredUsers.length}</span> users</div>}
    />
    <div className="table-surface mt-6"><div className="overflow-x-auto">
      <DataTable rows={filteredUsers} columns={userColumns} getRowKey={user => user.id} label="User accounts" className="data-table users-table" emptyMessage="No users match your filters." />
    </div></div>
  </div>;
}

export default UserManagementPage;
