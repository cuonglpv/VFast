import {
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from "react";
import { generatePath, Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import PortalIcon from "@/components/PortalIcon";
import { InfoTooltip } from "@/components/InfoTooltip";
import { StatusBadge } from "@/components/StatusBadge";
import { FilterSelect } from "@/components/FilterSelect";
import { useLicenses, type LicenseRecord } from "@/data/licenses";
import { PATHS } from "@/routes/paths";
import { formatCurrency } from "@/utils";
import { parseLicenseCsv, licenseCsvTemplate } from "@/utils/licenseCsv";
import { useLicenseInventoryView } from "@/layouts/LicenseWorkspaceLayout";
export type { LicenseRecord } from "@/data/licenses";

export function LicenseListSection() {
  const navigate = useNavigate();
  const { records, importRecords } = useLicenses();
  const {
    inventory: { search, category, compliance, rowsPerPage, page },
    updateInventory,
    position,
    rememberScroll,
  } = useLicenseInventoryView();
  const [importOpen, setImportOpen] = useState(false);
  const [message, setMessage] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const tableWrap = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (tableWrap.current)
      tableWrap.current.scrollLeft = position.current.tableLeft;
  }, [position]);
  const filtered = records.filter(
    (record) =>
      (!category || record.category === category) &&
      (!compliance || record.complianceStatus === compliance) &&
      (record.softwareName + " " + record.publisher)
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
  );
  const lastPage = Math.max(0, Math.ceil(filtered.length / rowsPerPage) - 1);
  const currentPage = Math.min(page, lastPage);
  const visible = filtered.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage,
  );

  function detailPath(id: string) {
    return generatePath(PATHS.LICENSE_DETAIL, {
      licenseId: encodeURIComponent(id),
    });
  }

  function openDetail(event: MouseEvent<HTMLTableRowElement>, id: string) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    if (
      event.target instanceof Element &&
      event.target.closest("a, button, input, select, textarea")
    )
      return;
    if (window.getSelection()?.toString()) return;
    rememberScroll();
    navigate(detailPath(id));
  }

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 1024 * 1024)
        throw new Error("Please choose a CSV file smaller than 1 MB.");
      const imported = parseLicenseCsv(await file.text());
      await importRecords(imported);
      setMessage("Imported " + imported.length + " licenses.");
      setImportOpen(false);
      updateInventory({ page: 0 });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to import this file.",
      );
    }
    event.target.value = "";
  }

  function downloadTemplate() {
    const url = URL.createObjectURL(
      new Blob([licenseCsvTemplate], { type: "text/csv" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "license-import-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="license-inventory" aria-labelledby="inventory-heading">
      <div className="inventory-heading">
        <h2 id="inventory-heading" className="inline-flex items-center gap-2">
          <span>License Inventory</span>
          <InfoTooltip title="Search and filter enterprise software entitlements" />
        </h2>
      </div>
      <div className="inventory-toolbar">
        <label className="inventory-search">
          <PortalIcon name="search" />
          <input
            aria-label="Search license name or publisher"
            placeholder="Search license name or publisher"
            value={search}
            onChange={(event) =>
              updateInventory({ search: event.target.value, page: 0 })
            }
          />
        </label>
        <FilterSelect
          label="Filter by category"
          value={category}
          onChange={(value) => updateInventory({ category: value, page: 0 })}
          options={[
            { value: "", label: "All Categories" },
            ...[
              ...new Set([
                ...records.map((record) => record.category),
                ...(category ? [category] : []),
              ]),
            ]
              .sort()
              .map((value) => ({ value, label: value })),
          ]}
        />
        <FilterSelect
          label="Filter by compliance"
          value={compliance}
          onChange={(value) => updateInventory({ compliance: value, page: 0 })}
          options={[
            { value: "", label: "All Compliance" },
            ...["Compliant", "At Risk", "Over-allocated"].map((value) => ({
              value,
              label: value,
            })),
          ]}
        />
        <button
          className="portal-button import-button"
          onClick={() => {
            setMessage("");
            setImportOpen(true);
          }}
        >
          Import
        </button>
      </div>
      {message && (
        <p className="form-message" role="status">
          {message}
        </p>
      )}
      <div
        className="inventory-table-wrap"
        ref={tableWrap}
        onScroll={(event) => {
          position.current.tableLeft = event.currentTarget.scrollLeft;
        }}
      >
        <table
          className="portal-table inventory-table"
          aria-label="License inventory"
        >
          <thead>
            <tr>
              <th scope="col">License Name</th>
              <th scope="col">Publisher</th>
              <th scope="col">License Type</th>
              <th scope="col" className="table-status">
                Compliance
              </th>
              <th
                scope="col"
                className="table-number"
                title="Purchased amount (USD)"
              >
                Purchased
              </th>
              <th scope="col" className="table-number">
                Entitlement
              </th>
              <th scope="col" className="table-number">
                Active Users
              </th>
              <th
                scope="col"
                className="table-number"
                title="Assigned users / purchased seats"
              >
                Total Users
              </th>
              <th scope="col" className="table-date">
                Expiry Date
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((record: LicenseRecord) => (
              <tr
                key={record.id}
                className="license-inventory-row"
                onClick={(event) => openDetail(event, record.id)}
              >
                <td>
                  <Link
                    className="license-name-link table-name"
                    to={detailPath(record.id)}
                    onClick={rememberScroll}
                  >
                    {record.softwareName}
                  </Link>
                </td>
                <td>{record.publisher}</td>
                <td>
                  <StatusBadge
                    domain="classification"
                    status={record.licenseType}
                  />
                </td>
                <td className="table-status">
                  <StatusBadge
                    domain="compliance"
                    status={record.complianceStatus}
                  />
                </td>
                <td className="table-number">
                  {formatCurrency(record.purchasedAmount)}
                </td>
                <td className="table-number">{record.entitlementSeats}</td>
                <td className="table-number">{record.activeUsers}</td>
                <td className="table-number">
                  {record.totalUsers} / {record.entitlementSeats}
                </td>
                <td className="table-date">{record.expiryDate}</td>
              </tr>
            ))}
            {!visible.length && (
              <tr>
                <td colSpan={9} className="empty-state">
                  No licenses match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="inventory-pagination">
        <label>
          Rows per page:{" "}
          <select
            aria-label="Rows per page"
            value={rowsPerPage}
            onChange={(event) =>
              updateInventory({
                rowsPerPage: Number(event.target.value),
                page: 0,
              })
            }
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </label>
        <span>·</span>
        <span>
          {filtered.length ? currentPage * rowsPerPage + 1 : 0}–
          {Math.min((currentPage + 1) * rowsPerPage, filtered.length)} of{" "}
          {filtered.length}
        </span>
        {lastPage > 0 && (
          <div className="pagination-controls">
            <button
              aria-label="Previous page"
              disabled={currentPage === 0}
              onClick={() => updateInventory({ page: currentPage - 1 })}
            >
              ‹
            </button>
            <button
              aria-label="Next page"
              disabled={currentPage >= lastPage}
              onClick={() => updateInventory({ page: currentPage + 1 })}
            >
              ›
            </button>
          </div>
        )}
      </div>
      <Dialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        fullWidth
        maxWidth="sm"
        aria-labelledby="import-title"
      >
        <DialogTitle id="import-title">Import licenses</DialogTitle>
        <DialogContent>
          <p className="dialog-description">
            Upload a CSV using the template below. Licenses with matching names
            will be updated.
          </p>
          <button className="text-button" onClick={downloadTemplate}>
            Download CSV template
          </button>
          <input
            ref={fileInput}
            type="file"
            accept=".csv,text/csv"
            onChange={importFile}
            aria-label="License CSV file"
            className="import-file-input"
          />
          {message && <p role="alert">{message}</p>}
        </DialogContent>
        <DialogActions>
          <button
            className="portal-button"
            onClick={() => setImportOpen(false)}
          >
            Cancel
          </button>
          <button
            className="portal-button primary-button"
            onClick={() => fileInput.current?.click()}
          >
            Choose CSV file
          </button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
export default LicenseListSection;
