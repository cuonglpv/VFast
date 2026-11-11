import { createContext, useContext, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PATHS } from '@/routes/paths';

interface InventoryView {
  search: string;
  category: string;
  compliance: string;
  rowsPerPage: number;
  page: number;
}

interface InventoryPosition {
  top: number;
  tableLeft: number;
}

const LicenseWorkspaceContext = createContext<{
  inventory: InventoryView;
  updateInventory: (patch: Partial<InventoryView>) => void;
  position: { current: InventoryPosition };
  rememberScroll: () => void;
} | null>(null);

export default function LicenseWorkspaceLayout() {
  const { pathname } = useLocation();
  const [inventory, setInventory] = useState<InventoryView>({ search: '', category: '', compliance: '', rowsPerPage: 10, page: 0 });
  const position = useRef<InventoryPosition>({ top: 0, tableLeft: 0 });

  useLayoutEffect(() => {
    if (pathname !== PATHS.LICENSES) {
      window.scrollTo(0, 0);
      return;
    }
    window.scrollTo(0, position.current.top);
    const remember = () => { position.current.top = window.scrollY; };
    window.addEventListener('scroll', remember, { passive: true });
    return () => window.removeEventListener('scroll', remember);
  }, [pathname]);

  function updateInventory(patch: Partial<InventoryView>) {
    setInventory(current => ({ ...current, ...patch }));
  }

  return <LicenseWorkspaceContext.Provider value={{ inventory, updateInventory, position, rememberScroll: () => { position.current.top = window.scrollY; } }}>
    <Outlet />
  </LicenseWorkspaceContext.Provider>;
}

export function useLicenseInventoryView() {
  const context = useContext(LicenseWorkspaceContext);
  if (!context) throw new Error('LicenseWorkspaceLayout is required');
  return context;
}
