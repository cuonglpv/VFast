import React, { useState } from 'react';
import { formatCurrency, formatDate } from '@/utils';

export interface LicenseRecord {
  id: string;
  softwareName: string;
  sku: string;
  publisher: string;
  publisherInitials: string;
  publisherBg: string;
  publisherColor: string;
  category: string;
  licenseType: string;
  complianceStatus: 'Compliant' | 'At Risk' | 'Over-allocated';
  purchasedAmount: number;
  entitlementSeats: number;
  activeUsers: number;
  totalUsers: number;
  utilizationRate: number;
  expiryDate: string;
}

interface LicenseListSectionProps {
  onSelectLicense?: (license: LicenseRecord) => void;
}

export const mockLicenseRecords: LicenseRecord[] = [
  {
    id: 'lic-m365-01',
    softwareName: 'Microsoft 365 Enterprise',
    sku: 'LIC-M365-01',
    publisher: 'Microsoft Corporation',
    publisherInitials: 'MS',
    publisherBg: 'bg-blue-100',
    publisherColor: 'text-[#0F67B1]',
    category: 'Productivity',
    licenseType: 'SaaS Subscription',
    complianceStatus: 'Compliant',
    purchasedAmount: 180000,
    entitlementSeats: 500,
    activeUsers: 470,
    totalUsers: 500,
    utilizationRate: 94,
    expiryDate: '2027-05-31',
  },
  {
    id: 'lic-slk-02',
    softwareName: 'Slack Enterprise Grid',
    sku: 'LIC-SLK-02',
    publisher: 'Salesforce, Inc.',
    publisherInitials: 'SL',
    publisherBg: 'bg-purple-100',
    publisherColor: 'text-purple-700',
    category: 'Communication',
    licenseType: 'SaaS Subscription',
    complianceStatus: 'Compliant',
    purchasedAmount: 68400,
    entitlementSeats: 450,
    activeUsers: 410,
    totalUsers: 450,
    utilizationRate: 91,
    expiryDate: '2026-12-15',
  },
  {
    id: 'lic-gh-03',
    softwareName: 'GitHub Enterprise',
    sku: 'LIC-GH-03',
    publisher: 'GitHub (Microsoft)',
    publisherInitials: 'GH',
    publisherBg: 'bg-slate-800',
    publisherColor: 'text-white',
    category: 'DevOps',
    licenseType: 'Enterprise Agreement',
    complianceStatus: 'Compliant',
    purchasedAmount: 63360,
    entitlementSeats: 300,
    activeUsers: 264,
    totalUsers: 300,
    utilizationRate: 88,
    expiryDate: '2027-02-28',
  },
  {
    id: 'lic-jira-04',
    softwareName: 'Jira Software Cloud',
    sku: 'LIC-JRA-04',
    publisher: 'Atlassian Pty Ltd',
    publisherInitials: 'JR',
    publisherBg: 'bg-sky-100',
    publisherColor: 'text-sky-700',
    category: 'DevOps',
    licenseType: 'SaaS Subscription',
    complianceStatus: 'Compliant',
    purchasedAmount: 43200,
    entitlementSeats: 300,
    activeUsers: 255,
    totalUsers: 300,
    utilizationRate: 85,
    expiryDate: '2026-11-20',
  },
  {
    id: 'lic-fg-05',
    softwareName: 'Figma Enterprise',
    sku: 'LIC-FIG-05',
    publisher: 'Figma, Inc.',
    publisherInitials: 'FG',
    publisherBg: 'bg-rose-100',
    publisherColor: 'text-rose-700',
    category: 'Design',
    licenseType: 'SaaS Subscription',
    complianceStatus: 'At Risk',
    purchasedAmount: 38400,
    entitlementSeats: 80,
    activeUsers: 78,
    totalUsers: 80,
    utilizationRate: 97.5,
    expiryDate: '2026-11-30',
  },
  {
    id: 'lic-dd-06',
    softwareName: 'Datadog Pro Infrastructure',
    sku: 'LIC-DD-06',
    publisher: 'Datadog, Inc.',
    publisherInitials: 'DD',
    publisherBg: 'bg-violet-100',
    publisherColor: 'text-violet-700',
    category: 'Security',
    licenseType: 'Consumption-based',
    complianceStatus: 'Compliant',
    purchasedAmount: 54000,
    entitlementSeats: 150,
    activeUsers: 108,
    totalUsers: 150,
    utilizationRate: 72,
    expiryDate: '2027-04-15',
  },
];

export const LicenseListSection: React.FC<LicenseListSectionProps> = ({ onSelectLicense }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  const filteredRecords = mockLicenseRecords.filter((rec) => {
    const matchSearch =
      rec.softwareName.toLowerCase().includes(search.toLowerCase()) ||
      rec.publisher.toLowerCase().includes(search.toLowerCase()) ||
      rec.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All Categories' || rec.category === selectedCategory;
    const matchStatus = selectedStatus === 'All Statuses' || rec.complianceStatus === selectedStatus;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* 5. FILTER TOOLBAR */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Live Table Search Input */}
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
              className="w-full pl-9 pr-3 py-1.5 text-xs text-slate-800 bg-[#f0f3ff] border border-slate-200 rounded-lg focus:outline-none focus:border-[#0f67b1] focus:ring-1 focus:ring-[#0f67b1] transition-all"
              placeholder="Search software, publisher, tags..."
              type="text"
            />
          </div>

          {/* Filter Dropdown 1 */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 bg-white focus:outline-none focus:border-[#0f67b1] cursor-pointer"
          >
            <option>All Categories</option>
            <option>DevOps</option>
            <option>Productivity</option>
            <option>Communication</option>
            <option>Design</option>
            <option>Security</option>
          </select>

          {/* Filter Dropdown 2 */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 bg-white focus:outline-none focus:border-[#0f67b1] cursor-pointer"
          >
            <option>All Statuses</option>
            <option>Compliant</option>
            <option>At Risk</option>
            <option>Over-allocated</option>
          </select>

          {/* Filter Dropdown 3 */}
          <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 bg-white focus:outline-none focus:border-[#0f67b1] cursor-pointer">
            <option>All Agreement Types</option>
            <option>SaaS Subscription</option>
            <option>Enterprise Agreement</option>
            <option>Consumption-based</option>
          </select>
        </div>

        {/* Right Tool Status / Reset */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                search || selectedCategory !== 'All Categories' || selectedStatus !== 'All Statuses'
                  ? 'bg-[#0f67b1]'
                  : 'bg-slate-400'
              }`}
            ></span>
            Filter:{' '}
            {search || selectedCategory !== 'All Categories' || selectedStatus !== 'All Statuses'
              ? 'Active'
              : 'None Active'}
          </span>
          {(search || selectedCategory !== 'All Categories' || selectedStatus !== 'All Statuses') && (
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All Categories');
                setSelectedStatus('All Statuses');
              }}
              className="text-xs text-[#0f67b1] hover:underline font-medium px-1 cursor-pointer"
              type="button"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* 6. DATA GRID TABLE (10 Columns, 100% Proportioned Width matching Figma) */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="w-[20%] px-3 py-3 truncate">LICENSE NAME</th>
                <th className="w-[14%] px-3 py-3 truncate">PUBLISHER</th>
                <th className="w-[10%] px-3 py-3 truncate">LICENSE TYPE</th>
                <th className="w-[10%] px-3 py-3 truncate">COMPLIANCE</th>
                <th className="w-[10%] px-3 py-3 text-right truncate">PURCHASED ($)</th>
                <th className="w-[8%] px-3 py-3 text-right truncate">ENTITLEMENT</th>
                <th className="w-[7%] px-3 py-3 text-right truncate">ACTIVE USERS</th>
                <th className="w-[8%] px-3 py-3 text-right truncate">TOTAL USERS</th>
                <th className="w-[9%] px-3 py-3 truncate">EXPIRY DATE</th>
                <th className="w-[4%] px-1 py-3 text-center truncate">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRecords.map((lic) => (
                <tr
                  key={lic.id}
                  onClick={() => onSelectLicense && onSelectLicense(lic)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors group"
                >
                  <td className="px-3 py-3 overflow-hidden">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded ${lic.publisherBg} ${lic.publisherColor} flex items-center justify-center font-bold text-[11px] shrink-0 shadow-xs`}
                      >
                        {lic.publisherInitials}
                      </div>
                      <div className="min-w-0 flex-1 truncate">
                        <div className="font-semibold text-slate-900 group-hover:text-[#0f67b1] transition-colors truncate">
                          {lic.softwareName}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 truncate">{lic.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-600 truncate">{lic.publisher}</td>
                  <td className="px-3 py-3 text-slate-500 truncate">{lic.licenseType}</td>
                  <td className="px-3 py-3 truncate">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        lic.complianceStatus === 'Compliant'
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          : 'text-amber-700 bg-amber-50 border border-amber-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          lic.complianceStatus === 'Compliant' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      ></span>
                      {lic.complianceStatus}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-medium text-slate-900 truncate">
                    {formatCurrency(lic.purchasedAmount)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-slate-500 truncate">
                    {lic.entitlementSeats} seats
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-medium text-slate-800 truncate">
                    {lic.activeUsers}
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-slate-600 truncate">
                    {lic.activeUsers}/{lic.entitlementSeats}{' '}
                    <span
                      className={`font-semibold ${
                        lic.utilizationRate >= 85 ? 'text-emerald-700' : 'text-amber-600'
                      }`}
                    >
                      ({lic.utilizationRate}%)
                    </span>
                  </td>
                  <td className="px-3 py-3 font-mono text-slate-500 truncate">{formatDate(lic.expiryDate)}</td>
                  <td className="px-1 py-3 text-center">
                    <button
                      className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="View Details"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLicense && onSelectLicense(lic);
                      }}
                    >
                      <span className="material-symbols-outlined text-base" data-icon="more_vert">
                        more_vert
                      </span>
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

export default LicenseListSection;
