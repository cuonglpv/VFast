import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import PortalIcon from '@/components/PortalIcon';

export default function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const { pathname } = useLocation();
  const analyticsActive = pathname === PATHS.ANALYTICS || pathname.startsWith(PATHS.ANALYTICS + '/');
  const analyticsDetailActive = pathname === PATHS.ANALYTICS_USAGE_DETAIL || pathname === PATHS.ANALYTICS_SPEND_DETAIL;
  const [analyticsOpen, setAnalyticsOpen] = useState(analyticsActive);
  return <aside className={`portal-sidebar ${open ? 'is-open' : ''}`}>
    <NavLink to={PATHS.LICENSES} className="portal-brand" onClick={onNavigate} aria-label="VFast Enterprise home"><strong>VFAST</strong><span>ENTERPRISE</span></NavLink>
    <div className="sidebar-body">
      <p className="nav-heading">Workspace</p>
      <nav aria-label="Workspace">
        <NavLink to={PATHS.LICENSES} className="nav-link" onClick={onNavigate}><PortalIcon name="license" />License Management</NavLink>
        <button type="button" className={`nav-link nav-group-toggle ${analyticsActive ? 'group-active' : ''}`} aria-expanded={analyticsOpen} aria-controls="analytics-subnav" onClick={() => setAnalyticsOpen(value => !value)}>
          <PortalIcon name="chart" />Analytics Hub
          <svg className="nav-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div id="analytics-subnav" className={`nav-submenu-panel ${analyticsOpen ? 'is-open' : ''}`} inert={!analyticsOpen} aria-hidden={!analyticsOpen}>
          <div className="nav-submenu-clip"><div className="nav-submenu">
            <NavLink end to={PATHS.ANALYTICS} className={({ isActive }) => `nav-link ${isActive || analyticsDetailActive ? 'active' : ''}`} onClick={onNavigate}>License Health</NavLink>
            <NavLink to={PATHS.BUDGET} className="nav-link" onClick={onNavigate}>Budget Analytics</NavLink>
          </div></div>
        </div>
        <NavLink to={PATHS.USERS} className="nav-link" onClick={onNavigate}><PortalIcon name="users" />User Management</NavLink>
      </nav>
      <div className="sidebar-admin"><p className="nav-heading">Administration</p><NavLink to={PATHS.SETTINGS} className="settings-link" onClick={onNavigate}>Settings</NavLink></div>
    </div>
    <div className="sidebar-profile"><span className="profile-initials">DN</span><div><strong>Dat Nguyen</strong><span>System Admin</span></div></div>
  </aside>;
}
