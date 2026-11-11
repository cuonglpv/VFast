import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

export const GeneralAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Horizontal Tabs */}
      <div className="flex items-center border-b border-slate-200">
        <button className="border-b-2 border-[#0F67B1] text-[#0F67B1] py-2.5 px-4 font-semibold text-sm transition-colors cursor-pointer">
          License Health
        </button>
        <button
          onClick={() => navigate(PATHS.BUDGET)}
          className="text-slate-500 hover:text-slate-700 py-2.5 px-4 font-medium text-sm transition-colors border-b-2 border-transparent cursor-pointer"
        >
          Budget Analytics
        </button>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-headline">
            License Health & Optimization Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time idle account detection, seat usage breakdown, and recoverable waste mitigation.
          </p>
        </div>

        {/* Date Filter & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 shadow-xs">
            <span className="material-symbols-outlined text-base text-slate-400">calendar_today</span>
            <span>Last 90 Days</span>
          </div>
          <button className="bg-[#0F67B1] hover:bg-[#004f8b] text-white px-3.5 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
            <span className="material-symbols-outlined text-base">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 4 KEY METRICS (Figma SCR-ANALYTICS-01 Specification) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Metric 1: Annual Spend */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>ANNUAL SPEND</span>
            <span className="material-symbols-outlined text-slate-400 text-base">payments</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-headline tracking-tight my-1">
            $1,420,000
          </div>
          <div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium inline-block">
              Within Budget Cap
            </span>
          </div>
        </div>

        {/* Metric 2: Managed Licenses */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>MANAGED LICENSES</span>
            <span className="material-symbols-outlined text-slate-400 text-base">vpn_key</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-headline tracking-tight my-1">
            1,284
          </div>
          <div>
            <span className="bg-sky-50 text-[#0F67B1] border border-sky-200 text-xs px-2.5 py-0.5 rounded-full font-medium inline-block">
              48 Active Apps
            </span>
          </div>
        </div>

        {/* Metric 3: Idle Accounts */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>IDLE ACCOUNTS</span>
            <span className="material-symbols-outlined text-slate-400 text-base">person_off</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-headline tracking-tight my-1">
            312
          </div>
          <div>
            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-medium inline-block">
              24.3% Rate (Inactive &gt;60d)
            </span>
          </div>
        </div>

        {/* Metric 4: Wasted Spend */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[120px]">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>WASTED SPEND</span>
            <span className="material-symbols-outlined text-slate-400 text-base">trending_down</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-headline tracking-tight my-1">
            $285,600 <span className="text-xs font-normal text-slate-500">/ yr</span>
          </div>
          <div>
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs px-2.5 py-0.5 rounded-full font-medium inline-block">
              20.1% Leakage
            </span>
          </div>
        </div>
      </div>

      {/* APPLICATION USAGE HORIZONTAL STACKED BARS */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-headline font-bold text-slate-900 text-sm">Application Usage Breakdown</h3>
            <p className="text-xs text-slate-500">
              Active accounts vs underutilized and inactive seats (&gt;60 days with zero logins)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              Active (&gt;80%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
              Idle (&lt;30d)
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-400"></span>
              Never Used (&gt;60d)
            </span>
          </div>
        </div>

        <div className="space-y-4 pt-1">
          {/* App 1: Microsoft 365 */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-800">Microsoft 365 Enterprise</span>
              <span className="text-slate-500 font-mono text-[11px]">470 / 500 Provisioned (94%)</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full flex overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: '82%' }}></div>
              <div className="bg-amber-400 h-full" style={{ width: '12%' }}></div>
              <div className="bg-rose-400 h-full" style={{ width: '6%' }}></div>
            </div>
          </div>

          {/* App 2: Slack Grid */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-800">Slack Enterprise Grid</span>
              <span className="text-slate-500 font-mono text-[11px]">410 / 450 Provisioned (91%)</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full flex overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: '74%' }}></div>
              <div className="bg-amber-400 h-full" style={{ width: '17%' }}></div>
              <div className="bg-rose-400 h-full" style={{ width: '9%' }}></div>
            </div>
          </div>

          {/* App 3: GitHub Enterprise */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-800">GitHub Enterprise Cloud</span>
              <span className="text-slate-500 font-mono text-[11px]">264 / 300 Provisioned (88%)</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full flex overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: '85%' }}></div>
              <div className="bg-amber-400 h-full" style={{ width: '10%' }}></div>
              <div className="bg-rose-400 h-full" style={{ width: '5%' }}></div>
            </div>
          </div>

          {/* App 4: Figma Enterprise */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-800">Figma Enterprise</span>
              <span className="text-slate-500 font-mono text-[11px]">78 / 80 Provisioned (97.5%)</span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full flex overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: '68%' }}></div>
              <div className="bg-amber-400 h-full" style={{ width: '22%' }}></div>
              <div className="bg-rose-400 h-full" style={{ width: '10%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralAnalyticsPage;
