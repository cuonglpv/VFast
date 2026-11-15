import { useEffect, useLayoutEffect, useRef, useState, type ChangeEvent, type MouseEvent } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { useLicenses } from '@/data/licenses';
import { PATHS } from '@/routes/paths';
import { parseLicenseCsv, licenseCsvTemplate } from '@/utils/licenseCsv';
import { paginateRows } from '@/utils/pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useLicenseInventoryView } from '@/layouts/LicenseWorkspaceLayout';

export function useLicenseInventory() {
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
  const query = useDebounce(search).trim().toLowerCase();
  const filtered = records.filter(
    (record) =>
      (!category || record.category === category) &&
      (!compliance || record.complianceStatus === compliance) &&
      (record.softwareName + " " + record.publisher)
        .toLowerCase()
        .includes(query),
  );
  const { currentPage, visible } = paginateRows(filtered, page, rowsPerPage);

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

  const previousQuery = useRef(query);
  useEffect(() => {
    if (previousQuery.current !== query) {
      previousQuery.current = query;
      updateInventory({ page: 0 });
    }
  }, [query, updateInventory]);
  return { records, search, category, compliance, rowsPerPage, currentPage, visible, filtered, updateInventory, position, importOpen, setImportOpen, message, setMessage, fileInput, tableWrap, detailPath, openDetail, importFile, downloadTemplate, rememberScroll };
}
