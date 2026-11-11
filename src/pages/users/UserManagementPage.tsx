import React, { useState } from 'react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  avatarBg: string;
  department: string;
  role: 'Admin' | 'Manager' | 'Staff' | 'Employee';
  assignedLicensesCount: number;
  lastActive: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

const mockUsers: UserRecord[] = [
  {
    id: 'usr-001',
    name: 'Dat Nguyen',
    email: 'dat.nguyen@vfast.com',
    avatarInitials: 'DN',
    avatarBg: 'bg-[#0F67B1] text-white',
    department: 'Architecture & Infra',
    role: 'Admin',
    assignedLicensesCount: 8,
    lastActive: 'Just now',
    status: 'Active',
  },
  {
    id: 'usr-002',
    name: 'Alex Morgan',
    email: 'alex.morgan@vfast.com',
    avatarInitials: 'AM',
    avatarBg: 'bg-indigo-600 text-white',
    department: 'Operations & P&L',
    role: 'Manager',
    assignedLicensesCount: 6,
    lastActive: '12m ago',
    status: 'Active',
  },
  {
    id: 'usr-003',
    name: 'Sarah Jenkins',
    email: 's.jenkins@vfast.com',
    avatarInitials: 'SJ',
    avatarBg: 'bg-purple-600 text-white',
    department: 'Product Management',
    role: 'Manager',
    assignedLicensesCount: 5,
    lastActive: 'Yesterday',
    status: 'Active',
  },
  {
    id: 'usr-004',
    name: 'Hoang Minh',
    email: 'minh.hoang@vfast.com',
    avatarInitials: 'HM',
    avatarBg: 'bg-emerald-600 text-white',
    department: 'Software Engineering',
    role: 'Staff',
    assignedLicensesCount: 4,
    lastActive: '3 hours ago',
    status: 'Active',
  },
  {
    id: 'usr-005',
    name: 'Cuong Le',
    email: 'cuong.le@vfast.com',
    avatarInitials: 'CL',
    avatarBg: 'bg-sky-600 text-white',
    department: 'Software Engineering',
    role: 'Staff',
    assignedLicensesCount: 4,
    lastActive: '5 hours ago',
    status: 'Active',
  },
  {
    id: 'usr-006',
    name: 'Emily Watson',
    email: 'emily.w@vfast.com',
    avatarInitials: 'EW',
    avatarBg: 'bg-amber-600 text-white',
    department: 'Marketing & Sales',
    role: 'Employee',
    assignedLicensesCount: 2,
    lastActive: '45 days ago',
    status: 'Inactive',
  },
];

export const UserManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');

  const filteredUsers = mockUsers.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.department.toLowerCase().includes(search.toLowerCase());
    const matchRole = selectedRole === 'All Roles' || user.role === selectedRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-headline">
            User & Access Governance
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage employee licensing assignments, role permissions, and access lifecycle.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base text-slate-500" data-icon="file_download">
              file_download
            </span>
            <span>Export CSV</span>
          </button>
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
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative w-72">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none"
              data-icon="search"
            >
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-[#f0f3ff] border border-slate-200 rounded-lg focus:outline-none focus:border-[#0F67B1] transition-all"
              placeholder="Search user by name, email, department..."
              type="text"
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 bg-white focus:outline-none focus:border-[#0F67B1] cursor-pointer"
          >
            <option>All Roles</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Staff</option>
            <option>Employee</option>
          </select>

          <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 bg-white focus:outline-none focus:border-[#0F67B1] cursor-pointer">
            <option>All Departments</option>
            <option>Architecture & Infra</option>
            <option>Operations & P&L</option>
            <option>Software Engineering</option>
            <option>Product Management</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          Showing <span className="font-semibold text-slate-900">{filteredUsers.length}</span> users
        </div>
      </div>

      {/* User Roster Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">USER</th>
                <th className="px-4 py-3">DEPARTMENT</th>
                <th className="px-4 py-3">ROLE</th>
                <th className="px-4 py-3 text-center">LICENSES ASSIGNED</th>
                <th className="px-4 py-3">LAST ACTIVE</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-2 py-3 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full ${user.avatarBg} flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}
                      >
                        {user.avatarInitials}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{user.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-medium">{user.department}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        user.role === 'Admin'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : user.role === 'Manager'
                          ? 'bg-blue-50 text-[#0F67B1] border-blue-200'
                          : user.role === 'Staff'
                          ? 'bg-teal-50 text-teal-700 border-teal-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-mono font-semibold text-slate-900">
                    {user.assignedLicensesCount} apps
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">{user.lastActive}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        user.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          user.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      ></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-2 py-3 text-center">
                    <button
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Manage User"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
