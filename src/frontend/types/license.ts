export type LicenseStatus = 'Active' | 'Inactive' | 'At Risk' | 'Over-allocated';

export type MeasurementArchetype = 'Allocation' | 'Concurrent' | 'Metered' | 'Capacity';

export interface LicenseItem {
  id: string;
  softwareName: string;
  publisher: string;
  publisherInitials: string;
  category: string;
  totalSeats: number;
  assignedSeats: number;
  utilizationRate: number;
  annualCost: number;
  renewalDate: string;
  status: LicenseStatus;
  measurementArchetype: MeasurementArchetype;
}

export interface LicenseFilters {
  searchQuery: string;
  category: string;
  status: string;
}
