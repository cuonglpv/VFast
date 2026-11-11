import React from 'react';
import { useLocation } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

export const Header: React.FC = () => {
  const location = useLocation();

  // Dynamic breadcrumb & screen ID matching Figma
  const getRouteMetadata = () => {
    switch (location.pathname) {
      case PATHS.BUDGET:
        return {
          title: 'Budget Analytics',
          screenId: 'SCR-BUDGET-ANALYTICS-01',
        };
      case PATHS.ANALYTICS:
        return {
          title: 'Analytics Hub',
          screenId: 'SCR-ANALYTICS-01',
        };
      case PATHS.USERS:
        return {
          title: 'User Management',
          screenId: 'SCR-USER-MGMT-01',
        };
      case PATHS.LICENSES:
      default:
        return {
          title: 'License Management',
          screenId: 'SCR-LIC-MGMT-01',
        };
    }
  };

  const { title, screenId } = getRouteMetadata();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 pl-60 pr-8 bg-white border-b border-[#e2e8f0] flex justify-between items-center z-30 shadow-xs">
      {/* Left Area: Breadcrumb & Screen ID Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#515f74] font-medium">Executive Portal</span>
          <span className="text-[#717782] text-xs">/</span>
          <span className="text-[#004f8b] font-semibold">{title}</span>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#f0f3ff] text-[#515f74] border border-[#c1c7d3]">
          {screenId}
        </span>
      </div>

      {/* Center-Right Controls & Profile Monogram */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-72 hidden md:block">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#515f74] text-base pointer-events-none"
            data-icon="search"
          >
            search
          </span>
          <input
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f0f3ff] text-[#111c2d] border border-[#c1c7d3] rounded-lg focus:outline-none focus:border-[#0f67b1] focus:ring-1 focus:ring-[#0f67b1] transition-all placeholder:text-[#515f74]/70"
            placeholder="Global search licenses, vendors..."
            type="text"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-1 text-[#515f74] border-r border-[#e2e8f0] pr-3">
          {/* Notifications Bell with Red Indicator */}
          <button
            className="relative p-2 rounded-lg hover:bg-[#f0f3ff] transition-colors"
            title="Notifications"
            type="button"
          >
            <span className="material-symbols-outlined text-xl" data-icon="notifications">
              notifications
            </span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
          </button>

          {/* Help Outline */}
          <button
            className="p-2 rounded-lg hover:bg-[#f0f3ff] transition-colors"
            title="Help & Support"
            type="button"
          >
            <span className="material-symbols-outlined text-xl" data-icon="help_outline">
              help_outline
            </span>
          </button>
        </div>

        {/* Trailing Primary Action: Dat Nguyen Profile */}
        <div className="flex items-center gap-3 pl-1 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-[#0f67b1] text-white flex items-center justify-center font-semibold text-xs shadow-xs">
            DN
          </div>
          <div className="flex flex-col text-left leading-tight hidden sm:flex">
            <span className="text-xs font-semibold text-[#111c2d] group-hover:text-[#0f67b1] transition-colors">
              Dat Nguyen
            </span>
            <span className="text-[11px] text-[#515f74]">Chief IT Architect</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
