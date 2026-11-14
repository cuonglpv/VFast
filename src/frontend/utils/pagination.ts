export function paginateRows<T>(rows: readonly T[], page: number, pageSize: number) {
  const lastPage = Math.max(0, Math.ceil(rows.length / pageSize) - 1);
  const currentPage = Math.max(0, Math.min(page, lastPage));
  return { currentPage, visible: rows.slice(currentPage * pageSize, (currentPage + 1) * pageSize) };
}
