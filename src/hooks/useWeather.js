import { useState, useCallback } from 'react';
import { fetchWeather } from '../services/weatherService';

export function useWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState(() => {
    return localStorage.getItem('weather-unit') || 'C';
  });

  const searchCity = useCallback(async (city) => {
    if (!city?.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(city);
      setWeatherData(data);
      setError(null);

      // Save to recent cities
      const recent = JSON.parse(localStorage.getItem('recent-cities') || '[]');
      const filtered = recent.filter(
        (c) => c.toLowerCase() !== data.city.toLowerCase()
      );
      filtered.unshift(data.city);
      localStorage.setItem(
        'recent-cities',
        JSON.stringify(filtered.slice(0, 5))
      );
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next = prev === 'C' ? 'F' : 'C';
      localStorage.setItem('weather-unit', next);
      return next;
    });
  }, []);

  return { weatherData, loading, error, unit, searchCity, toggleUnit };
}
