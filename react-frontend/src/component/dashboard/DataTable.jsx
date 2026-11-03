import { useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";
import "./styles/DataTable.css";

export default function DataTable({
  columns,
  rows,
  rowKey = "id",
  emptyMessage = "No records found.",
  pageSize,
  onRowClick,
}) {
  const [sort, setSort] = useState({ key: null, direction: "asc" });
  const [page, setPage] = useState(1);

  // Go back to the first page whenever the data set changes (e.g. filters).
  useEffect(() => {
    setPage(1);
  }, [rows]);

  const sortedRows = useMemo(() => {
    if (!sort.key) return rows;
    const column = columns.find((col) => col.key === sort.key);
    const getValue = column.sortValue || ((row) => row[column.key]);

    return [...rows].sort((a, b) => {
      const x = getValue(a);
      const y = getValue(b);
      const result =
        typeof x === "number" && typeof y === "number"
          ? x - y
          : String(x ?? "").localeCompare(String(y ?? ""));
      return sort.direction === "asc" ? result : -result;
    });
  }, [rows, columns, sort]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(sortedRows.length / pageSize)) : 1;
  const currentPage = Math.min(page, pageCount);
  const start = pageSize ? (currentPage - 1) * pageSize : 0;
  const visibleRows = pageSize ? sortedRows.slice(start, start + pageSize) : sortedRows;

  const toggleSort = (key) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const ariaSort = (key) => {
    if (sort.key !== key) return "none";
    return sort.direction === "asc" ? "ascending" : "descending";
  };

  const rowProps = (row) => {
    if (!onRowClick) return {};
    return {
      className: "is-clickable",
      tabIndex: 0,
      onClick: () => onRowClick(row),
      onKeyDown: (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onRowClick(row);
        }
      },
    };
  };

  return (
    <div className="data-table-container">
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={col.align === "right" ? "is-right" : ""}
                  aria-sort={ariaSort(col.key)}
                >
                  <button type="button" onClick={() => toggleSort(col.key)}>
                    {col.label}
                    <span className="data-table-sort" aria-hidden="true">
                      {sort.key === col.key && (sort.direction === "asc" ? "▲" : "▼")}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.length > 0 ? (
              visibleRows.map((row) => (
                <tr key={row[rowKey]} {...rowProps(row)}>
                  {columns.map((col) => (
                    <td key={col.key} className={col.align === "right" ? "is-right" : ""}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="data-table-empty" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pageSize && sortedRows.length > 0 && (
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          onPageChange={setPage}
          summary={`Showing ${start + 1}–${start + visibleRows.length} of ${sortedRows.length}`}
        />
      )}
    </div>
  );
}
