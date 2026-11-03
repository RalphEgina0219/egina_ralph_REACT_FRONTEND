export const LOW_STOCK_THRESHOLD = 10;

export const STOCK_LEVELS = {
  in: { label: "In stock", icon: "●", color: "var(--status-good)" },
  low: { label: "Low stock", icon: "▲", color: "var(--status-warning)" },
  out: { label: "Out of stock", icon: "✕", color: "var(--status-critical)" },
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(
    Number(value) || 0
  );

export const formatNumber = (value) =>
  new Intl.NumberFormat("en-PH").format(Number(value) || 0);

export const getStockLevel = (quantity) => {
  const qty = Number(quantity) || 0;
  if (qty <= 0) return "out";
  if (qty < LOW_STOCK_THRESHOLD) return "low";
  return "in";
};

export const stockValue = (product) =>
  (Number(product.price) || 0) * (Number(product.quantity) || 0);
