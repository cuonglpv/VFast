import { browserLicenseRepository, type LicenseRepository } from './licenseRepository';
import { mockDashboardRepository, type DashboardRepository } from './dashboardRepository';
import { browserBudgetPlanRepository, type BudgetPlanRepository } from './budgetPlanRepository';

// Replace this binding with an HTTP repository after the backend contract is agreed.
export const licenseRepository: LicenseRepository = browserLicenseRepository;
export const dashboardRepository: DashboardRepository = mockDashboardRepository;
export const budgetPlanRepository: BudgetPlanRepository = browserBudgetPlanRepository;
