import { getStockLevel } from "./format";
import "./styles/StockBadge.css";

const LEVELS = {
  in: { icon: "●", label: "In stock" },
  low: { icon: "▲", label: "Low stock" },
  out: { icon: "✕", label: "Out of stock" },
};

export default function StockBadge({ quantity }) {
  const level = getStockLevel(quantity);
  const { icon, label } = LEVELS[level];

  return (
    <span className={`stock-badge stock-badge--${level}`}>
      <span aria-hidden="true">{icon}</span> {label}
    </span>
  );
}
