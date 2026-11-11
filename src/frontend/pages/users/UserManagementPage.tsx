import React, { useState } from 'react';
import { dashboardRepository } from '@/data/repositories';
import { useRepositoryData } from '@/data/useRepositoryData';
import { StatusBadge } from '@/components/StatusBadge';
import { FilterSelect } from '@/components/FilterSelect';
import PortalIcon from '@/components/PortalIcon';

export const UserManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const { data: users, error } = useRepositoryData(dashboardRepository.listUsers);

  const filteredUsers = (users ?? []).filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.department.toLowerCase().includes(search.toLowerCase());
    const matchRole = selectedRole === 'All Roles' || user.role === selectedRole;
    const matchDepartment = selectedDepartment === 'All Departments' || user.department === selectedDepartment;
    return matchSearch && matchRole && matchDepartment;
  });

  if (error) return <p role="alert">Unable to load users.</p>;
  if (!users) return <p role="status">Loading users...</p>;

  return (
    <div className="users-page space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">
            User Management
          </h1>
          <p className="page-description mt-0.5">
            Manage employee licensing assignments, role permissions, and access lifecycle.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F67B1] hover:bg-[#004f8b] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base" data-icon="person_add">
              person_add
            </span>
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="inventory-toolbar users-toolbar">
        <div className="table-filter-controls">
          <label className="inventory-search">
            <PortalIcon name="search" />
            <input
              aria-label="Search users by name, email or department"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by name, email, department..."
              type="text"
            />
          </label>

          <FilterSelect label="Filter by role" value={selectedRole} onChange={setSelectedRole} options={[{ value: 'All Roles', label: 'All Roles' }, ...[...new Set(users.map(user => user.role))].sort().map(value => ({ value, label: value }))]} />
          <FilterSelect label="Filter by department" value={selectedDepartment} onChange={setSelectedDepartment} options={[{ value: 'All Departments', label: 'All Departments' }, ...[...new Set(users.map(user => user.department))].sort().map(value => ({ value, label: value }))]} />
        </div>

        <div className="table-secondary tabular-nums">
          Showing <span className="font-semibold text-slate-900">{filteredUsers.length}</span> users
        </div>
      </div>

      {/* User Roster Table */}
      <div className="table-surface">
        <div className="overflow-x-auto">
          <table className="data-table users-table" aria-label="User accounts">
            <thead><tr>
              <th scope="col">User</th>
              <th scope="col">Department</th>
              <th scope="col" className="table-status">Role</th>
              <th scope="col" className="table-number">Licenses Assigned</th>
              <th scope="col" className="table-date">Last Active</th>
              <th scope="col" className="table-status">Status</th>
              <th scope="col" className="table-status">Actions</th>
            </tr></thead>
            <tbody>
              {filteredUsers.map(user => <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${user.avatarBg} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}>
                      {user.avatarInitials}
                    </div>
                    <div>
                      <div className="table-name">{user.name}</div>
                      <div className="table-secondary">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>{user.department}</td>
                <td className="table-status"><StatusBadge domain="classification" status={user.role} /></td>
                <td className="table-number">{user.assignedLicensesCount} apps</td>
                <td className="table-date">{user.lastActive}</td>
                <td className="table-status"><StatusBadge domain="account" status={user.status} /></td>
                <td className="table-status">
                  <button className="p-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Manage User" aria-label={`Manage ${user.name}`} type="button">
                    <span className="material-symbols-outlined text-base">more_vert</span>
                  </button>
                </td>
              </tr>)}
              {!filteredUsers.length && <tr><td colSpan={7} className="empty-state">No users match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
