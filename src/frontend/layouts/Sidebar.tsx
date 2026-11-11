import { NavLink, useLocation } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import PortalIcon from '@/components/PortalIcon';

export default function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const { pathname } = useLocation();
  const detail = pathname.startsWith(`${PATHS.LICENSES}/`);
  return <aside className={`portal-sidebar ${open ? 'is-open' : ''}`}>
    <NavLink to={PATHS.LICENSES} className="portal-brand" onClick={onNavigate} aria-label="VFast Enterprise home"><strong>VFAST</strong><span>ENTERPRISE</span></NavLink>
    <div className="sidebar-body">
      <p className="nav-heading">Workspace</p>
      <nav aria-label="Workspace">
        <NavLink end to={PATHS.LICENSES} className="nav-link" onClick={onNavigate}><PortalIcon name="license" />License Management</NavLink>
        {detail && <NavLink to={pathname} className="nav-link" onClick={onNavigate}><PortalIcon name="license" />License Detail</NavLink>}
        <NavLink end to={PATHS.ANALYTICS} className="nav-link" onClick={onNavigate}><PortalIcon name="chart" />Analytics Hub</NavLink>
        {pathname === PATHS.BUDGET && <NavLink to={PATHS.BUDGET} className="nav-link" onClick={onNavigate}><PortalIcon name="chart" />Budget Analytics</NavLink>}
        <NavLink to={PATHS.USERS} className="nav-link" onClick={onNavigate}><PortalIcon name="users" />User Management</NavLink>
      </nav>
      <div className="sidebar-admin"><p className="nav-heading">Administration</p><NavLink to={PATHS.SETTINGS} className="settings-link" onClick={onNavigate}>Settings</NavLink></div>
    </div>
    <div className="sidebar-profile"><span className="profile-initials">DN</span><div><strong>Dat Nguyen</strong><span>System Admin</span></div></div>
  </aside>;
}
