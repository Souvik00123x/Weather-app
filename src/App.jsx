import { useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import { useRecentCities } from './hooks/useRecentCities';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import UnitToggle from './components/UnitToggle';
import RecentCities from './components/RecentCities';
import ErrorMessage from './components/ErrorMessage';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  const { weatherData, loading, error, unit, searchCity, toggleUnit } =
    useWeather();
  const { recentCities, refreshCities, clearCities } = useRecentCities();

  useEffect(() => {
    refreshCities();
  }, [weatherData, refreshCities]);

  return (
    <>
      <AnimatedBackground condition={weatherData?.condition || null} />
      <div className="app-container">
        <header className="app-header">
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="13" r="5" fill="#FFE066" />
                {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                  const rad = (angle * Math.PI) / 180;
                  return (
                    <line key={i}
                      x1={16 + 8 * Math.cos(rad)} y1={13 + 8 * Math.sin(rad)}
                      x2={16 + 10.5 * Math.cos(rad)} y2={13 + 10.5 * Math.sin(rad)}
                      stroke="#FFE066" strokeWidth="1.5" strokeLinecap="round" />
                  );
                })}
                <path d="M10 25a5 5 0 0 1 0-10h.5a8 8 0 0 1 15.5-2 6 6 0 0 1 0 12H10z"
                  fill="rgba(255,255,255,0.85)" />
              </svg>
            </div>
            <h1 className="app-title">WeatherNow</h1>
          </div>
          <UnitToggle unit={unit} onToggle={toggleUnit} />
        </header>

        <main className="app-main">
          <SearchBar onSearch={searchCity} loading={loading} />

          <RecentCities
            cities={recentCities}
            onSelect={searchCity}
            onClear={clearCities}
          />

          {loading && (
            <div className="loading-container">
              <div className="skeleton-card">
                <div className="skeleton-row skeleton-header">
                  <div className="skeleton-line w60" />
                  <div className="skeleton-circle" />
                </div>
                <div className="skeleton-line w40 skeleton-temp" />
                <div className="skeleton-line w50" />
                <div className="skeleton-divider" />
                <div className="skeleton-grid">
                  <div className="skeleton-box" />
                  <div className="skeleton-box" />
                  <div className="skeleton-box" />
                  <div className="skeleton-box" />
                </div>
              </div>
            </div>
          )}

          <ErrorMessage message={error} />

          {!loading && weatherData && (
            <WeatherCard data={weatherData} unit={unit} />
          )}

          {!weatherData && !loading && !error && (
            <div className="welcome-message">
              <div className="welcome-visual">
                <div className="welcome-ring ring-1" />
                <div className="welcome-ring ring-2" />
                <div className="welcome-ring ring-3" />
                <div className="welcome-center">
                  <svg viewBox="0 0 48 48" fill="none" className="welcome-icon-svg">
                    <circle cx="24" cy="24" r="18" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="4 4" />
                    <path d="M24 14v20M14 24h20" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="24" cy="24" r="4" fill="rgba(255,255,255,0.4)" />
                  </svg>
                </div>
              </div>
              <h2 className="welcome-title">Explore the Weather</h2>
              <p className="welcome-sub">Search for any city to see live weather conditions</p>
              <div className="welcome-hints">
                <span className="hint-chip">Try "Tokyo"</span>
                <span className="hint-chip">Try "London"</span>
                <span className="hint-chip">Try "New York"</span>
              </div>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>Powered by <span className="footer-highlight">OpenWeatherMap</span></p>
        </footer>
      </div>
    </>
  );
}

export default App;
