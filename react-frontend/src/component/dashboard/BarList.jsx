import "./styles/BarList.css";

export default function BarList({ items, formatValue = (value) => value }) {
  const max = Math.max(...items.map((item) => item.value), 0);

  if (items.length === 0) {
    return <p className="bar-list-empty">No data to display.</p>;
  }

  return (
    <ul className="bar-list">
      {items.map((item) => (
        <li
          key={item.label}
          className="bar-list-row"
          title={`${item.label}: ${formatValue(item.value)}`}
        >
          <span className="bar-list-label">{item.label}</span>
          <span className="bar-list-track">
            <span
              className="bar-list-fill"
              style={{ width: `${max ? (item.value / max) * 100 : 0}%` }}
            />
          </span>
          <span className="bar-list-value">{formatValue(item.value)}</span>
        </li>
      ))}
    </ul>
  );
}
