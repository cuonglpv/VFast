import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { KpiCard } from '@/components/cards';
import { LicenseListSection } from '@/sections/licenses';
import { LicenseItem } from '@/types/license';
import { formatCurrency } from '@/utils';

const mockLicenses: LicenseItem[] = [
  {
    id: 'lic-001',
    softwareName: 'Microsoft 365 E5',
    publisher: 'Microsoft Corporation',
    publisherInitials: 'MS',
    category: 'Productivity',
    totalSeats: 500,
    assignedSeats: 485,
    utilizationRate: 97.0,
    annualCost: 216000,
    renewalDate: '2026-12-15',
    status: 'Active',
    measurementArchetype: 'Allocation',
  },
  {
    id: 'lic-002',
    softwareName: 'Slack Enterprise Grid',
    publisher: 'Salesforce',
    publisherInitials: 'SL',
    category: 'Communication',
    totalSeats: 350,
    assignedSeats: 310,
    utilizationRate: 88.6,
    annualCost: 52500,
    renewalDate: '2026-11-30',
    status: 'At Risk',
    measurementArchetype: 'Allocation',
  },
  {
    id: 'lic-003',
    softwareName: 'GitHub Enterprise Cloud',
    publisher: 'GitHub / Microsoft',
    publisherInitials: 'GH',
    category: 'Developer Tools',
    totalSeats: 120,
    assignedSeats: 118,
    utilizationRate: 98.3,
    annualCost: 28800,
    renewalDate: '2027-03-01',
    status: 'Active',
    measurementArchetype: 'Allocation',
  },
  {
    id: 'lic-004',
    softwareName: 'Figma Organization',
    publisher: 'Figma Inc.',
    publisherInitials: 'FG',
    category: 'Design',
    totalSeats: 45,
    assignedSeats: 42,
    utilizationRate: 93.3,
    annualCost: 24300,
    renewalDate: '2026-12-01',
    status: 'Active',
    measurementArchetype: 'Allocation',
  },
];

export const LicenseManagementPage: React.FC = () => {
  const [licenses] = useState<LicenseItem[]>(mockLicenses);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
          License Management
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Centralized inventory of enterprise software licenses, assignments, and utilization.
        </Typography>
      </Box>

      {/* Top Balanced Visuals / KPIs */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <KpiCard
            title="Total Licenses"
            value="1,284"
            tooltipText="Total count of purchased software entitlements."
            chipLabel="+4.5% MoM"
            chipColor="primary"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard
            title="Seat Utilization"
            value="88.9%"
            tooltipText="Ratio of active assigned seats to total purchased capacity."
            chipLabel="1,142 / 1,284 Active"
            chipColor="success"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard
            title="Total Spend"
            value={formatCurrency(482500)}
            tooltipText="Annualized software license spend across all providers."
            chipLabel="Under Ceiling"
            chipColor="default"
          />
        </Grid>
      </Grid>

      {/* Data Section */}
      <LicenseListSection licenses={licenses} />
    </Box>
  );
};

export default LicenseManagementPage;
