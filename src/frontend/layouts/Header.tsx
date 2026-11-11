import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import PortalIcon from '@/components/PortalIcon';

export default function Header({ onMenu }: { onMenu: () => void }) {
  const { pathname } = useLocation();
  const [panel, setPanel] = useState<'help' | 'notifications' | null>(null);
  const detail = pathname.startsWith(PATHS.LICENSES + '/');
  const analyticsDetailTitle = pathname === PATHS.ANALYTICS_USAGE_DETAIL ? 'Application Usage' : pathname === PATHS.ANALYTICS_SPEND_DETAIL ? 'Department Spend' : null;
  const title = detail ? 'License Detail' : analyticsDetailTitle ?? (pathname === PATHS.ANALYTICS ? 'License Health' : pathname === PATHS.USERS ? 'User Management' : pathname === PATHS.BUDGET ? 'Budget Analytics' : pathname === PATHS.SETTINGS ? 'Settings' : 'License Management');
  return <header className="portal-header">
    <button className="mobile-menu" aria-label="Toggle navigation" onClick={onMenu}><PortalIcon name="menu" /></button>
    <div className="portal-breadcrumb"><span>Workspace</span><span>/</span>{detail && <><Link to={PATHS.LICENSES}>License Management</Link><span>/</span></>}{analyticsDetailTitle && <><Link to={`${PATHS.ANALYTICS}#analytics-breakdowns`}>License Health</Link><span>/</span></>}<span>{title}</span></div>
    <div className="header-actions"><button aria-expanded={panel === 'help'} onClick={() => setPanel(panel === 'help' ? null : 'help')}>Help</button><span>•</span><button aria-expanded={panel === 'notifications'} onClick={() => setPanel(panel === 'notifications' ? null : 'notifications')}>Notifications</button><span>•</span><span>DN</span></div>
    {panel && <div className="header-popover" role="region" aria-label={panel === 'help' ? 'Help' : 'Notifications'}><button className="popover-close" aria-label="Close panel" onClick={() => setPanel(null)}>×</button><h2>{panel === 'help' ? 'Workspace help' : 'Notifications'}</h2><p>{panel === 'help' ? 'Search or filter your license inventory. Select a license to view its details. Open Analytics Hub to review license health.' : 'No new notifications.'}</p></div>}
  </header>;
}
