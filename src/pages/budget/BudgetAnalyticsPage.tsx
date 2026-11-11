import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import { BudgetRenewalsDrawerSection } from '@/sections/budget';
import { RenewalObligation } from '@/types/budget';

const mockRenewals: RenewalObligation[] = [
  {
    id: 'ren-001',
    softwareName: 'Slack Enterprise Grid',
    publisher: 'Salesforce, Inc.',
    category: 'Communication',
    renewalDate: '2026-12-15',
    renewalCost: 68400,
    activeUtilizationRate: 64.2,
    status: 'Critical',
  },
  {
    id: 'ren-002',
    softwareName: 'Datadog Pro Infrastructure',
    publisher: 'Datadog, Inc.',
    category: 'Security',
    renewalDate: '2026-12-05',
    renewalCost: 54000,
    activeUtilizationRate: 72.0,
    status: 'Warning',
  },
  {
    id: 'ren-003',
    softwareName: 'Figma Enterprise',
    publisher: 'Figma, Inc.',
    category: 'Design',
    renewalDate: '2026-12-10',
    renewalCost: 38400,
    activeUtilizationRate: 97.5,
    status: 'Healthy',
  },
  {
    id: 'ren-004',
    softwareName: 'Zoom Business Pro',
    publisher: 'Zoom Video Comms',
    category: 'Communication',
    renewalDate: '2026-12-20',
    renewalCost: 24200,
    activeUtilizationRate: 81.0,
    status: 'Healthy',
  },
];

export const BudgetAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'VND'>('USD');

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Horizontal Tabs */}
      <div className="flex items-center border-b border-slate-200">
        <button
          onClick={() => navigate(PATHS.ANALYTICS)}
          className="text-slate-500 hover:text-slate-700 py-2.5 px-4 font-medium text-sm transition-colors border-b-2 border-transparent cursor-pointer"
        >
          License Health
        </button>
        <button className="border-b-2 border-[#0F67B1] text-[#0F67B1] py-2.5 px-4 font-semibold text-sm transition-colors cursor-pointer">
          Budget Analytics
        </button>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-headline">
            Budget & Financial Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Predictive expenditure tracking, monthly budget planning, and renewal commitments.
          </p>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-3">
          {/* FY Selector */}
          <div className="relative">
            <select className="appearance-none rounded-lg border border-slate-200 px-3 pr-8 py-1.5 text-xs bg-white font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0F67B1] cursor-pointer">
              <option>FY 2026</option>
              <option>FY 2025</option>
              <option>FY 2024</option>
            </select>
            <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-base">
              expand_more
            </span>
          </div>

          {/* Currency Segmented Control */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm text-xs font-semibold">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                currency === 'USD' ? 'bg-[#0F67B1] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('VND')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                currency === 'VND' ? 'bg-[#0F67B1] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              VND (₫)
            </button>
          </div>

          {/* Primary CTA Button */}
          <button className="bg-[#0F67B1] hover:bg-[#004f8b] text-white px-3.5 py-1.5 rounded-lg font-medium text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-base">tune</span>
            <span>+ Set Monthly Budget</span>
          </button>
        </div>
      </div>

      {/* TOP 4 BUDGET KPIS GRID (Matching Figma Verbatim) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: REMAINING BUDGET */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Remaining Budget
            </span>
            <span
              className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-slate-600 text-base"
              title="Available uncommitted budget for current cycle"
            >
              info
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-headline tracking-tight leading-none my-1">
            $28,400
          </div>
          <div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium inline-block w-fit">
              23.7% Left
            </span>
          </div>
          <div className="text-xs text-slate-500">Current Month Safe Pace</div>
        </div>

        {/* Card 2: NEXT MONTH RENEWALS */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Next Month Renewals
            </span>
            <span
              className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-slate-600 text-base"
              title="Upcoming fixed license renewal obligations"
            >
              info
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-headline tracking-tight leading-none my-1">
            72.5%
          </div>
          <div className="flex items-center justify-between">
            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-medium">
              6 Expiring
            </span>
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-xs text-[#0F67B1] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <span>View Renewals (6)</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>
          <div className="text-xs text-slate-500">Committed to recurring contracts</div>
        </div>

        {/* Card 3: BUDGET CONSUMED */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Budget Consumed
            </span>
            <span
              className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-slate-600 text-base"
              title="MTD burn rate compared to budget ceiling"
            >
              info
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-headline tracking-tight leading-none my-1">
            82.3%
          </div>
          <div>
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-xs px-2.5 py-0.5 rounded-full font-medium inline-block w-fit">
              High Burn
            </span>
          </div>
          <div className="text-xs text-slate-500">MTD Spend: $131,600 / $160,000</div>
        </div>

        {/* Card 4: RECOVERABLE WASTE */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recoverable Waste
            </span>
            <span
              className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-slate-600 text-base"
              title="Identified spend from idle accounts inactive >60 days"
            >
              info
            </span>
          </div>
          <div className="text-3xl font-bold text-slate-900 font-headline tracking-tight leading-none my-1">
            $12,450
          </div>
          <div>
            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-medium inline-block w-fit">
              Actionable
            </span>
          </div>
          <div className="text-xs text-slate-500">42 idle seats ready to reclaim</div>
        </div>
      </div>

      {/* MIDDLE CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Col 1 (5 cols): Category Budget Share */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                CATEGORY BUDGET ALLOCATION
              </div>
              <div className="text-[11px] text-slate-400">Monthly burn rate vs allocated ceiling</div>
            </div>
            <span className="text-xs text-[#0F67B1] font-semibold font-mono">$160k Total</span>
          </div>

          <div className="space-y-3.5 flex-1 justify-center flex flex-col">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">Dev & DevOps</span>
                <span className="text-slate-500 font-mono text-[11px]">$41k / $46k (89%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#0F67B1] h-full rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">Productivity</span>
                <span className="text-slate-500 font-mono text-[11px]">$36k / $38k (95%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#38BDF8] h-full rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">Security & Infra</span>
                <span className="text-slate-500 font-mono text-[11px]">$19k / $22k (86%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#64748B] h-full rounded-full" style={{ width: '86%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">Design & Creative</span>
                <span className="text-slate-500 font-mono text-[11px]">$16k / $20k (80%)</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#94A3B8] h-full rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between text-[11px] text-slate-400">
            <span>Burn threshold safety margin: 15%</span>
            <span className="text-emerald-700 font-medium">Within Target Cap</span>
          </div>
        </div>

        {/* Col 2 (7 cols): Annual Spend Trajectory (SVG Chart matching Figma) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                ANNUAL SPENDING TRAJECTORY
              </div>
              <div className="text-[11px] text-slate-400">Actual spend MTD vs Planned monthly budget ceiling</div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-0.5 bg-[#0F67B1]"></span>
                Actual
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-0.5 bg-slate-300 border-dashed"></span>
                Ceiling
              </span>
            </div>
          </div>

          {/* SVG Spending Trajectory Area */}
          <div className="relative h-44 w-full my-auto">
            <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="spendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0F67B1" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0F67B1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeWidth="1" />

              {/* Ceiling Line */}
              <line x1="0" y1="35" x2="600" y2="35" stroke="#cbd5e1" strokeDasharray="4 4" strokeWidth="1.5" />

              {/* Area Fill */}
              <path
                d="M 20 130 Q 80 115 140 100 T 260 85 T 380 65 T 500 50 T 580 42 L 580 150 L 20 150 Z"
                fill="url(#spendGrad)"
              />
              {/* Line Stroke */}
              <path
                d="M 20 130 Q 80 115 140 100 T 260 85 T 380 65 T 500 50 T 580 42"
                fill="none"
                stroke="#0F67B1"
                strokeWidth="2.5"
              />

              {/* Data Points */}
              <circle cx="20" cy="130" r="3.5" fill="#ffffff" stroke="#0F67B1" strokeWidth="2" />
              <circle cx="140" cy="100" r="3.5" fill="#ffffff" stroke="#0F67B1" strokeWidth="2" />
              <circle cx="260" cy="85" r="3.5" fill="#ffffff" stroke="#0F67B1" strokeWidth="2" />
              <circle cx="380" cy="65" r="3.5" fill="#ffffff" stroke="#0F67B1" strokeWidth="2" />
              <circle cx="500" cy="50" r="3.5" fill="#ffffff" stroke="#0F67B1" strokeWidth="2" />
              <circle cx="580" cy="42" r="3.5" fill="#ffffff" stroke="#0F67B1" strokeWidth="2" />
            </svg>
          </div>

          <div className="grid grid-cols-12 text-[10px] font-mono text-slate-400 text-center pt-2 border-t border-slate-100">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: DEPARTMENTAL BUDGET LEDGER TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-headline font-bold text-slate-900 text-sm">Departmental Budget Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of approved allocations, spend burn rate, and variance reconciliation.
            </p>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs">
            <span className="material-symbols-outlined text-base text-slate-500">file_download</span>
            <span>Export CSV</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              <tr>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4 text-right">Allocated Budget</th>
                <th className="py-2.5 px-4 text-right">Actual Spend</th>
                <th className="py-2.5 px-4 text-right">Variance ($)</th>
                <th className="py-2.5 px-4 text-right">Variance (%)</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Dev & DevOps
                </td>
                <td className="py-3 px-4 text-right font-mono">$460,000</td>
                <td className="py-3 px-4 text-right font-mono">$410,000</td>
                <td className="py-3 px-4 text-right font-mono text-emerald-600 font-semibold">+$50,000</td>
                <td className="py-3 px-4 text-right font-mono text-emerald-600">-10.9%</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Optimal
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Productivity
                </td>
                <td className="py-3 px-4 text-right font-mono">$380,000</td>
                <td className="py-3 px-4 text-right font-mono">$360,000</td>
                <td className="py-3 px-4 text-right font-mono text-emerald-600 font-semibold">+$20,000</td>
                <td className="py-3 px-4 text-right font-mono text-emerald-600">-5.3%</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Optimal
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  Security
                </td>
                <td className="py-3 px-4 text-right font-mono">$220,000</td>
                <td className="py-3 px-4 text-right font-mono">$190,000</td>
                <td className="py-3 px-4 text-right font-mono text-emerald-600 font-semibold">+$30,000</td>
                <td className="py-3 px-4 text-right font-mono text-emerald-600">-13.6%</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Optimal
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  Cloud & Infra
                </td>
                <td className="py-3 px-4 text-right font-mono">$180,000</td>
                <td className="py-3 px-4 text-right font-mono">$178,000</td>
                <td className="py-3 px-4 text-right font-mono text-amber-600 font-semibold">+$2,000</td>
                <td className="py-3 px-4 text-right font-mono text-amber-600">-1.1%</td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    Warning
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 640px Slide-over Renewals Drawer (`SCR-BUDGET-RENEWALS-01`) */}
      <BudgetRenewalsDrawerSection
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        renewals={mockRenewals}
      />
    </div>
  );
};

export default BudgetAnalyticsPage;
