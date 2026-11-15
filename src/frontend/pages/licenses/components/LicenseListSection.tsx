import { Link } from 'react-router-dom';
import { InfoTooltip } from '@/components/InfoTooltip';
import { StatusBadge } from '@/components/StatusBadge';
import { FilterToolbar } from '@/components/filters/FilterToolbar';
import { DataTable, type TableColumn } from '@/components/table/DataTable';
import { TablePagination } from '@/components/table/TablePagination';
import { Button } from '@/components/ui/Button';
import { InlineAlert } from '@/components/feedback/InlineAlert';
import { FormDialog } from '@/components/dialogs/FormDialog';
import { formatCurrency } from '@/utils';
import type { LicenseRecord } from '@/types/license';
import { useLicenseInventory } from '../hooks/useLicenseInventory';

export type { LicenseRecord } from '@/types/license';

export function LicenseListSection() {
  const { records, search, category, compliance, rowsPerPage, currentPage, visible, filtered, updateInventory, position, importOpen, setImportOpen, message, setMessage, fileInput, tableWrap, detailPath, openDetail, importFile, downloadTemplate, rememberScroll } = useLicenseInventory();
  const columns: TableColumn<LicenseRecord>[] = [
    { key: 'name', header: 'License Name', cell: record => <Link className="license-name-link table-name" to={detailPath(record.id)} onClick={rememberScroll}>{record.softwareName}</Link> },
    { key: 'publisher', header: 'Publisher', cell: record => record.publisher },
    { key: 'type', header: 'License Type', cell: record => <StatusBadge domain="classification" status={record.licenseType} /> },
    { key: 'compliance', header: 'Compliance', className: 'table-status', cell: record => <StatusBadge domain="compliance" status={record.complianceStatus} /> },
    { key: 'purchased', header: 'Purchased', title: 'Purchased amount (USD)', className: 'table-number', cell: record => formatCurrency(record.purchasedAmount) },
    { key: 'entitlement', header: 'Entitlement', className: 'table-number', cell: record => record.entitlementSeats },
    { key: 'active', header: 'Active Users', className: 'table-number', cell: record => record.activeUsers },
    { key: 'total', header: 'Total Users', title: 'Assigned users / purchased seats', className: 'table-number', cell: record => <>{record.totalUsers} / {record.entitlementSeats}</> },
    { key: 'expiry', header: 'Expiry Date', className: 'table-date', cell: record => record.expiryDate },
  ];

  return <section className="license-inventory" aria-labelledby="inventory-heading">
    <div className="inventory-heading"><h2 id="inventory-heading" className="inline-flex items-center gap-2"><span>License Inventory</span><InfoTooltip title="Search and filter enterprise software entitlements" /></h2></div>
    <FilterToolbar
      search={{ value: search, onChange: value => updateInventory({ search: value }), 'aria-label': 'Search license name or publisher', placeholder: 'Search license name or publisher' }}
      filters={[
        { key: 'category', label: 'Filter by category', value: category, onChange: value => updateInventory({ category: value, page: 0 }), options: [{ value: '', label: 'All Categories' }, ...[...new Set([...records.map(record => record.category), ...(category ? [category] : [])])].sort().map(value => ({ value, label: value }))] },
        { key: 'compliance', label: 'Filter by compliance', value: compliance, onChange: value => updateInventory({ compliance: value, page: 0 }), options: [{ value: '', label: 'All Compliance' }, ...['Compliant', 'At Risk', 'Over-allocated'].map(value => ({ value, label: value }))] },
      ]}
      actions={<Button className="import-button" onClick={() => { setMessage(''); setImportOpen(true); }}>Import</Button>}
    />
    {message && <InlineAlert>{message}</InlineAlert>}
    <div className="inventory-table-wrap" ref={tableWrap} onScroll={event => { position.current.tableLeft = event.currentTarget.scrollLeft; }}>
      <DataTable rows={visible} columns={columns} getRowKey={record => record.id} label="License inventory" className="portal-table inventory-table" emptyMessage="No licenses match your filters." rowProps={record => ({ className: 'license-inventory-row', onClick: event => openDetail(event, record.id) })} />
    </div>
    <TablePagination total={filtered.length} page={currentPage} pageSize={rowsPerPage} onPageChange={page => updateInventory({ page })} onPageSizeChange={rowsPerPage => updateInventory({ rowsPerPage, page: 0 })} label="License inventory" />
    <FormDialog open={importOpen} onClose={() => setImportOpen(false)} title="Import licenses" actions={<>
      <Button onClick={() => setImportOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={() => fileInput.current?.click()}>Choose CSV file</Button>
    </>}>
      <p className="dialog-description">Upload a CSV using the template below. Licenses with matching names will be updated.</p>
      <Button variant="plain" className="text-button" onClick={downloadTemplate}>Download CSV template</Button>
      <input ref={fileInput} type="file" accept=".csv,text/csv" onChange={importFile} aria-label="License CSV file" className="import-file-input" />
      {message && <InlineAlert tone="error">{message}</InlineAlert>}
    </FormDialog>
  </section>;
}

export default LicenseListSection;
