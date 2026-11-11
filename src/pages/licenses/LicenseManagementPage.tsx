import React, { useState } from 'react';
import { LicenseListSection, LicenseRecord, LicenseDetailDrawer } from '@/sections/licenses';

export const LicenseManagementPage: React.FC = () => {
  const [selectedLicense, setSelectedLicense] = useState<LicenseRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSelectLicense = (lic: LicenseRecord) => {
    setSelectedLicense(lic);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#111c2d] font-headline">
            License Portfolio Overview
          </h1>
          <p className="text-xs text-[#515f74] mt-0.5">
            Real-time governance, consumption metrics, and vendor SLA audit track.
          </p>
        </div>

        {/* Right Action CTAs */}
        <div className="flex items-center gap-2.5">
          <button
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#e2e8f0] text-[#111c2d] hover:bg-slate-50 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base text-[#515f74]" data-icon="file_download">
              file_download
            </span>
            <span>Export CSV</span>
          </button>
          <button
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0F67B1] hover:bg-[#004f8b] text-white text-xs font-semibold rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base" data-icon="add">
              add
            </span>
            <span>Add License</span>
          </button>
        </div>
      </div>

      {/* 4. TOP VISUAL METRICS ROW (Bento Architecture: 3-Col Split verbatim from Figma) */}
      <div className="grid grid-cols-12 gap-4">
        {/* Col 1 (col-span-3): Compact KPI Stack */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-3 h-auto lg:h-[270px]">
          {/* Card 1A: TOTAL LICENSES */}
          <div className="h-[129px] p-4 bg-white border border-[#e2e8f0] rounded-xl flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#515f74]">
                TOTAL LICENSES
              </span>
              <span
                className="material-symbols-outlined text-slate-400 text-sm cursor-help"
                data-icon="info"
                title="Total active managed software contracts"
              >
                info
              </span>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#111c2d] leading-none tracking-tight">1,284</div>
            </div>
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full w-fit">
                <span className="material-symbols-outlined text-xs" data-icon="trending_up">
                  trending_up
                </span>
                +4.5% MoM
              </span>
            </div>
          </div>

          {/* Card 1B: SEAT UTILIZATION */}
          <div className="h-[129px] p-4 bg-white border border-[#e2e8f0] rounded-xl flex flex-col justify-between shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#515f74]">
                SEAT UTILIZATION
              </span>
              <span
                className="material-symbols-outlined text-slate-400 text-sm cursor-help"
                data-icon="info"
                title="Active provisioned seats across all vendors"
              >
                info
              </span>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#111c2d] leading-none tracking-tight">88.9%</div>
            </div>
            <div>
              <span className="inline-flex text-[11px] font-medium text-[#515f74] bg-[#f0f3ff] border border-[#c1c7d3]/60 px-2 py-0.5 rounded-full w-fit">
                1,142 / 1,284 Active
              </span>
            </div>
          </div>
        </div>

        {/* Col 2 (col-span-4): SVG Donut Category Breakdown */}
        <div className="col-span-12 lg:col-span-4 h-auto lg:h-[270px] p-4 bg-white border border-[#e2e8f0] rounded-xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#515f74]">
              CATEGORY BREAKDOWN
            </span>
            <span
              className="material-symbols-outlined text-slate-400 text-sm cursor-help"
              data-icon="info"
              title="Seat allocation grouped by IT software function"
            >
              info
            </span>
          </div>

          <div className="flex items-center gap-4 my-auto">
            {/* Donut SVG */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="transparent" r="40" stroke="#f1f5f9" strokeWidth="12"></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#0F67B1"
                  strokeDasharray="80.4 170.8"
                  strokeDashoffset="0"
                  strokeWidth="12"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#38BDF8"
                  strokeDasharray="70.3 180.9"
                  strokeDashoffset="-80.4"
                  strokeWidth="12"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#64748B"
                  strokeDasharray="45.2 206.0"
                  strokeDashoffset="-150.7"
                  strokeWidth="12"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#94A3B8"
                  strokeDasharray="30.1 221.1"
                  strokeDashoffset="-195.9"
                  strokeWidth="12"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#CBD5E1"
                  strokeDasharray="17.5 233.7"
                  strokeDashoffset="-226.0"
                  strokeWidth="12"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#E2E8F0"
                  strokeDasharray="7.5 243.7"
                  strokeDashoffset="-243.5"
                  strokeWidth="12"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-none">
                <span className="text-base font-bold text-[#111c2d]">1,284</span>
                <span className="text-[10px] text-[#515f74] mt-0.5">Total</span>
              </div>
            </div>

            {/* 2-Column Category Legend */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[11px] flex-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0 bg-[#0F67B1]"></span>
                <span className="text-[#515f74] truncate">DevOps</span>
                <span className="font-semibold text-[#111c2d] ml-auto">32%</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0 bg-[#38BDF8]"></span>
                <span className="text-[#515f74] truncate">Productivity</span>
                <span className="font-semibold text-[#111c2d] ml-auto">28%</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0 bg-[#64748B]"></span>
                <span className="text-[#515f74] truncate">Comms</span>
                <span className="font-semibold text-[#111c2d] ml-auto">18%</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0 bg-[#94A3B8]"></span>
                <span className="text-[#515f74] truncate">Design</span>
                <span className="font-semibold text-[#111c2d] ml-auto">12%</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0 bg-[#CBD5E1]"></span>
                <span className="text-[#515f74] truncate">Security</span>
                <span className="font-semibold text-[#111c2d] ml-auto">7%</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0 bg-[#E2E8F0]"></span>
                <span className="text-[#515f74] truncate">Utilities</span>
                <span className="font-semibold text-[#111c2d] ml-auto">3%</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#515f74] pt-2 border-t border-[#e2e8f0] flex justify-between">
            <span>Primary driver: Engineering & Data Cloud</span>
            <span className="text-[#004f8b] font-medium cursor-pointer hover:underline">Details →</span>
          </div>
        </div>

        {/* Col 3 (col-span-5): Top 5 App Usage Linear Bars */}
        <div className="col-span-12 lg:col-span-5 h-auto lg:h-[270px] p-4 bg-white border border-[#e2e8f0] rounded-xl flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#515f74]">
              TOP 5 APP USAGE
            </span>
            <span
              className="material-symbols-outlined text-slate-400 text-sm cursor-help"
              data-icon="info"
              title="Applications with the highest provisioned license ratio"
            >
              info
            </span>
          </div>

          <div className="space-y-2.5 my-auto">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-[#111c2d]">Microsoft 365</span>
                <span className="text-[#515f74] font-mono text-[11px]">
                  94% <span className="text-slate-400">(470/500 seats)</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: '94%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-[#111c2d]">Slack Grid</span>
                <span className="text-[#515f74] font-mono text-[11px]">
                  91% <span className="text-slate-400">(410/450 seats)</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: '91%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-[#111c2d]">GitHub Enterprise</span>
                <span className="text-[#515f74] font-mono text-[11px]">
                  88% <span className="text-slate-400">(264/300 seats)</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: '88%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-[#111c2d]">Jira Software</span>
                <span className="text-[#515f74] font-mono text-[11px]">
                  85% <span className="text-slate-400">(255/300 seats)</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-medium text-[#111c2d]">Zoom Business</span>
                <span className="text-[#515f74] font-mono text-[11px]">
                  81% <span className="text-slate-400">(202/250 seats)</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: '81%' }}></div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-[#515f74] pt-1 flex justify-between items-center">
            <span className="text-slate-400">Target threshold: 85%+ high consumption</span>
            <span className="text-emerald-700 font-medium">Optimal Governance</span>
          </div>
        </div>
      </div>

      {/* 5. & 6. Filter Toolbar & Data Grid Table */}
      <LicenseListSection onSelectLicense={handleSelectLicense} />

      {/* 640px Slide-in Drawer (`SCR-LIC-DETAIL-01`) */}
      <LicenseDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        license={
          selectedLicense
            ? {
                id: selectedLicense.id,
                softwareName: selectedLicense.softwareName,
                publisher: selectedLicense.publisher,
                sku: selectedLicense.sku,
                category: selectedLicense.category,
                status: selectedLicense.complianceStatus,
                annualCost: selectedLicense.purchasedAmount,
                monthlyCost: Math.round(selectedLicense.purchasedAmount / 12),
                totalSeats: selectedLicense.entitlementSeats,
                assignedSeats: selectedLicense.activeUsers,
                availableSeats: selectedLicense.entitlementSeats - selectedLicense.activeUsers,
                utilizationRate: selectedLicense.utilizationRate,
                renewalDate: selectedLicense.expiryDate,
                contractNumber: 'PO-2024-MS-01',
              }
            : undefined
        }
      />
    </div>
  );
};

export default LicenseManagementPage;
