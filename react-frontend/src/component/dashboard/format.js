export const LOW_STOCK_THRESHOLD = 10;

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
