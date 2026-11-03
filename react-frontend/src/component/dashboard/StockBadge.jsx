import { getStockLevel, STOCK_LEVELS } from "./format";
import "./styles/StockBadge.css";

export default function StockBadge({ quantity }) {
  const level = getStockLevel(quantity);
  const { icon, label } = STOCK_LEVELS[level];

  return (
    <span className={`stock-badge stock-badge--${level}`}>
      <span aria-hidden="true">{icon}</span> {label}
    </span>
  );
}
