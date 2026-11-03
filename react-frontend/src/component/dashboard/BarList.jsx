import "./styles/BarList.css";

export default function BarList({ items, formatValue = (value) => value, onSelect, activeLabel }) {
  const max = Math.max(...items.map((item) => item.value), 0);

  if (items.length === 0) {
    return <p className="bar-list-empty">No data to display.</p>;
  }

  return (
    <ul className="bar-list">
      {items.map((item) => {
        const isActive = item.label === activeLabel;
        const content = (
          <>
            <span className="bar-list-label">{item.label}</span>
            <span className="bar-list-track">
              <span
                className="bar-list-fill"
                style={{ width: `${max ? (item.value / max) * 100 : 0}%` }}
              />
            </span>
            <span className="bar-list-value">{formatValue(item.value)}</span>
          </>
        );

        return (
          <li key={item.label} title={`${item.label}: ${formatValue(item.value)}`}>
            {onSelect ? (
              <button
                type="button"
                className={`bar-list-row is-selectable${isActive ? " is-active" : ""}`}
                aria-pressed={isActive}
                onClick={() => onSelect(item.label)}
              >
                {content}
              </button>
            ) : (
              <div className="bar-list-row">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
