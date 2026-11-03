import { useEffect, useId, useRef } from "react";
import "./styles/Modal.css";

export default function Modal({ title, onClose, children }) {
  const titleId = useId();
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id={titleId} className="modal-title">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            className="modal-close"
            aria-label="Close"
            onClick={onClose}
          >
            {"×"}
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
