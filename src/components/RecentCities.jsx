export default function RecentCities({ cities, onSelect, onClear }) {
  if (!cities || cities.length === 0) return null;

  return (
    <div className="recent-cities">
      <div className="recent-header">
        <div className="recent-label-wrap">
          <svg className="recent-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="recent-label">Recent</span>
        </div>
        <button className="clear-btn" onClick={onClear} id="clear-recent">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="clear-icon">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
          </svg>
          Clear all
        </button>
      </div>
      <div className="recent-list">
        {cities.map((city, index) => (
          <button
            key={city}
            className="recent-chip"
            onClick={() => onSelect(city)}
            style={{ animationDelay: `${index * 0.07}s` }}
          >
            <svg className="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}
