import React from 'react';
import { formatCurrency, formatDate } from '@/utils';
import { StatusBadge } from '@/components/StatusBadge';

export interface LicenseDetailProps {
  open: boolean;
  onClose: () => void;
  license?: {
    id: string;
    softwareName: string;
    publisher: string;
    sku: string;
    category: string;
    status: string;
    annualCost: number;
    monthlyCost: number;
    totalSeats: number;
    assignedSeats: number;
    availableSeats: number;
    utilizationRate: number;
    renewalDate: string;
    contractNumber: string;
  };
}

export const LicenseDetailDrawer: React.FC<LicenseDetailProps> = ({
  open,
  onClose,
  license = {
    id: 'lic-m365-01',
    softwareName: 'Microsoft 365 Enterprise',
    publisher: 'Microsoft Corporation',
    sku: 'LIC-M365-01',
    category: 'Productivity',
    status: 'Compliant',
    annualCost: 180000,
    monthlyCost: 15000,
    totalSeats: 500,
    assignedSeats: 470,
    availableSeats: 30,
    utilizationRate: 94.0,
    renewalDate: '2027-05-31',
    contractNumber: 'PO-2024-MS-01',
  },
}) => {
  if (!open) return null;

  return (
    <>
      {/* Dimmed Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Right Slide-over Panel (640px) */}
      <aside className="license-detail-drawer fixed top-0 right-0 h-screen w-full sm:w-[640px] max-w-[640px] bg-white z-50 shadow-2xl border-l border-slate-200 flex flex-col justify-between font-body text-slate-800 antialiased animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Monogram Avatar */}
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0F67B1] font-bold text-sm flex items-center justify-center border border-blue-100 shrink-0 shadow-xs">
              MS
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight font-headline truncate">
                  {license.softwareName}
                </h2>
                <StatusBadge domain="compliance" status={license.status} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {license.publisher} • SKU: {license.sku}
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <button
              className="border border-[#0F67B1] text-[#0F67B1] hover:bg-blue-50 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-sm" data-icon="edit">
                edit
              </span>
              <span>Edit</span>
            </button>
            <button
              aria-label="Close drawer"
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              type="button"
              onClick={onClose}
            >
              <span className="material-symbols-outlined text-xl" data-icon="close">
                close
              </span>
            </button>
          </div>
        </div>

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-5 bg-slate-50/40">
          {/* SECTION 1: KEY INDICATORS (Compact 2x3 Grid) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-slate-500 tracking-wider uppercase flex items-center gap-1.5">
                <span className="material-symbols-outlined text-slate-400 text-sm" data-icon="insights">
                  insights
                </span>
                <span>KEY INDICATORS</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Contract #{license.contractNumber}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* 1. Monthly Cost */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-0.5">
                  <span className="text-xs font-medium">Monthly Cost</span>
                  <span className="material-symbols-outlined text-slate-400 text-base" data-icon="payments">
                    payments
                  </span>
                </div>
                <div className="text-lg font-bold text-slate-900 leading-tight">
                  {formatCurrency(license.monthlyCost)} / mo
                </div>
                <div className="text-xs text-slate-400 mt-1">Annual: {formatCurrency(license.annualCost)}</div>
              </div>

              {/* 2. Subscriptions */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-0.5">
                  <span className="text-xs font-medium">Subscriptions</span>
                  <span className="material-symbols-outlined text-slate-400 text-base" data-icon="description">
                    description
                  </span>
                </div>
                <div className="text-lg font-bold text-slate-900 leading-tight">3 Contracts</div>
                <div className="text-xs text-emerald-600 mt-1">Direct Enterprise</div>
              </div>

              {/* 3. Tiers */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-0.5">
                  <span className="text-xs font-medium">Tiers</span>
                  <span className="material-symbols-outlined text-slate-400 text-base" data-icon="layers">
                    layers
                  </span>
                </div>
                <div className="text-lg font-bold text-slate-900 leading-tight">E5 & E3 Tiers</div>
                <div className="text-xs text-slate-400 mt-1">400 E5, 100 E3</div>
              </div>

              {/* 4. Assigned Users */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-0.5">
                  <span className="text-xs font-medium">Assigned Users</span>
                  <span className="material-symbols-outlined text-slate-400 text-base" data-icon="group">
                    group
                  </span>
                </div>
                <div className="text-lg font-bold text-slate-900 leading-tight">
                  {license.assignedSeats} <span className="text-xs font-normal text-slate-500">/ {license.totalSeats}</span>
                </div>
                <div className="text-xs text-emerald-600 mt-1">{license.utilizationRate}% Utilization</div>
              </div>

              {/* 5. Available Seats */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-0.5">
                  <span className="text-xs font-medium">Available Seats</span>
                  <span className="material-symbols-outlined text-slate-400 text-base" data-icon="event_seat">
                    event_seat
                  </span>
                </div>
                <div className="text-lg font-bold text-slate-900 leading-tight">
                  {license.availableSeats} <span className="text-xs font-normal text-slate-500">seats buffer</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">6.0% Unassigned</div>
              </div>

              {/* 6. Renewal Date */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col justify-between hover:border-slate-300 transition-colors shadow-xs">
                <div className="flex items-center justify-between text-slate-500 mb-0.5">
                  <span className="text-xs font-medium">Renewal Date</span>
                  <span className="material-symbols-outlined text-slate-400 text-base" data-icon="calendar_today">
                    calendar_today
                  </span>
                </div>
                <div className="text-lg font-bold text-slate-900 leading-tight">
                  {formatDate(license.renewalDate)}
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">Auto-renews (30d notice)</div>
              </div>
            </div>
          </div>

          {/* SECTION 2: GOVERNANCE & DOCUMENTATION */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
            <div className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">
              GOVERNANCE & VENDOR LINKS
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="#docs"
                onClick={(e) => e.preventDefault()}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-sm text-[#0F67B1]">description</span>
                  <span>Master Services Agreement</span>
                </span>
                <span className="material-symbols-outlined text-xs text-slate-400">open_in_new</span>
              </a>
              <a
                href="#portal"
                onClick={(e) => e.preventDefault()}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-sm text-[#0F67B1]">admin_panel_settings</span>
                  <span>Microsoft 365 Admin Center</span>
                </span>
                <span className="material-symbols-outlined text-xs text-slate-400">open_in_new</span>
              </a>
            </div>
          </div>

          {/* SECTION 3: GRANTED ACCOUNTS ROSTER TABLE */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Granted Accounts Roster
                </div>
                <div className="text-xs text-slate-500">
                  Active assigned employees provisioned under this subscription
                </div>
              </div>
              <span className="text-xs font-mono text-[#0F67B1] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                470 Assigned
              </span>
            </div>

            <div className="table-surface table-scroll">
              <table className="data-table drawer-accounts-table" aria-label="Granted accounts roster">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                  <tr>
                    <th scope="col">Employee</th>
                    <th scope="col">Department</th>
                    <th scope="col">Tier</th>
                    <th scope="col">Last Active</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-[#0F67B1] flex items-center justify-center font-bold text-xs">
                          DN
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Dat Nguyen</div>
                          <div className="text-xs text-slate-400">dat.nguyen@vfast.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">Engineering</td>
                    <td className="py-2.5 px-3 font-mono font-medium">E5 Enterprise</td>
                    <td className="py-2.5 px-3 text-slate-500">Today, 09:24 AM</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge domain="usage" status="Active" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                          SJ
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Sarah Jenkins</div>
                          <div className="text-xs text-slate-400">s.jenkins@vfast.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">Product Management</td>
                    <td className="py-2.5 px-3 font-mono font-medium">E5 Enterprise</td>
                    <td className="py-2.5 px-3 text-slate-500">Yesterday</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge domain="usage" status="Active" />
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                          AM
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">Alex Mercer</div>
                          <div className="text-xs text-slate-400">alex.m@vfast.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">Operations</td>
                    <td className="py-2.5 px-3 font-mono font-medium">E3 Enterprise</td>
                    <td className="py-2.5 px-3 text-amber-600 font-medium">42 days ago</td>
                    <td className="py-2.5 px-3">
                      <StatusBadge domain="usage" status="Idle (42d)" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Drawer Sticky Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Last automated sync: <span className="font-mono text-slate-700">10 mins ago</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Reallocate Seats
            </button>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg bg-[#0F67B1] hover:bg-[#004f8b] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Manage Contract
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default LicenseDetailDrawer;
