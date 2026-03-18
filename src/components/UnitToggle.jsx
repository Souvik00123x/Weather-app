export default function UnitToggle({ unit, onToggle }) {
  return (
    <div className="unit-toggle" id="unit-toggle" role="radiogroup" aria-label="Temperature unit">
      <div className={`unit-slider ${unit === 'F' ? 'right' : 'left'}`} />
      <button
        className={`unit-option ${unit === 'C' ? 'active' : ''}`}
        onClick={() => unit !== 'C' && onToggle()}
        role="radio"
        aria-checked={unit === 'C'}
      >
        °C
      </button>
      <button
        className={`unit-option ${unit === 'F' ? 'active' : ''}`}
        onClick={() => unit !== 'F' && onToggle()}
        role="radio"
        aria-checked={unit === 'F'}
      >
        °F
      </button>
    </div>
  );
}
