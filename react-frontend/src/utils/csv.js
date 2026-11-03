const escapeCell = (value) => {
  let text = String(value ?? "");

  // Prevent spreadsheet apps from treating text cells as formulas.
  if (typeof value === "string" && /^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const downloadCsv = (filename, columns, rows) => {
  const lines = [
    columns.map((col) => escapeCell(col.label)).join(","),
    ...rows.map((row) => columns.map((col) => escapeCell(col.value(row))).join(",")),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
