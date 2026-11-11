import { createContext, useContext, useState, type ReactNode } from 'react';

export interface LicenseRecord {
  id: string;
  softwareName: string;
  publisher: string;
  vendor: string;
  category: string;
  description: string;
  subcategory: string;
  licenseType: string;
  complianceStatus: 'Compliant' | 'At Risk' | 'Over-allocated';
  purchasedAmount: number;
  monthlyCost: number;
  entitlementSeats: number;
  activeUsers: number;
  totalUsers: number;
  expiryDate: string;
  tiers: string;
  contracts: number;
}

export const initialLicenses: LicenseRecord[] = [
  { id: 'lic-m365-01', softwareName: 'Microsoft 365', publisher: 'Microsoft', vendor: 'Microsoft Corporation', category: 'Productivity', description: 'Enterprise productivity suite', subcategory: 'Office & Collaboration', licenseType: 'Subscription', complianceStatus: 'Compliant', purchasedAmount: 48000, monthlyCost: 15000, entitlementSeats: 500, activeUsers: 470, totalUsers: 470, expiryDate: '2027-05-31', tiers: 'E3, E5', contracts: 3 },
  { id: 'lic-slk-02', softwareName: 'Slack Grid', publisher: 'Salesforce', vendor: 'Salesforce', category: 'Communication', description: 'Enterprise team messaging', subcategory: 'Team Collaboration', licenseType: 'Subscription', complianceStatus: 'Compliant', purchasedAmount: 21600, monthlyCost: 1800, entitlementSeats: 450, activeUsers: 410, totalUsers: 430, expiryDate: '2027-03-15', tiers: 'Enterprise Grid', contracts: 1 },
  { id: 'lic-gh-03', softwareName: 'GitHub Enterprise', publisher: 'GitHub', vendor: 'GitHub', category: 'DevOps', description: 'Enterprise software development platform', subcategory: 'Source Control', licenseType: 'Subscription', complianceStatus: 'At Risk', purchasedAmount: 36000, monthlyCost: 3000, entitlementSeats: 300, activeUsers: 264, totalUsers: 300, expiryDate: '2026-12-22', tiers: 'Enterprise', contracts: 1 },
  { id: 'lic-jira-04', softwareName: 'Jira Software', publisher: 'Atlassian', vendor: 'Atlassian', category: 'DevOps', description: 'Project and issue tracking', subcategory: 'Project Management', licenseType: 'Subscription', complianceStatus: 'Compliant', purchasedAmount: 18000, monthlyCost: 1500, entitlementSeats: 300, activeUsers: 255, totalUsers: 280, expiryDate: '2027-01-10', tiers: 'Premium', contracts: 1 },
  { id: 'lic-zoom-05', softwareName: 'Zoom Business', publisher: 'Zoom', vendor: 'Zoom', category: 'Communication', description: 'Enterprise video meetings', subcategory: 'Video Conferencing', licenseType: 'Subscription', complianceStatus: 'Compliant', purchasedAmount: 12000, monthlyCost: 1000, entitlementSeats: 250, activeUsers: 202, totalUsers: 230, expiryDate: '2026-12-31', tiers: 'Business', contracts: 1 },
];

const STORAGE_KEY = 'vfast-license-records-v1';
function loadRecords(): LicenseRecord[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (Array.isArray(saved) && saved.length && saved.every(isLicenseRecord)) return saved;
  } catch { /* Storage may be unavailable. */ }
  return initialLicenses;
}

function isLicenseRecord(value: unknown): value is LicenseRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return ['id', 'softwareName', 'publisher', 'vendor', 'category', 'description', 'subcategory', 'licenseType', 'expiryDate', 'tiers'].every(key => typeof record[key] === 'string')
    && ['purchasedAmount', 'monthlyCost', 'entitlementSeats', 'activeUsers', 'totalUsers', 'contracts'].every(key => typeof record[key] === 'number' && Number.isFinite(record[key]) && (record[key] as number) >= 0)
    && ['Compliant', 'At Risk', 'Over-allocated'].includes(String(record.complianceStatus));
}

const LicenseContext = createContext<{ records: LicenseRecord[]; saveRecords: (records: LicenseRecord[]) => void } | null>(null);
export function LicenseProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState(loadRecords);
  function saveRecords(next: LicenseRecord[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setRecords(next);
  }
  return <LicenseContext.Provider value={{ records, saveRecords }}>{children}</LicenseContext.Provider>;
}
export function useLicenses() {
  const context = useContext(LicenseContext);
  if (!context) throw new Error('LicenseProvider is required');
  return context;
}
