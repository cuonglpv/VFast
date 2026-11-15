import { PATHS } from '@/routes/paths';
import { StatusBadge } from '@/components/StatusBadge';
import { PageHeader } from '@/components/layout/PageHeader';
import { BackLink } from '@/components/layout/BackLink';
import { InlineAlert } from '@/components/feedback/InlineAlert';
import { FilterToolbar } from '@/components/filters/FilterToolbar';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import { TablePagination } from '@/components/table/TablePagination';
import { Button, IconButton } from '@/components/ui/Button';
import { FormDialog } from '@/components/dialogs/FormDialog';
import type { GrantedAccount } from '@/types/license';
import { useLicenseDetail } from './hooks/useLicenseDetail';

function BackToLicenses() {
  return <BackLink to={PATHS.LICENSES}>Back to License Management</BackLink>;
}

export default function LicenseDetailPage() {
  const { license, draft, setDraft, error, setError, saved, setSaved, savedMessage, setSavedMessage, policy, setPolicy, metadataCollapsed, setMetadataCollapsed, metadataDraft, setMetadataDraft, accountList, setAccountList, editingAccount, setEditingAccount, accountSearch, setAccountSearch, accountStatus, setAccountStatus, setAccountPage, accountPageSize, setAccountPageSize, accounts, accountsError, filteredAccounts, currentAccountPage, visibleAccounts, metrics, submit, submitMetadata, submitAccount } = useLicenseDetail();
  if (!license) return <div className="license-detail-page"><BackToLicenses /><PageHeader title="License not found" description="This license is not available." /></div>;
  const accountColumns: TableColumn<GrantedAccount>[] = [
    { key: 'user', header: 'User', cell: account => <><span className="table-name">{account.user}</span>{account.email && <div className="table-secondary">{account.email}</div>}</> },
    { key: 'tenant', header: 'Tenant', cell: account => account.tenant },
    { key: 'tier', header: 'Tier', cell: account => account.tier },
    { key: 'allocated', header: 'Allocated', className: 'table-date', cell: account => account.allocated },
    { key: 'status', header: 'Usage Status', className: 'table-status', cell: account => <StatusBadge domain="usage" status={account.status} /> },
    { key: 'actions', header: 'Actions', className: 'table-status', cell: account => <IconButton title={`Edit ${account.user}`} aria-label={`Edit ${account.user}`} onClick={() => { setEditingAccount({ index: accountList.indexOf(account), account: { ...account } }); setError(''); setSaved(false); }}><span className="material-symbols-outlined text-base">edit</span></IconButton> },
  ];
  return (
    <div className="license-detail-page">
      <BackToLicenses />
      <PageHeader title={<>{license.softwareName}{license.id === 'lic-m365-01' ? ' Enterprise' : ''}</>} tooltip="License details, entitlement, usage, cost and policy information" className="page-heading detail-page-heading" actions={<StatusBadge domain="compliance" status={license.complianceStatus} />} />

      {saved && <InlineAlert>{savedMessage}</InlineAlert>}

      <article className="portal-card license-detail-card">
        {/* SECTION 1: LICENSE OVERVIEW */}
        <div className="detail-card-header">
          <div>
            <p>{license.vendor}</p>
            <h2>License Overview</h2>
          </div>
          <Button
            className="edit-button"
            type="button"
            onClick={() => { setDraft({ ...license }); setError(''); setSaved(false); }}
          >
            Edit
          </Button>
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
              <Button
                variant="plain"
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
              </Button>
            </div>
            <Button
              className="edit-button"
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
            </Button>
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
                      <Button variant="plain" type="button" onClick={() => setPolicy(name)}>{name}</Button>
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
              <Button
                className="edit-button"
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
              </Button>
              <Button
                className="edit-button"
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
              </Button>
            </div>
          </div>
          {accountList.length > 0 && (
            <FilterToolbar className="accounts-toolbar"
              search={{ value: accountSearch, onChange: setAccountSearch, 'aria-label': 'Search granted accounts by name or email', placeholder: 'Search account name or email' }}
              filters={[{ key: 'status', label: 'Filter accounts by usage status', value: accountStatus, onChange: value => { setAccountStatus(value); setAccountPage(0); }, options: [{ value: '', label: 'All Statuses' }, ...[...new Set(accountList.map(account => account.status))].sort().map(value => ({ value, label: value }))] }]}
            />
          )}
          <div className="accounts-table-wrap">
            <DataTable rows={visibleAccounts} columns={accountColumns} getRowKey={account => accountList.indexOf(account)} label="Granted accounts" className="portal-table accounts-table" loading={!accounts && !accountsError} loadingMessage="Loading accounts..." error={accountsError} errorMessage="Unable to load accounts." emptyMessage={accountList.length ? 'No accounts match your filters.' : 'No account roster is available for this license.'} />
          </div>
          {accountList.length > 0 && <TablePagination total={filteredAccounts.length} page={currentAccountPage} pageSize={accountPageSize} onPageChange={setAccountPage} onPageSizeChange={size => { setAccountPageSize(size); setAccountPage(0); }} label="Granted accounts" />}
        </section>
      </article>

      {/* DIALOG 1: EDIT LICENSE OVERVIEW */}
      <FormDialog open={!!draft} onClose={() => setDraft(null)} title="Edit License Overview" onSubmit={submit} error={error} actions={<>
<Button type="button"  onClick={() => setDraft(null)}>Cancel</Button>
            <Button type="submit" variant="primary">Save changes</Button>
        </>}>

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
                </FormDialog>

      {/* DIALOG 2: EDIT METADATA & POLICIES */}
      <FormDialog open={!!metadataDraft} onClose={() => setMetadataDraft(null)} title="Edit Metadata & Policies" onSubmit={submitMetadata} error={error} actions={<>
<Button type="button"  onClick={() => setMetadataDraft(null)}>Cancel</Button>
            <Button type="submit" variant="primary">Save changes</Button>
        </>}>

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
                </FormDialog>

      {/* DIALOG 3: EDIT GRANTED ACCOUNT */}
      <FormDialog open={!!editingAccount} onClose={() => setEditingAccount(null)} title={editingAccount && editingAccount.index >= 0 ? 'Edit Granted Account' : 'Add Granted Account'} onSubmit={submitAccount} error={error} actions={<>
{editingAccount && editingAccount.index >= 0 && (
              <Button
                type="button"
                className="text-red-600 mr-auto hover:bg-red-50"
                onClick={() => {
                  const next = accountList.filter((_, i) => i !== editingAccount.index);
                  setAccountList(next);
                  setEditingAccount(null);
                  setSavedMessage('Account grant deleted.');
                  setSaved(true);
                }}
              >
                Delete
              </Button>
            )}
            <Button type="button"  onClick={() => setEditingAccount(null)}>Cancel</Button>
            <Button type="submit" variant="primary">Save</Button>
        </>}>

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
                </FormDialog>

      {/* DIALOG 4: POLICY PREVIEW */}
      <FormDialog open={!!policy} onClose={() => setPolicy('')} maxWidth="xs" title={policy} actions={<>
<Button type="button"  onClick={() => setPolicy('')}>Close</Button>
        </>}>

          <p>No {policy.toLowerCase()} document has been attached to {license.softwareName}.</p>
              </FormDialog>
    </div>
  );
}
