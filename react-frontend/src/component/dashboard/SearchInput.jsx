import "./styles/Filters.css";

export default function SearchInput({ value, onChange, placeholder = "Search..." }) {
  return (
    <input
      type="search"
      className="filter-control"
      value={value}
      placeholder={placeholder}
      aria-label={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
