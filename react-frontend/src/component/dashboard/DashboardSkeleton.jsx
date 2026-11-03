import "./styles/DashboardSkeleton.css";

export default function DashboardSkeleton({ stats = 4 }) {
  return (
    <div className="dashboard-skeleton" role="status" aria-busy="true" aria-label="Loading">
      <div className="skeleton skeleton-title" />
      <div className="skeleton-stats">
        {Array.from({ length: stats }, (_, i) => (
          <div key={i} className="skeleton skeleton-stat" />
        ))}
      </div>
      <div className="skeleton skeleton-panel" />
      <div className="skeleton skeleton-panel skeleton-panel--tall" />
    </div>
  );
}
