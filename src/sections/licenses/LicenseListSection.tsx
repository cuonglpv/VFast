import { useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PortalIcon from '@/components/PortalIcon';
import { useLicenses, type LicenseRecord } from '@/data/licenses';
import { PATHS } from '@/routes/paths';
import { formatCurrency } from '@/utils';
import { parseLicenseCsv, licenseCsvTemplate } from '@/utils/licenseCsv';
export type { LicenseRecord } from '@/data/licenses';
export { initialLicenses as mockLicenseRecords } from '@/data/licenses';

export function LicenseListSection() {
  const { records, saveRecords } = useLicenses();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [compliance, setCompliance] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [importOpen, setImportOpen] = useState(false);
  const [message, setMessage] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const filtered = records.filter(record => (!category || record.category === category)
    && (!compliance || record.complianceStatus === compliance)
    && (record.softwareName + ' ' + record.publisher).toLowerCase().includes(search.trim().toLowerCase()));
  const lastPage = Math.max(0, Math.ceil(filtered.length / rowsPerPage) - 1);
  const currentPage = Math.min(page, lastPage);
  const visible = filtered.slice(currentPage * rowsPerPage, (currentPage + 1) * rowsPerPage);

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error('Please choose a CSV file smaller than 1 MB.');
      const imported = parseLicenseCsv(await file.text());
      const next = [...records];
      imported.forEach(record => {
        const index = next.findIndex(existing => existing.softwareName.toLowerCase() === record.softwareName.toLowerCase());
        if (index < 0) next.push(record);
        else next[index] = { ...record, id: next[index].id };
      });
      saveRecords(next);
      setMessage('Imported ' + imported.length + ' licenses. Saved in this browser.');
      setImportOpen(false);
      setPage(0);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to import this file.');
    }
    event.target.value = '';
  }

  function downloadTemplate() {
    const url = URL.createObjectURL(new Blob([licenseCsvTemplate], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'license-import-template.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return <section className="license-inventory" aria-labelledby="inventory-heading">
    <div className="inventory-heading"><h2 id="inventory-heading">License Inventory</h2><p>Search and filter enterprise software entitlements</p></div>
    <div className="inventory-toolbar">
      <label className="inventory-search"><PortalIcon name="search" /><input aria-label="Search license name or publisher" placeholder="Search license name or publisher" value={search} onChange={event => { setSearch(event.target.value); setPage(0); }} /></label>
      <select aria-label="Filter by category" value={category} onChange={event => { setCategory(event.target.value); setPage(0); }}><option value="">All Categories</option>{[...new Set(records.map(record => record.category))].sort().map(value => <option key={value}>{value}</option>)}</select>
      <select aria-label="Filter by compliance" value={compliance} onChange={event => { setCompliance(event.target.value); setPage(0); }}><option value="">All Compliance</option><option>Compliant</option><option>At Risk</option><option>Over-allocated</option></select>
      <button className="portal-button import-button" onClick={() => { setMessage(''); setImportOpen(true); }}>Import</button>
    </div>
    {message && <p className="form-message" role="status">{message}</p>}
    <div className="inventory-table-wrap"><table className="portal-table inventory-table">
      <thead><tr>{['License Name', 'Publisher', 'License Type', 'Compliance', 'Purchased', 'Entitlement', 'Active Users', 'Total Users', 'Expiry Date'].map(title => <th key={title} scope="col">{title}</th>)}</tr></thead>
      <tbody>{visible.map((record: LicenseRecord) => <tr key={record.id}>
        <td><Link className="license-name-link" to={PATHS.LICENSES + '/' + record.id}>{record.softwareName}</Link></td><td>{record.publisher}</td><td>{record.licenseType}</td><td>{record.complianceStatus}</td><td>{formatCurrency(record.purchasedAmount)}</td><td>{record.entitlementSeats} seats</td><td>{record.activeUsers}</td><td>{record.totalUsers} / {record.entitlementSeats}</td><td>{record.expiryDate}</td>
      </tr>)}{!visible.length && <tr><td colSpan={9} className="empty-state">No licenses match your filters.</td></tr>}</tbody>
    </table></div>
    <div className="inventory-pagination"><label>Rows per page: <select aria-label="Rows per page" value={rowsPerPage} onChange={event => { setRowsPerPage(Number(event.target.value)); setPage(0); }}><option>10</option><option>25</option><option>50</option></select></label><span>·</span><span>{filtered.length ? currentPage * rowsPerPage + 1 : 0}–{Math.min((currentPage + 1) * rowsPerPage, filtered.length)} of {filtered.length}</span>{lastPage > 0 && <div className="pagination-controls"><button aria-label="Previous page" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>‹</button><button aria-label="Next page" disabled={currentPage >= lastPage} onClick={() => setPage(currentPage + 1)}>›</button></div>}</div>
    <Dialog open={importOpen} onClose={() => setImportOpen(false)} fullWidth maxWidth="sm" aria-labelledby="import-title">
      <DialogTitle id="import-title">Import licenses</DialogTitle><DialogContent><p className="dialog-description">Upload a CSV using the template below. Licenses with matching names will be updated. Data is saved only in this browser.</p><button className="text-button" onClick={downloadTemplate}>Download CSV template</button><input ref={fileInput} type="file" accept=".csv,text/csv" onChange={importFile} aria-label="License CSV file" className="import-file-input" />{message && <p role="alert">{message}</p>}</DialogContent><DialogActions><button className="portal-button" onClick={() => setImportOpen(false)}>Cancel</button><button className="portal-button primary-button" onClick={() => fileInput.current?.click()}>Choose CSV file</button></DialogActions>
    </Dialog>
  </section>;
}
export default LicenseListSection;
