import { useState, useEffect, useRef } from 'react';
import { convertTemp } from '../services/weatherService';

function getFlag(countryCode) {
  if (!countryCode) return '🌍';
  return countryCode
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(127397 + c.charCodeAt(0)))
    .join('');
}

function formatTime(timestamp, timezone) {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function AnimatedTemp({ value }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    const duration = 600;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    prevRef.current = to;
  }, [value]);

  return <span className="temp-value">{display}</span>;
}

function WeatherIcon({ condition, icon }) {
  const isNight = icon?.endsWith('n');

  const icons = {
    Clear: isNight ? (
      <svg className="weather-svg-icon" viewBox="0 0 64 64">
        <path d="M42 22a20 20 0 1 1-20 20c0-1.1.09-2.18.26-3.24A16 16 0 0 0 42 22z" fill="rgba(255,255,255,0.9)" />
        <circle cx="46" cy="18" r="2" fill="rgba(255,255,255,0.6)" />
        <circle cx="54" cy="28" r="1.5" fill="rgba(255,255,255,0.4)" />
        <circle cx="50" cy="10" r="1" fill="rgba(255,255,255,0.5)" />
      </svg>
    ) : (
      <svg className="weather-svg-icon sun-icon" viewBox="0 0 64 64">
        <defs>
          <radialGradient id="sun-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="100%" stopColor="#FF9F43" />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="14" fill="url(#sun-grad)" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 32 + 20 * Math.cos(rad);
          const y1 = 32 + 20 * Math.sin(rad);
          const x2 = 32 + 26 * Math.cos(rad);
          const y2 = 32 + 26 * Math.sin(rad);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#FFE066" strokeWidth="2.5" strokeLinecap="round"
              className="sun-ray" style={{ animationDelay: `${i * 0.1}s` }} />
          );
        })}
      </svg>
    ),
    Clouds: (
      <svg className="weather-svg-icon cloud-icon" viewBox="0 0 64 64">
        <defs>
          <linearGradient id="cloud-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
            <stop offset="100%" stopColor="rgba(200,215,230,0.85)" />
          </linearGradient>
        </defs>
        <path d="M20 44a8 8 0 0 1 0-16h1.2A12 12 0 0 1 44 24a10 10 0 0 1 0 20H20z"
          fill="url(#cloud-grad)" className="cloud-body" />
      </svg>
    ),
    Rain: (
      <svg className="weather-svg-icon rain-icon" viewBox="0 0 64 64">
        <path d="M18 36a7 7 0 0 1 0-14h1A10.5 10.5 0 0 1 40 18a8.5 8.5 0 0 1 0 17H18z"
          fill="rgba(180,200,220,0.85)" className="cloud-body" />
        {[22, 30, 38].map((x, i) => (
          <line key={i} x1={x} y1="42" x2={x - 3} y2="54"
            stroke="rgba(120,180,255,0.8)" strokeWidth="2" strokeLinecap="round"
            className="rain-drop" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </svg>
    ),
    Drizzle: (
      <svg className="weather-svg-icon rain-icon" viewBox="0 0 64 64">
        <path d="M18 36a7 7 0 0 1 0-14h1A10.5 10.5 0 0 1 40 18a8.5 8.5 0 0 1 0 17H18z"
          fill="rgba(180,200,220,0.85)" className="cloud-body" />
        {[24, 34].map((x, i) => (
          <circle key={i} cx={x} cy="46" r="1.5"
            fill="rgba(120,180,255,0.7)" className="drizzle-dot"
            style={{ animationDelay: `${i * 0.3}s` }} />
        ))}
      </svg>
    ),
    Thunderstorm: (
      <svg className="weather-svg-icon thunder-icon" viewBox="0 0 64 64">
        <path d="M16 34a7 7 0 0 1 0-14h1A10.5 10.5 0 0 1 38 16a8.5 8.5 0 0 1 0 17H16z"
          fill="rgba(100,110,130,0.9)" className="cloud-body" />
        <polygon points="30,36 26,46 31,46 27,56 36,43 31,43 35,36"
          fill="#FFE066" className="lightning-bolt" />
      </svg>
    ),
    Snow: (
      <svg className="weather-svg-icon snow-icon" viewBox="0 0 64 64">
        <path d="M18 36a7 7 0 0 1 0-14h1A10.5 10.5 0 0 1 40 18a8.5 8.5 0 0 1 0 17H18z"
          fill="rgba(200,215,230,0.9)" className="cloud-body" />
        {[22, 30, 38].map((x, i) => (
          <text key={i} x={x} y="52" fontSize="8" fill="white" textAnchor="middle"
            className="snowflake" style={{ animationDelay: `${i * 0.25}s` }}>❄</text>
        ))}
      </svg>
    ),
    Mist: (
      <svg className="weather-svg-icon mist-icon" viewBox="0 0 64 64">
        {[24, 32, 40].map((y, i) => (
          <line key={i} x1="14" y1={y} x2="50" y2={y}
            stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round"
            className="mist-line" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </svg>
    ),
  };

  const fallback = icons.Clouds;
  return icons[condition] || fallback;
}

export default function WeatherCard({ data, unit }) {
  if (!data) return null;

  const temp = Math.round(convertTemp(data.temp, unit));
  const feelsLike = convertTemp(data.feelsLike, unit);
  const tempMin = convertTemp(data.tempMin, unit);
  const tempMax = convertTemp(data.tempMax, unit);
  const unitSymbol = unit === 'C' ? '°C' : '°F';

  return (
    <div className="weather-card" key={data.city + data.dt}>
      {/* Top section */}
      <div className="card-top">
        <div className="card-location">
          <h2 className="city-name">
            {data.city}
            <span className="country-flag">{getFlag(data.country)}</span>
          </h2>
          <span className="local-time">{formatTime(data.dt, data.timezone)}</span>
        </div>
        <div className="card-icon-wrapper">
          <WeatherIcon condition={data.condition} icon={data.icon} />
        </div>
      </div>

      {/* Temperature */}
      <div className="card-temp">
        <AnimatedTemp value={temp} />
        <span className="temp-unit">{unitSymbol}</span>
      </div>

      <p className="card-condition">{data.description}</p>

      <div className="card-range">
        <span>H: {Math.round(tempMax)}{unitSymbol}</span>
        <span className="range-dot">·</span>
        <span>L: {Math.round(tempMin)}{unitSymbol}</span>
      </div>

      {/* Divider */}
      <div className="card-divider" />

      {/* Detail Grid */}
      <div className="detail-grid">
        <DetailItem icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2v20M12 2a5 5 0 0 1 5 5c0 2-1 3-3 5s-2 4-2 6M12 2a5 5 0 0 0-5 5c0 2 1 3 3 5s2 4 2 6" strokeLinecap="round"/>
          </svg>
        } label="Feels Like" value={`${Math.round(feelsLike)}${unitSymbol}`} />
        <DetailItem icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        } label="Humidity" value={`${data.humidity}%`} />
        <DetailItem icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        } label="Wind" value={`${data.wind} m/s`} />
        <DetailItem icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round"/>
          </svg>
        } label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`} />
        <DetailItem icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 6v6l4 2" strokeLinecap="round"/>
          </svg>
        } label="Pressure" value={`${data.pressure} hPa`} />
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="detail-item">
      <div className="detail-item-icon">{icon}</div>
      <span className="detail-item-label">{label}</span>
      <span className="detail-item-value">{value}</span>
    </div>
  );
}
