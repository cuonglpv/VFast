import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useLicenses, type LicenseRecord } from '@/data/licenses';
import { formatCurrency } from '@/utils';
import { PATHS } from '@/routes/paths';
import { licenseRepository } from '@/data/repositories';
import { useRepositoryData } from '@/data/useRepositoryData';
import { StatusBadge } from '@/components/StatusBadge';
import { FilterSelect } from '@/components/FilterSelect';
import PortalIcon from '@/components/PortalIcon';

function BackToLicenses() {
  return <Link className="detail-back-link" to={PATHS.LICENSES}>
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M16 10H4m5-5-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    Back to License Management
  </Link>;
}

export default function LicenseDetailPage() {
  const { licenseId } = useParams();
  const { records, updateRecord } = useLicenses();
  const license = records.find(record => record.id === licenseId);
  const [draft, setDraft] = useState<LicenseRecord | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [policy, setPolicy] = useState('');
  const [accountSearch, setAccountSearch] = useState('');
  const [accountStatus, setAccountStatus] = useState('');
  const [accountPage, setAccountPage] = useState(0);
  const [accountPageSize, setAccountPageSize] = useState(10);
  const loadAccounts = useCallback(() => licenseRepository.listGrantedAccounts(licenseId ?? ''), [licenseId]);
  const { data: accounts, error: accountsError } = useRepositoryData(loadAccounts);
  useEffect(() => {
    setAccountSearch(''); setAccountStatus(''); setAccountPage(0); setAccountPageSize(10);
  }, [licenseId]);
  const query = accountSearch.trim().toLowerCase();
  const filteredAccounts = (accounts ?? []).filter(account => (!accountStatus || account.status === accountStatus)
    && [account.user, account.email ?? ''].some(value => value.toLowerCase().includes(query)));
  const lastAccountPage = Math.max(0, Math.ceil(filteredAccounts.length / accountPageSize) - 1);
  const currentAccountPage = Math.min(accountPage, lastAccountPage);
  const visibleAccounts = filteredAccounts.slice(currentAccountPage * accountPageSize, (currentAccountPage + 1) * accountPageSize);
  if (!license) return <div className="license-detail-page"><BackToLicenses /><div className="page-heading"><h1>License not found</h1><p>This license is not available.</p></div></div>;

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
      setDraft(null); setSaved(true);
    } catch { setError('Unable to save changes. Please try again.'); }
  }

  return <div className="license-detail-page">
    <BackToLicenses />
    <div className="page-heading detail-page-heading"><div><h1>{license.softwareName}{license.id === 'lic-m365-01' ? ' Enterprise' : ''}</h1><p>License details, entitlement, usage, cost and policy information</p></div><StatusBadge domain="compliance" status={license.complianceStatus} /></div>
    {saved && <p className="form-message" role="status">Changes saved.</p>}
    <article className="portal-card license-detail-card">
      <div className="detail-card-header"><div><p>{license.vendor}</p><h2>License Overview</h2></div><button className="portal-button edit-button" onClick={() => { setDraft({ ...license }); setError(''); setSaved(false); }}>Edit</button></div>
      <div className="detail-metrics">{metrics.map(metric => <div className="detail-metric" key={metric.label}><span>{metric.label}</span><strong>{metric.value || '—'}</strong>{metric.note && <small>{metric.note}</small>}</div>)}</div>
      <section className="detail-metadata" aria-labelledby="metadata-title"><h2 id="metadata-title">Metadata &amp; Policies</h2><dl>
        <div><dt>Vendor</dt><dd>{license.vendor}</dd></div><div><dt>Description</dt><dd>{license.description || '—'}</dd></div><div><dt>Category</dt><dd>{license.category}</dd></div><div><dt>Subcategory</dt><dd>{license.subcategory || '—'}</dd></div><div><dt>Policy Links</dt><dd className="policy-links">{['License Policy', 'Vendor Terms', 'Security'].map((name, index) => <span key={name}>{index > 0 && <span aria-hidden="true">•</span>}<button onClick={() => setPolicy(name)}>{name}</button></span>)}</dd></div>
      </dl></section>
      <section className="granted-accounts" aria-labelledby="accounts-title">
        <h2 id="accounts-title">Granted Accounts{accounts !== null ? ` (${accounts.length})` : ''}</h2>
        {accounts !== null && accounts.length > 0 && <div className="inventory-toolbar accounts-toolbar">
          <label className="inventory-search"><PortalIcon name="search" /><input aria-label="Search granted accounts by name or email" placeholder="Search account name or email" value={accountSearch} onChange={event => { setAccountSearch(event.target.value); setAccountPage(0); }} /></label>
          <FilterSelect label="Filter accounts by usage status" value={accountStatus} onChange={value => { setAccountStatus(value); setAccountPage(0); }} options={[{ value: '', label: 'All Statuses' }, ...[...new Set(accounts.map(account => account.status))].sort().map(value => ({ value, label: value }))]} />
        </div>}
        <div className="accounts-table-wrap">
          <table className="portal-table accounts-table" aria-label="Granted accounts">
            <thead><tr>
              <th scope="col">User</th>
              <th scope="col">Tenant</th>
              <th scope="col">Tier</th>
              <th scope="col" className="table-date">Allocated</th>
              <th scope="col" className="table-status">Usage Status</th>
            </tr></thead>
            <tbody>
              {visibleAccounts.map(account => <tr key={`${account.user}-${account.tenant}-${account.tier}-${account.allocated}`}>
                <td><span className="table-name">{account.user}</span>{account.email && <div className="table-secondary">{account.email}</div>}</td>
                <td>{account.tenant}</td>
                <td>{account.tier}</td>
                <td className="table-date">{account.allocated}</td>
                <td className="table-status"><StatusBadge domain="usage" status={account.status} /></td>
              </tr>)}
              {!accounts && !accountsError && <tr><td colSpan={5} className="empty-state">Loading accounts...</td></tr>}
              {accountsError && <tr><td colSpan={5} className="empty-state">Unable to load accounts.</td></tr>}
              {accounts && !accounts.length && <tr><td colSpan={5} className="empty-state">No account roster is available for this license.</td></tr>}
              {accounts && accounts.length > 0 && !visibleAccounts.length && <tr><td colSpan={5} className="empty-state">No accounts match your filters.</td></tr>}
            </tbody>
          </table>
        </div>
        {accounts !== null && accounts.length > 0 && <div className="inventory-pagination">
          <label>Rows per page: <select aria-label="Account rows per page" value={accountPageSize} onChange={event => { setAccountPageSize(Number(event.target.value)); setAccountPage(0); }}><option>10</option><option>25</option><option>50</option></select></label>
          <span aria-hidden="true">·</span><span>{filteredAccounts.length ? currentAccountPage * accountPageSize + 1 : 0}–{Math.min((currentAccountPage + 1) * accountPageSize, filteredAccounts.length)} of {filteredAccounts.length}</span>
          {lastAccountPage > 0 && <div className="pagination-controls"><button type="button" aria-label="Previous account page" disabled={currentAccountPage === 0} onClick={() => setAccountPage(currentAccountPage - 1)}>‹</button><button type="button" aria-label="Next account page" disabled={currentAccountPage === lastAccountPage} onClick={() => setAccountPage(currentAccountPage + 1)}>›</button></div>}
        </div>}
      </section>
    </article>
    <Dialog open={!!draft} onClose={() => setDraft(null)} fullWidth maxWidth="sm" aria-labelledby="edit-license-title"><form onSubmit={submit}>
      <DialogTitle id="edit-license-title">Edit license</DialogTitle><DialogContent>{draft && <div className="edit-license-form">
        <label>Description<input value={draft.description} maxLength={200} onChange={event => setDraft({ ...draft, description: event.target.value })} /></label>
        <label>Category<input required value={draft.category} maxLength={60} onChange={event => setDraft({ ...draft, category: event.target.value })} pattern=".*\S.*" /></label>
        <label>Subcategory<input value={draft.subcategory} maxLength={100} onChange={event => setDraft({ ...draft, subcategory: event.target.value })} /></label>
        <label>Monthly Cost ($)<input required type="number" min="0" step="0.01" value={draft.monthlyCost} onChange={event => setDraft({ ...draft, monthlyCost: Number(event.target.value) })} /></label>
        <label>Subscriptions<input required type="number" min="1" step="1" value={draft.contracts} onChange={event => setDraft({ ...draft, contracts: Number(event.target.value) })} /></label>
        <label>License Tiers<input required value={draft.tiers} maxLength={60} onChange={event => setDraft({ ...draft, tiers: event.target.value })} pattern=".*\S.*" /></label>
        <label>Renewal Date<input required type="date" value={draft.expiryDate} onChange={event => setDraft({ ...draft, expiryDate: event.target.value })} /></label>
      </div>}{error && <p role="alert">{error}</p>}</DialogContent><DialogActions><button type="button" className="portal-button" onClick={() => setDraft(null)}>Cancel</button><button type="submit" className="portal-button primary-button">Save changes</button></DialogActions>
    </form></Dialog>
    <Dialog open={!!policy} onClose={() => setPolicy('')} fullWidth maxWidth="xs" aria-labelledby="policy-title"><DialogTitle id="policy-title">{policy}</DialogTitle><DialogContent><p>No {policy.toLowerCase()} document has been attached to {license.softwareName}.</p></DialogContent><DialogActions><button className="portal-button" onClick={() => setPolicy('')}>Close</button></DialogActions></Dialog>
  </div>;
}
