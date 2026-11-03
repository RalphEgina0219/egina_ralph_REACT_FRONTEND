import "./styles/Pagination.css";

export default function Pagination({ page, pageCount, onPageChange, summary }) {
  return (
    <nav className="pagination" aria-label="Pagination">
      {summary && <span className="pagination-summary">{summary}</span>}
      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <span className="pagination-page">
          Page {page} of {pageCount}
        </span>
        <button
          type="button"
          className="pagination-btn"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
