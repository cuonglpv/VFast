import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import LicenseWorkspaceLayout from '@/layouts/LicenseWorkspaceLayout';
import LicenseManagementPage from '@/pages/licenses/LicenseManagementPage';
import LicenseDetailPage from '@/pages/licenses/LicenseDetailPage';
import BudgetAnalyticsPage from '@/pages/budget/BudgetAnalyticsPage';
import UserManagementPage from '@/pages/users/UserManagementPage';
import GeneralAnalyticsPage from '@/pages/analytics/GeneralAnalyticsPage';
import AnalyticsDetailPage from '@/pages/analytics/AnalyticsDetailPage';
import { InfoTooltip } from '@/components/InfoTooltip';
import { PATHS } from './paths';
import { LicenseProvider } from '@/data/licenses';

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
        element: <LicenseProvider><LicenseWorkspaceLayout /></LicenseProvider>,
        children: [
          { path: PATHS.LICENSES, element: <LicenseManagementPage /> },
          { path: PATHS.LICENSE_DETAIL, element: <LicenseDetailPage /> },
        ],
      },
      {
        path: PATHS.SETTINGS,
        element: (
          <div className="page-heading">
            <h1 className="inline-flex items-center gap-2">
              <span>Settings</span>
              <InfoTooltip title="Workspace: VFast Enterprise · Profile: Dat Nguyen · Role: System Admin" />
            </h1>
          </div>
        ),
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
        path: PATHS.ANALYTICS_USAGE_DETAIL,
        element: <AnalyticsDetailPage key="usage" kind="usage" />,
      },
      {
        path: PATHS.ANALYTICS_SPEND_DETAIL,
        element: <AnalyticsDetailPage key="spend" kind="spend" />,
      },
      {
        path: PATHS.USERS,
        element: <UserManagementPage />,
      },
    ],
  },
]);

export default router;
