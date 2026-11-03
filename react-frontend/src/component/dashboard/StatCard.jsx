import "./styles/StatCard.css";

export default function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <span className="stat-card-label">{label}</span>
      <strong className="stat-card-value">{value}</strong>
      {hint && <small className="stat-card-hint">{hint}</small>}
    </div>
  );
}
