import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const navItems: NavItem[] = [
  { label: 'License Management', path: PATHS.LICENSES, icon: 'vpn_key' },
  { label: 'Analytics Hub', path: PATHS.ANALYTICS, icon: 'insights' },
  { label: 'Budget Analytics', path: PATHS.BUDGET, icon: 'account_balance_wallet' },
  { label: 'User Management', path: PATHS.USERS, icon: 'admin_panel_settings' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-[#e2e8f0] flex flex-col justify-between p-4 z-40 shadow-xs font-body text-sm font-medium">
      {/* Top Brand & Navigation Cluster */}
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 px-2 py-2 mb-6">
          <div className="w-9 h-9 rounded-lg bg-[#dee8ff] text-[#0f67b1] flex items-center justify-center shrink-0 shadow-xs">
            <span
              className="material-symbols-outlined text-xl fill text-[#0f67b1]"
              data-icon="vpn_key"
            >
              vpn_key
            </span>
          </div>
          <div className="flex flex-col leading-tight overflow-hidden">
            <span className="font-bold text-base text-[#111c2d] truncate">VFast ELMS</span>
            <span className="text-xs text-[#515f74] truncate">Executive Portal</span>
          </div>
        </div>

        {/* Main Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-150 ${
                  isSelected
                    ? 'bg-[#dee8ff] text-[#004f8b] font-semibold'
                    : 'text-[#515f74] hover:bg-[#f0f3ff] hover:text-[#111c2d]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-xl ${
                    isSelected ? 'fill text-[#004f8b]' : 'text-[#515f74]'
                  }`}
                  data-icon={item.icon}
                >
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sidebar Section & Tenant Context */}
      <div className="space-y-4 pt-4 border-t border-[#c1c7d3]/60">
        {/* Tenant Isolation Badge Card */}
        <div className="bg-[#f0f3ff] border border-[#c1c7d3]/80 rounded-lg p-2.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-semibold tracking-wider text-[#515f74]">
              Tenant Environment
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Isolated
            </span>
          </div>
          <p className="text-xs font-semibold text-[#111c2d] truncate">VFast Enterprise</p>
          <p className="text-[11px] text-[#515f74]">US-East (Virginia)</p>
        </div>

        {/* Footer Sub-Navigation Links */}
        <div className="space-y-0.5">
          <a
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-[#515f74] hover:bg-[#f0f3ff] text-xs transition-colors"
            href="#support"
            onClick={(e) => e.preventDefault()}
          >
            <span className="material-symbols-outlined text-base" data-icon="help_outline">
              help_outline
            </span>
            <span>Support & Docs</span>
          </a>
          <a
            className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-[#515f74] hover:bg-[#f0f3ff] text-xs transition-colors"
            href="#signout"
            onClick={(e) => e.preventDefault()}
          >
            <span className="material-symbols-outlined text-base" data-icon="logout">
              logout
            </span>
            <span>Sign Out</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
