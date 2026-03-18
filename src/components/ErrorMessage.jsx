export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div className="error-message" id="error-message">
      <div className="error-icon-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="error-svg">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round"/>
          <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="error-content">
        <span className="error-title">Something went wrong</span>
        <p className="error-text">{message}</p>
      </div>
    </div>
  );
}
