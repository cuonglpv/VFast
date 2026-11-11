import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useLicenses, type LicenseRecord } from '@/data/licenses';
import type { GrantedAccount } from '@/types/license';
import { formatCurrency } from '@/utils';
import { PATHS } from '@/routes/paths';
import { licenseRepository } from '@/data/repositories';
import { useRepositoryData } from '@/data/useRepositoryData';
import { StatusBadge } from '@/components/StatusBadge';
import { FilterSelect } from '@/components/FilterSelect';
import { InfoTooltip } from '@/components/InfoTooltip';
import PortalIcon from '@/components/PortalIcon';

function BackToLicenses() {
  return (
    <Link className="detail-back-link" to={PATHS.LICENSES}>
      <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M16 10H4m5-5-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Back to License Management
    </Link>
  );
}

export default function LicenseDetailPage() {
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

  const query = accountSearch.trim().toLowerCase();
  const filteredAccounts = accountList.filter(account => (!accountStatus || account.status === accountStatus)
    && [account.user, account.email ?? ''].some(value => value.toLowerCase().includes(query)));
  const lastAccountPage = Math.max(0, Math.ceil(filteredAccounts.length / accountPageSize) - 1);
  const currentAccountPage = Math.min(accountPage, lastAccountPage);
  const visibleAccounts = filteredAccounts.slice(currentAccountPage * accountPageSize, (currentAccountPage + 1) * accountPageSize);

  if (!license) {
    return (
      <div className="license-detail-page">
        <BackToLicenses />
        <div className="page-heading">
          <h1>License not found</h1>
          <p>This license is not available.</p>
        </div>
      </div>
    );
  }

  const metrics = [
    { label: 'Monthly Cost', value: formatCurrency(license.monthlyCost) },
    { label: 'Subscriptions', value: license.contracts + (license.contracts === 1 ? ' Contract' : ' Contracts') },
    { label: 'License Tiers', value: license.tiers },
    { label: 'Assigned Users', value: `${license.totalUsers.toLocaleString('en-US')} / ${license.entitlementSeats.toLocaleString('en-US')}`, note: `${license.activeUsers.toLocaleString('en-US')} active` },
    { label: 'Available Seats', value: Math.max(0, license.entitlementSeats - license.totalUsers).toLocaleString('en-US') + ' Seats', note: license.totalUsers > license.entitlementSeats ? `${license.totalUsers - license.entitlementSeats} over allocated` : undefined },
    { label: 'Renewal Date', value: license.expiryDate },
  ];

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

  return (
    <div className="license-detail-page">
      <BackToLicenses />
      <div className="page-heading detail-page-heading">
        <div>
          <h1 className="inline-flex items-center gap-2">
            <span>{license.softwareName}{license.id === 'lic-m365-01' ? ' Enterprise' : ''}</span>
            <InfoTooltip title="License details, entitlement, usage, cost and policy information" />
          </h1>
        </div>
        <StatusBadge domain="compliance" status={license.complianceStatus} />
      </div>

      {saved && <p className="form-message" role="status">{savedMessage}</p>}

      <article className="portal-card license-detail-card">
        {/* SECTION 1: LICENSE OVERVIEW */}
        <div className="detail-card-header">
          <div>
            <p>{license.vendor}</p>
            <h2>License Overview</h2>
          </div>
          <button
            className="portal-button edit-button"
            type="button"
            onClick={() => { setDraft({ ...license }); setError(''); setSaved(false); }}
          >
            Edit
          </button>
        </div>
        <div className="detail-metrics">
          {metrics.map(metric => (
            <div className="detail-metric" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value || '—'}</strong>
              {metric.note && <small>{metric.note}</small>}
            </div>
          ))}
        </div>

        {/* SECTION 2: METADATA & POLICIES (WITH DROPDOWN COLLAPSE & EDIT BUTTON) */}
        <section className="detail-metadata" aria-labelledby="metadata-title">
          <div className="detail-card-header metadata-header">
            <div className="flex items-center gap-2">
              <h2 id="metadata-title">Metadata &amp; Policies</h2>
              <button
                type="button"
                className="collapse-toggle-btn p-1 text-slate-500 hover:text-slate-800 transition-colors rounded-sm cursor-pointer inline-flex items-center"
                onClick={() => setMetadataCollapsed(prev => !prev)}
                aria-expanded={!metadataCollapsed}
                aria-label={metadataCollapsed ? "Expand metadata and policies" : "Collapse metadata and policies"}
                title={metadataCollapsed ? "Expand section" : "Collapse section"}
              >
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${metadataCollapsed ? '-rotate-90' : 'rotate-0'}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>
            <button
              className="portal-button edit-button"
              type="button"
              onClick={() => {
                setMetadataDraft({
                  vendor: license.vendor,
                  description: license.description,
                  category: license.category,
                  subcategory: license.subcategory || '',
                });
                setError('');
                setSaved(false);
              }}
            >
              Edit
            </button>
          </div>
          {!metadataCollapsed && (
            <dl>
              <div><dt>Vendor</dt><dd>{license.vendor}</dd></div>
              <div><dt>Description</dt><dd>{license.description || '—'}</dd></div>
              <div><dt>Category</dt><dd>{license.category}</dd></div>
              <div><dt>Subcategory</dt><dd>{license.subcategory || '—'}</dd></div>
              <div>
                <dt>Policy Links</dt>
                <dd className="policy-links">
                  {['License Policy', 'Vendor Terms', 'Security'].map((name, index) => (
                    <span key={name}>
                      {index > 0 && <span aria-hidden="true">•</span>}
                      <button type="button" onClick={() => setPolicy(name)}>{name}</button>
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          )}
        </section>

        {/* SECTION 3: GRANTED ACCOUNTS (WITH EDIT BUTTON) */}
        <section className="granted-accounts" aria-labelledby="accounts-title">
          <div className="detail-card-header accounts-header mb-4">
            <h2 id="accounts-title">Granted Accounts{accountList.length ? ` (${accountList.length})` : ''}</h2>
            <div className="flex items-center gap-2">
              <button
                className="portal-button edit-button"
                type="button"
                onClick={() => {
                  setEditingAccount({
                    index: -1,
                    account: {
                      user: '',
                      email: '',
                      tenant: 'HQ Vietnam',
                      tier: license.tiers.split(',')[0]?.trim() || 'Standard',
                      allocated: new Date().toISOString().slice(0, 10),
                      status: 'Actively used',
                    },
                  });
                  setError('');
                  setSaved(false);
                }}
              >
                + Add Account
              </button>
              <button
                className="portal-button edit-button"
                type="button"
                onClick={() => {
                  if (accountList.length > 0) {
                    setEditingAccount({
                      index: 0,
                      account: { ...accountList[0] },
                    });
                  } else {
                    setEditingAccount({
                      index: -1,
                      account: {
                        user: '',
                        email: '',
                        tenant: 'HQ Vietnam',
                        tier: license.tiers.split(',')[0]?.trim() || 'Standard',
                        allocated: new Date().toISOString().slice(0, 10),
                        status: 'Actively used',
                      },
                    });
                  }
                  setError('');
                  setSaved(false);
                }}
              >
                Edit
              </button>
            </div>
          </div>
          {accountList.length > 0 && (
            <div className="inventory-toolbar accounts-toolbar">
              <label className="inventory-search">
                <PortalIcon name="search" />
                <input
                  aria-label="Search granted accounts by name or email"
                  placeholder="Search account name or email"
                  value={accountSearch}
                  onChange={event => { setAccountSearch(event.target.value); setAccountPage(0); }}
                />
              </label>
              <FilterSelect
                label="Filter accounts by usage status"
                value={accountStatus}
                onChange={value => { setAccountStatus(value); setAccountPage(0); }}
                options={[{ value: '', label: 'All Statuses' }, ...[...new Set(accountList.map(account => account.status))].sort().map(value => ({ value, label: value }))]}
              />
            </div>
          )}
          <div className="accounts-table-wrap">
            <table className="portal-table accounts-table" aria-label="Granted accounts">
              <thead>
                <tr>
                  <th scope="col">User</th>
                  <th scope="col">Tenant</th>
                  <th scope="col">Tier</th>
                  <th scope="col" className="table-date">Allocated</th>
                  <th scope="col" className="table-status">Usage Status</th>
                  <th scope="col" className="table-status">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleAccounts.map((account, visibleIdx) => {
                  const actualIndex = accountList.findIndex(a => a.user === account.user && a.tier === account.tier && a.allocated === account.allocated);
                  return (
                    <tr key={`${account.user}-${account.tenant}-${account.tier}-${account.allocated}-${visibleIdx}`}>
                      <td>
                        <span className="table-name">{account.user}</span>
                        {account.email && <div className="table-secondary">{account.email}</div>}
                      </td>
                      <td>{account.tenant}</td>
                      <td>{account.tier}</td>
                      <td className="table-date">{account.allocated}</td>
                      <td className="table-status"><StatusBadge domain="usage" status={account.status} /></td>
                      <td className="table-status">
                        <button
                          type="button"
                          className="p-1 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title={`Edit ${account.user}`}
                          aria-label={`Edit ${account.user}`}
                          onClick={() => {
                            setEditingAccount({
                              index: actualIndex >= 0 ? actualIndex : 0,
                              account: { ...account },
                            });
                            setError('');
                            setSaved(false);
                          }}
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {!accounts && !accountsError && <tr><td colSpan={6} className="empty-state">Loading accounts...</td></tr>}
                {accountsError && <tr><td colSpan={6} className="empty-state">Unable to load accounts.</td></tr>}
                {accounts && !accountList.length && <tr><td colSpan={6} className="empty-state">No account roster is available for this license.</td></tr>}
                {accounts && accountList.length > 0 && !visibleAccounts.length && <tr><td colSpan={6} className="empty-state">No accounts match your filters.</td></tr>}
              </tbody>
            </table>
          </div>
          {accountList.length > 0 && (
            <div className="inventory-pagination">
              <label>Rows per page: <select aria-label="Account rows per page" value={accountPageSize} onChange={event => { setAccountPageSize(Number(event.target.value)); setAccountPage(0); }}><option>10</option><option>25</option><option>50</option></select></label>
              <span aria-hidden="true">·</span><span>{filteredAccounts.length ? currentAccountPage * accountPageSize + 1 : 0}–{Math.min((currentAccountPage + 1) * accountPageSize, filteredAccounts.length)} of {filteredAccounts.length}</span>
              {lastAccountPage > 0 && (
                <div className="pagination-controls">
                  <button type="button" aria-label="Previous account page" disabled={currentAccountPage === 0} onClick={() => setAccountPage(currentAccountPage - 1)}>‹</button>
                  <button type="button" aria-label="Next account page" disabled={currentAccountPage === lastAccountPage} onClick={() => setAccountPage(currentAccountPage + 1)}>›</button>
                </div>
              )}
            </div>
          )}
        </section>
      </article>

      {/* DIALOG 1: EDIT LICENSE OVERVIEW */}
      <Dialog open={!!draft} onClose={() => setDraft(null)} fullWidth maxWidth="sm" aria-labelledby="edit-license-title">
        <form onSubmit={submit}>
          <DialogTitle id="edit-license-title">Edit License Overview</DialogTitle>
          <DialogContent>
            {draft && (
              <div className="edit-license-form pt-2">
                <label>Description<input value={draft.description} maxLength={200} onChange={event => setDraft({ ...draft, description: event.target.value })} /></label>
                <label>Category<input required value={draft.category} maxLength={60} onChange={event => setDraft({ ...draft, category: event.target.value })} pattern=".*\S.*" /></label>
                <label>Subcategory<input value={draft.subcategory} maxLength={100} onChange={event => setDraft({ ...draft, subcategory: event.target.value })} /></label>
                <label>Monthly Cost ($)<input required type="number" min="0" step="0.01" value={draft.monthlyCost} onChange={event => setDraft({ ...draft, monthlyCost: Number(event.target.value) })} /></label>
                <label>Subscriptions<input required type="number" min="1" step="1" value={draft.contracts} onChange={event => setDraft({ ...draft, contracts: Number(event.target.value) })} /></label>
                <label>License Tiers<input required value={draft.tiers} maxLength={60} onChange={event => setDraft({ ...draft, tiers: event.target.value })} pattern=".*\S.*" /></label>
                <label>Renewal Date<input required type="date" value={draft.expiryDate} onChange={event => setDraft({ ...draft, expiryDate: event.target.value })} /></label>
              </div>
            )}
            {error && <p role="alert" className="text-red-600 mt-2 text-sm">{error}</p>}
          </DialogContent>
          <DialogActions>
            <button type="button" className="portal-button" onClick={() => setDraft(null)}>Cancel</button>
            <button type="submit" className="portal-button primary-button">Save changes</button>
          </DialogActions>
        </form>
      </Dialog>

      {/* DIALOG 2: EDIT METADATA & POLICIES */}
      <Dialog open={!!metadataDraft} onClose={() => setMetadataDraft(null)} fullWidth maxWidth="sm" aria-labelledby="edit-metadata-title">
        <form onSubmit={submitMetadata}>
          <DialogTitle id="edit-metadata-title">Edit Metadata &amp; Policies</DialogTitle>
          <DialogContent>
            {metadataDraft && (
              <div className="edit-license-form pt-2">
                <label>
                  Vendor
                  <input
                    required
                    value={metadataDraft.vendor}
                    maxLength={100}
                    onChange={event => setMetadataDraft({ ...metadataDraft, vendor: event.target.value })}
                  />
                </label>
                <label>
                  Category
                  <input
                    required
                    value={metadataDraft.category}
                    maxLength={60}
                    onChange={event => setMetadataDraft({ ...metadataDraft, category: event.target.value })}
                  />
                </label>
                <label className="col-span-full">
                  Subcategory
                  <input
                    value={metadataDraft.subcategory}
                    maxLength={100}
                    onChange={event => setMetadataDraft({ ...metadataDraft, subcategory: event.target.value })}
                  />
                </label>
                <label className="col-span-full">
                  Description
                  <textarea
                    className="w-full border border-[#dce5f0] rounded-[5px] p-[9px_10px] font-inherit text-[#172238] min-h-[80px]"
                    value={metadataDraft.description}
                    maxLength={300}
                    onChange={event => setMetadataDraft({ ...metadataDraft, description: event.target.value })}
                  />
                </label>
              </div>
            )}
            {error && <p role="alert" className="text-red-600 mt-2 text-sm">{error}</p>}
          </DialogContent>
          <DialogActions>
            <button type="button" className="portal-button" onClick={() => setMetadataDraft(null)}>Cancel</button>
            <button type="submit" className="portal-button primary-button">Save changes</button>
          </DialogActions>
        </form>
      </Dialog>

      {/* DIALOG 3: EDIT GRANTED ACCOUNT */}
      <Dialog open={!!editingAccount} onClose={() => setEditingAccount(null)} fullWidth maxWidth="sm" aria-labelledby="edit-account-title">
        <form onSubmit={submitAccount}>
          <DialogTitle id="edit-account-title">
            {editingAccount && editingAccount.index >= 0 ? 'Edit Granted Account' : 'Add Granted Account'}
          </DialogTitle>
          <DialogContent>
            {editingAccount && (
              <div className="edit-license-form pt-2">
                <label>
                  User Name
                  <input
                    required
                    value={editingAccount.account.user}
                    maxLength={100}
                    onChange={event => setEditingAccount({
                      ...editingAccount,
                      account: { ...editingAccount.account, user: event.target.value },
                    })}
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={editingAccount.account.email || ''}
                    maxLength={100}
                    onChange={event => setEditingAccount({
                      ...editingAccount,
                      account: { ...editingAccount.account, email: event.target.value },
                    })}
                  />
                </label>
                <label>
                  Tenant
                  <input
                    required
                    value={editingAccount.account.tenant}
                    maxLength={100}
                    onChange={event => setEditingAccount({
                      ...editingAccount,
                      account: { ...editingAccount.account, tenant: event.target.value },
                    })}
                  />
                </label>
                <label>
                  License Tier
                  <input
                    required
                    value={editingAccount.account.tier}
                    maxLength={60}
                    onChange={event => setEditingAccount({
                      ...editingAccount,
                      account: { ...editingAccount.account, tier: event.target.value },
                    })}
                  />
                </label>
                <label>
                  Allocated Date
                  <input
                    required
                    type="date"
                    value={editingAccount.account.allocated}
                    onChange={event => setEditingAccount({
                      ...editingAccount,
                      account: { ...editingAccount.account, allocated: event.target.value },
                    })}
                  />
                </label>
                <label>
                  Usage Status
                  <select
                    className="w-full border border-[#dce5f0] rounded-[5px] p-[9px_10px] font-inherit text-[#172238] bg-white"
                    value={editingAccount.account.status}
                    onChange={event => setEditingAccount({
                      ...editingAccount,
                      account: { ...editingAccount.account, status: event.target.value },
                    })}
                  >
                    <option value="Actively used">Actively used</option>
                    <option value="Inactive">Inactive</option>
                    <option value="No activity">No activity</option>
                    <option value="Not monitored">Not monitored</option>
                  </select>
                </label>
              </div>
            )}
            {error && <p role="alert" className="text-red-600 mt-2 text-sm">{error}</p>}
          </DialogContent>
          <DialogActions>
            {editingAccount && editingAccount.index >= 0 && (
              <button
                type="button"
                className="portal-button text-red-600 mr-auto hover:bg-red-50"
                onClick={() => {
                  const next = accountList.filter((_, i) => i !== editingAccount.index);
                  setAccountList(next);
                  setEditingAccount(null);
                  setSavedMessage('Account grant deleted.');
                  setSaved(true);
                }}
              >
                Delete
              </button>
            )}
            <button type="button" className="portal-button" onClick={() => setEditingAccount(null)}>Cancel</button>
            <button type="submit" className="portal-button primary-button">Save</button>
          </DialogActions>
        </form>
      </Dialog>

      {/* DIALOG 4: POLICY PREVIEW */}
      <Dialog open={!!policy} onClose={() => setPolicy('')} fullWidth maxWidth="xs" aria-labelledby="policy-title">
        <DialogTitle id="policy-title">{policy}</DialogTitle>
        <DialogContent>
          <p>No {policy.toLowerCase()} document has been attached to {license.softwareName}.</p>
        </DialogContent>
        <DialogActions>
          <button type="button" className="portal-button" onClick={() => setPolicy('')}>Close</button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
