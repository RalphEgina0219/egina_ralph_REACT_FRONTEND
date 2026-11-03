import { useMemo, useState } from "react";
import "./styles/DataTable.css";

export default function DataTable({ columns, rows, rowKey = "id", emptyMessage = "No records found." }) {
  const [sort, setSort] = useState({ key: null, direction: "asc" });

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

  return (
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
          {sortedRows.length > 0 ? (
            sortedRows.map((row) => (
              <tr key={row[rowKey]}>
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
  );
}
