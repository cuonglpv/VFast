import React from 'react';
import { Grid } from '@mui/material';
import { KpiCard } from '@/components/cards';
import { formatCurrency, formatPercentage } from '@/utils';
import { BudgetKpiOverview } from '@/types/budget';

interface BudgetKpiSectionProps {
  overview: BudgetKpiOverview;
  onOpenRenewalsDrawer?: () => void;
}

export const BudgetKpiSection: React.FC<BudgetKpiSectionProps> = ({ overview, onOpenRenewalsDrawer }) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {/* KPI 1: Remaining Budget */}
      <Grid item xs={12} sm={6} md={3}>
        <KpiCard
          title="Remaining Budget"
          value={formatCurrency(overview.remainingBudget)}
          subtitle="MTD remaining allocation"
          tooltipText="Calculated as Allocated Budget minus Actual Spend Month-To-Date."
          chipLabel={`${formatPercentage(100 - overview.burnRatePercentage)} left`}
          chipColor="primary"
        />
      </Grid>

      {/* KPI 2: Next Month Renewals */}
      <Grid item xs={12} sm={6} md={3}>
        <KpiCard
          title="Next Month Renewals"
          value={formatPercentage(overview.commitmentPercentage)}
          subtitle="Committed to recurring contracts due next month"
          tooltipText="Proportion of monthly budget committed to recurring contracts renewing next month."
          chipLabel={`${overview.expiringLicensesCount} Expiring`}
          chipColor={overview.commitmentPercentage > 70 ? 'warning' : 'default'}
          actionLabel={`View Renewals (${overview.expiringLicensesCount}) →`}
          onActionClick={onOpenRenewalsDrawer}
        />
      </Grid>

      {/* KPI 3: Budget Consumed */}
      <Grid item xs={12} sm={6} md={3}>
        <KpiCard
          title="Budget Consumed"
          value={formatPercentage(overview.burnRatePercentage)}
          tooltipText="Current burn rate against the monthly budget ceiling."
          chipLabel={overview.burnRatePercentage > 80 ? 'High Burn' : 'On Track'}
          chipColor={overview.burnRatePercentage > 80 ? 'error' : 'success'}
        />
      </Grid>

      {/* KPI 4: Recoverable Waste */}
      <Grid item xs={12} sm={6} md={3}>
        <KpiCard
          title="Recoverable Waste"
          value={formatCurrency(overview.recoverableWaste)}
          subtitle="From unused & idle seats"
          tooltipText="Annual spend currently assigned to accounts with zero activity in the last 60 days."
          chipLabel="Actionable"
          chipColor="warning"
        />
      </Grid>
    </Grid>
  );
};

export default BudgetKpiSection;
