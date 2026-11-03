import "./styles/StackedBar.css";

export default function StackedBar({ segments, formatValue = (value) => value }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const percent = (value) => (total ? Math.round((value / total) * 100) : 0);

  return (
    <div className="stacked-bar">
      <div
        className="stacked-bar-track"
        role="img"
        aria-label={segments.map((s) => `${s.label}: ${formatValue(s.value)}`).join(", ")}
      >
        {segments
          .filter((segment) => segment.value > 0)
          .map((segment) => (
            <span
              key={segment.key}
              className="stacked-bar-segment"
              style={{ flexGrow: segment.value, backgroundColor: segment.color }}
              title={`${segment.label}: ${formatValue(segment.value)} (${percent(segment.value)}%)`}
            />
          ))}
      </div>

      <ul className="stacked-bar-legend">
        {segments.map((segment) => (
          <li key={segment.key} className="stacked-bar-legend-item">
            <span
              className="stacked-bar-swatch"
              style={{ backgroundColor: segment.color }}
              aria-hidden="true"
            />
            <span className="stacked-bar-legend-label">{segment.label}</span>
            <strong className="stacked-bar-legend-value">{formatValue(segment.value)}</strong>
            <span className="stacked-bar-legend-percent">{percent(segment.value)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
