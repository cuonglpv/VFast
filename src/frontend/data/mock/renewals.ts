import type { RenewalObligation } from '@/types/budget';

export const mockRenewals: RenewalObligation[] = [
  {
    id: 'ren-001',
    softwareName: 'Slack Enterprise Grid',
    publisher: 'Salesforce, Inc.',
    category: 'Communication',
    renewalDate: '2026-12-15',
    renewalCost: 68400,
    activeUtilizationRate: 64.2,
    status: 'Critical',
  },
  {
    id: 'ren-002',
    softwareName: 'Datadog Pro Infrastructure',
    publisher: 'Datadog, Inc.',
    category: 'Security',
    renewalDate: '2026-12-05',
    renewalCost: 54000,
    activeUtilizationRate: 72.0,
    status: 'Warning',
  },
  {
    id: 'ren-003',
    softwareName: 'Figma Enterprise',
    publisher: 'Figma, Inc.',
    category: 'Design',
    renewalDate: '2026-12-10',
    renewalCost: 38400,
    activeUtilizationRate: 97.5,
    status: 'Healthy',
  },
  {
    id: 'ren-004',
    softwareName: 'Zoom Business Pro',
    publisher: 'Zoom Video Comms',
    category: 'Communication',
    renewalDate: '2026-12-20',
    renewalCost: 24200,
    activeUtilizationRate: 81.0,
    status: 'Healthy',
  },
];
