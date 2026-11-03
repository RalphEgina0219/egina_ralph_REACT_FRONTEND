import "./styles/StatusMessage.css";

export default function StatusMessage({ type = "info", message, onRetry }) {
  return (
    <div
      className={`status-message status-message--${type}`}
      role={type === "error" ? "alert" : "status"}
    >
      <p>{message}</p>
      {onRetry && (
        <button type="button" className="status-message-btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
