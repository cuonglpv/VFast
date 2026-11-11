import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useLicenses, type LicenseRecord } from '@/data/licenses';
import { formatCurrency } from '@/utils';
import { PATHS } from '@/routes/paths';

const microsoftAccounts = [
  { user: 'Dat Nguyen', tenant: 'HQ Vietnam', tier: 'E5', allocated: '2026-01-12', status: 'Actively used' },
  { user: 'Chloe Mai', tenant: 'R&D Lab', tier: 'E3', allocated: '2026-02-04', status: 'Inactive' },
  { user: 'Anh Le', tenant: 'HQ Vietnam', tier: 'E3', allocated: '2026-02-18', status: 'Actively used' },
];

export default function LicenseDetailPage() {
  const { licenseId } = useParams();
  const { records, saveRecords } = useLicenses();
  const license = records.find(record => record.id === licenseId);
  const [draft, setDraft] = useState<LicenseRecord | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [policy, setPolicy] = useState('');
  if (!license) return <div className="page-heading"><h1>License not found</h1><p>This license is not available in this browser.</p><Link className="text-button" to={PATHS.LICENSES}>Back to License Management</Link></div>;

  const metrics = [
    ['Monthly Cost', formatCurrency(license.monthlyCost)], ['Subscriptions', license.contracts + (license.contracts === 1 ? ' Contract' : ' Contracts')], ['License Tiers', license.tiers],
    ['Assigned Users', license.activeUsers + ' Users'], ['Available Seats', Math.max(0, license.entitlementSeats - license.activeUsers) + ' Seats'], ['Renewal Date', license.expiryDate],
  ];
  const accounts = license.id === 'lic-m365-01' ? microsoftAccounts : [];
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft) return;
    try {
      saveRecords(records.map(record => record.id === draft.id ? { ...draft, description: draft.description.trim(), category: draft.category.trim(), tiers: draft.tiers.trim() } : record));
      setDraft(null); setSaved(true);
    } catch { setError('Unable to save. Please check that browser storage is available.'); }
  }

  return <div className="license-detail-page">
    <div className="page-heading"><h1>{license.softwareName}{license.id === 'lic-m365-01' ? ' Enterprise' : ''}</h1><p>License details, entitlement, usage, cost and policy information</p></div>
    {saved && <p className="form-message" role="status">Changes saved in this browser.</p>}
    <article className="portal-card license-detail-card">
      <div className="detail-card-header"><div><p>{license.vendor}</p><h2>License Overview</h2></div><button className="portal-button edit-button" onClick={() => { setDraft({ ...license }); setError(''); setSaved(false); }}>Edit</button></div>
      <div className="detail-metrics">{metrics.map(([label, value]) => <div className="detail-metric" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
      <section className="detail-metadata" aria-labelledby="metadata-title"><h2 id="metadata-title">Metadata &amp; Policies</h2><dl>
        <div><dt>Vendor</dt><dd>{license.vendor}</dd></div><div><dt>Description</dt><dd>{license.description || '—'}</dd></div><div><dt>Category</dt><dd>{license.category}</dd></div><div><dt>Subcategory</dt><dd>{license.subcategory || '—'}</dd></div><div><dt>Policy Links</dt><dd className="policy-links">{['License Policy', 'Vendor Terms', 'Security'].map((name, index) => <span key={name}>{index > 0 && <span aria-hidden="true">•</span>}<button onClick={() => setPolicy(name)}>{name}</button></span>)}</dd></div>
      </dl></section>
      <section className="granted-accounts" aria-labelledby="accounts-title"><h2 id="accounts-title">Granted Accounts ({license.activeUsers})</h2><div className="accounts-table-wrap"><table className="portal-table accounts-table"><thead><tr>{['User', 'Tenant', 'Tier', 'Allocated', 'Status'].map(label => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{accounts.map(account => <tr key={account.user}><td>{account.user}</td><td>{account.tenant}</td><td>{account.tier}</td><td>{account.allocated}</td><td>{account.status}</td></tr>)}{!accounts.length && <tr><td colSpan={5} className="empty-state">No account roster is available for this license.</td></tr>}</tbody></table></div></section>
    </article>
    <Dialog open={!!draft} onClose={() => setDraft(null)} fullWidth maxWidth="sm" aria-labelledby="edit-license-title"><form onSubmit={submit}>
      <DialogTitle id="edit-license-title">Edit license</DialogTitle><DialogContent><p className="dialog-description">Changes are saved in this browser.</p>{draft && <div className="edit-license-form">
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
