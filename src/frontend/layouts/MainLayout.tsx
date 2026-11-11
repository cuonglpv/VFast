import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function MainLayout() {
  const [navigationOpen, setNavigationOpen] = useState(false);
  return <div className="portal-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    {navigationOpen && <button className="navigation-backdrop" aria-label="Close navigation" onClick={() => setNavigationOpen(false)} />}
    <Sidebar open={navigationOpen} onNavigate={() => setNavigationOpen(false)} />
    <Header onMenu={() => setNavigationOpen(value => !value)} />
    <main id="main-content" className="portal-main"><Outlet /></main>
  </div>;
}
