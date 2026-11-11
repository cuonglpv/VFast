import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import LicenseManagementPage from '@/pages/licenses/LicenseManagementPage';
import LicenseDetailPage from '@/pages/licenses/LicenseDetailPage';
import BudgetAnalyticsPage from '@/pages/budget/BudgetAnalyticsPage';
import UserManagementPage from '@/pages/users/UserManagementPage';
import GeneralAnalyticsPage from '@/pages/analytics/GeneralAnalyticsPage';
import { PATHS } from './paths';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={PATHS.LICENSES} replace />,
      },
      {
        path: PATHS.LICENSES,
        element: <LicenseManagementPage />,
      },
      {
        path: PATHS.LICENSE_DETAIL,
        element: <LicenseDetailPage />,
      },
      {
        path: PATHS.SETTINGS,
        element: <div className="page-heading"><h1>Settings</h1><p>Workspace: VFast Enterprise · Profile: Dat Nguyen · Role: System Admin</p></div>,
      },
      {
        path: PATHS.BUDGET,
        element: <BudgetAnalyticsPage />,
      },
      {
        path: PATHS.ANALYTICS,
        element: <GeneralAnalyticsPage />,
      },
      {
        path: PATHS.USERS,
        element: <UserManagementPage />,
      },
    ],
  },
]);

export default router;
