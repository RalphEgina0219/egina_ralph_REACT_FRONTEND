import StockBadge from "./StockBadge";
import { formatCurrency, formatNumber, stockValue } from "./format";
import "./styles/ProductDetails.css";

export default function ProductDetails({ product }) {
  const details = [
    { label: "Category", value: product.category || "Uncategorized" },
    { label: "Price", value: formatCurrency(product.price) },
    { label: "Quantity", value: formatNumber(product.quantity) },
    { label: "Stock value", value: formatCurrency(stockValue(product)) },
    { label: "Stock", value: <StockBadge quantity={product.quantity} /> },
    product.slug && { label: "Slug", value: product.slug },
    product.status && { label: "Status", value: product.status },
  ].filter(Boolean);

  return (
    <dl className="product-details">
      {details.map((detail) => (
        <div key={detail.label} className="product-details-row">
          <dt>{detail.label}</dt>
          <dd>{detail.value}</dd>
        </div>
      ))}
    </dl>
  );
}
