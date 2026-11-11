export type LicenseStatus =
  | "Active"
  | "Inactive"
  | "At Risk"
  | "Over-allocated";

export type MeasurementArchetype =
  | "Allocation"
  | "Concurrent"
  | "Metered"
  | "Capacity";

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

/** Current frontend record shape. The backend DTO is agreed separately. */
export interface LicenseRecord {
  id: string;
  softwareName: string;
  publisher: string;
  vendor: string;
  category: string;
  description: string;
  subcategory: string;
  licenseType: string;
  complianceStatus: "Compliant" | "Risk" | "Over";
  purchasedAmount: number;
  monthlyCost: number;
  entitlementSeats: number;
  activeUsers: number;
  totalUsers: number;
  expiryDate: string;
  tiers: string;
  contracts: number;
}

export interface GrantedAccount {
  user: string;
  email?: string;
  tenant: string;
  tier: string;
  allocated: string;
  status: string;
}
