import type { GrantedAccount, LicenseRecord } from '@/types/license';
import { mockGrantedAccounts, mockLicenseRecords } from '@/data/mock/licenses';

/** Screens use this contract; an HTTP implementation can replace the browser one. */
export interface LicenseRepository {
  list(): Promise<LicenseRecord[]>;
  update(record: LicenseRecord): Promise<LicenseRecord>;
  importMany(records: LicenseRecord[]): Promise<LicenseRecord[]>;
  listGrantedAccounts(licenseId: string): Promise<GrantedAccount[]>;
}

const STORAGE_KEY = 'vfast-license-records-v1';

function isLicenseRecord(value: unknown): value is LicenseRecord {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return ['id', 'softwareName', 'publisher', 'vendor', 'category', 'description', 'subcategory', 'licenseType', 'expiryDate', 'tiers'].every(key => typeof record[key] === 'string')
    && ['purchasedAmount', 'monthlyCost', 'entitlementSeats', 'activeUsers', 'totalUsers', 'contracts'].every(key => typeof record[key] === 'number' && Number.isFinite(record[key]) && (record[key] as number) >= 0)
    && ['Compliant', 'At Risk', 'Over-allocated'].includes(String(record.complianceStatus));
}

export const browserLicenseRepository: LicenseRepository = {
  async list() {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (Array.isArray(saved) && saved.every(isLicenseRecord)) return saved;
    } catch { /* Storage may be unavailable. */ }
    return mockLicenseRecords;
  },
  async update(record) {
    const current = await browserLicenseRepository.list();
    if (!current.some(item => item.id === record.id)) throw new Error('License not found.');
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current.map(item => item.id === record.id ? record : item)));
    return record;
  },
  async importMany(records) {
    const next = [...await browserLicenseRepository.list()];
    records.forEach(record => {
      const index = next.findIndex(existing => existing.softwareName.toLowerCase() === record.softwareName.toLowerCase());
      if (index < 0) next.push(record);
      else next[index] = { ...record, id: next[index].id };
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  },
  async listGrantedAccounts(licenseId) {
    return licenseId === 'lic-m365-01' ? mockGrantedAccounts : [];
  },
};
