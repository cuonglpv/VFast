import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { useLicenses, type LicenseRecord } from '@/data/licenses';
import type { GrantedAccount } from '@/types/license';
import { formatCurrency } from '@/utils';
import { licenseRepository } from '@/data/repositories';
import { useRepositoryData } from '@/hooks/useRepositoryData';
import { useDebounce } from '@/hooks/useDebounce';
import { paginateRows } from '@/utils/pagination';

export function useLicenseDetail() {
  const { licenseId } = useParams();
  const { records, updateRecord } = useLicenses();
  const license = records.find(record => record.id === licenseId);
  const [draft, setDraft] = useState<LicenseRecord | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [savedMessage, setSavedMessage] = useState('Changes saved.');
  const [policy, setPolicy] = useState('');

  // Metadata & Policies states
  const [metadataCollapsed, setMetadataCollapsed] = useState(false);
  const [metadataDraft, setMetadataDraft] = useState<{
    vendor: string;
    description: string;
    category: string;
    subcategory: string;
  } | null>(null);

  // Granted Accounts states
  const [accountList, setAccountList] = useState<GrantedAccount[]>([]);
  const [editingAccount, setEditingAccount] = useState<{
    index: number;
    account: GrantedAccount;
  } | null>(null);

  const [accountSearch, setAccountSearch] = useState('');
  const [accountStatus, setAccountStatus] = useState('');
  const [accountPage, setAccountPage] = useState(0);
  const [accountPageSize, setAccountPageSize] = useState(10);
  const loadAccounts = useCallback(() => licenseRepository.listGrantedAccounts(licenseId ?? ''), [licenseId]);
  const { data: accounts, error: accountsError } = useRepositoryData(loadAccounts);

  useEffect(() => {
    if (accounts) {
      setAccountList(accounts);
    }
  }, [accounts]);

  useEffect(() => {
    setAccountSearch('');
    setAccountStatus('');
    setAccountPage(0);
    setAccountPageSize(10);
  }, [licenseId]);

  const query = useDebounce(accountSearch).trim().toLowerCase();
  useEffect(() => { setAccountPage(0); }, [query]);
  const filteredAccounts = accountList.filter(account => (!accountStatus || account.status === accountStatus)
    && [account.user, account.email ?? ''].some(value => value.toLowerCase().includes(query)));
  const { currentPage: currentAccountPage, visible: visibleAccounts } = paginateRows(filteredAccounts, accountPage, accountPageSize);

  const metrics = license ? [
    { label: 'Monthly Cost', value: formatCurrency(license.monthlyCost) },
    { label: 'Subscriptions', value: license.contracts + (license.contracts === 1 ? ' Contract' : ' Contracts') },
    { label: 'License Tiers', value: license.tiers },
    { label: 'Assigned Users', value: `${license.totalUsers.toLocaleString('en-US')} / ${license.entitlementSeats.toLocaleString('en-US')}`, note: `${license.activeUsers.toLocaleString('en-US')} active` },
    { label: 'Available Seats', value: Math.max(0, license.entitlementSeats - license.totalUsers).toLocaleString('en-US') + ' Seats', note: license.totalUsers > license.entitlementSeats ? `${license.totalUsers - license.entitlementSeats} over allocated` : undefined },
    { label: 'Renewal Date', value: license.expiryDate },
  ] : [];

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    try {
      await updateRecord({ ...draft, description: draft.description.trim(), category: draft.category.trim(), tiers: draft.tiers.trim() });
      setDraft(null);
      setSavedMessage('License overview updated.');
      setSaved(true);
    } catch {
      setError('Unable to save changes. Please try again.');
    }
  }

  async function submitMetadata(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!metadataDraft || !license) return;
    try {
      await updateRecord({
        ...license,
        vendor: metadataDraft.vendor.trim(),
        description: metadataDraft.description.trim(),
        category: metadataDraft.category.trim(),
        subcategory: metadataDraft.subcategory.trim(),
      });
      setMetadataDraft(null);
      setSavedMessage('Metadata & policies updated.');
      setSaved(true);
    } catch {
      setError('Unable to save metadata changes. Please try again.');
    }
  }

  function submitAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingAccount) return;
    const { index, account } = editingAccount;
    const next = [...accountList];
    if (index >= 0) {
      next[index] = account;
      setSavedMessage('Account grant updated.');
    } else {
      next.unshift(account);
      setSavedMessage('Account grant added.');
    }
    setAccountList(next);
    setEditingAccount(null);
    setSaved(true);
  }

  return { license, draft, setDraft, error, setError, saved, setSaved, savedMessage, setSavedMessage, policy, setPolicy, metadataCollapsed, setMetadataCollapsed, metadataDraft, setMetadataDraft, accountList, setAccountList, editingAccount, setEditingAccount, accountSearch, setAccountSearch, accountStatus, setAccountStatus, setAccountPage, accountPageSize, setAccountPageSize, accounts, accountsError, filteredAccounts, currentAccountPage, visibleAccounts, metrics, submit, submitMetadata, submitAccount };
}
