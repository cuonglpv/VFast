import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { BudgetKpiSection, BudgetRenewalsDrawerSection } from '@/sections/budget';
import { BudgetKpiOverview, RenewalObligation } from '@/types/budget';

const mockOverview: BudgetKpiOverview = {
  fiscalYear: 2026,
  month: 11,
  allocatedBudget: 160000,
  actualSpendMtd: 131600,
  remainingBudget: 28400,
  burnRatePercentage: 82.3,
  fixedRenewalsAmount: 116000,
  expiringLicensesCount: 6,
  commitmentPercentage: 72.5,
  recoverableWaste: 12450,
};

const mockRenewals: RenewalObligation[] = [
  {
    id: 'ren-001',
    softwareName: 'Slack Enterprise Grid',
    publisher: 'Salesforce',
    category: 'Communication',
    renewalDate: '2026-11-30',
    renewalCost: 52500,
    activeUtilizationRate: 64.2,
    status: 'Critical',
  },
  {
    id: 'ren-002',
    softwareName: 'Datadog APM & Infra',
    publisher: 'Datadog',
    category: 'Observability',
    renewalDate: '2026-12-05',
    renewalCost: 38000,
    activeUtilizationRate: 91.0,
    status: 'Healthy',
  },
  {
    id: 'ren-003',
    softwareName: 'Figma Organization',
    publisher: 'Figma Inc.',
    category: 'Design',
    renewalDate: '2026-12-10',
    renewalCost: 24300,
    activeUtilizationRate: 78.4,
    status: 'Warning',
  },
];

export const BudgetAnalyticsPage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          Budget Analytics
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Financial control center for license spend monitoring, burn rates, and renewal obligations.
        </Typography>
      </Box>

      {/* Top 4 Budget KPIs */}
      <BudgetKpiSection
        overview={mockOverview}
        onOpenRenewalsDrawer={() => setDrawerOpen(true)}
      />

      {/* 640px Right Drawer for Renewals */}
      <BudgetRenewalsDrawerSection
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        renewals={mockRenewals}
      />
    </Box>
  );
};

export default BudgetAnalyticsPage;
