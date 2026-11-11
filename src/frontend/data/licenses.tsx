import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { LicenseRecord } from '@/types/license';
import { licenseRepository } from '@/data/repositories';

export type { LicenseRecord } from '@/types/license';

const LicenseContext = createContext<{
  records: LicenseRecord[];
  updateRecord: (record: LicenseRecord) => Promise<void>;
  importRecords: (records: LicenseRecord[]) => Promise<void>;
} | null>(null);

export function LicenseProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<LicenseRecord[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    licenseRepository.list().then(next => { if (active) setRecords(next); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);
  async function updateRecord(record: LicenseRecord) {
    const updated = await licenseRepository.update(record);
    setRecords(current => current?.map(item => item.id === updated.id ? updated : item) ?? null);
  }
  async function importRecords(recordsToImport: LicenseRecord[]) {
    const next = await licenseRepository.importMany(recordsToImport);
    setRecords(next);
  }
  if (error) return <div role="alert">Unable to load licenses. Please reload the page.</div>;
  if (records === null) return <div role="status">Loading licenses...</div>;
  return <LicenseContext.Provider value={{ records, updateRecord, importRecords }}>{children}</LicenseContext.Provider>;
}

export function useLicenses() {
  const context = useContext(LicenseContext);
  if (!context) throw new Error('LicenseProvider is required');
  return context;
}
