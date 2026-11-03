import "./styles/Filters.css";

export default function SelectFilter({ label, value, onChange, options }) {
  return (
    <select
      className="filter-control"
      value={value}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
