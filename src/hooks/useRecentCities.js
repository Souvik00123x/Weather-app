import { useState, useCallback } from 'react';

export function useRecentCities() {
  const [recentCities, setRecentCities] = useState(() => {
    return JSON.parse(localStorage.getItem('recent-cities') || '[]');
  });

  const refreshCities = useCallback(() => {
    setRecentCities(JSON.parse(localStorage.getItem('recent-cities') || '[]'));
  }, []);

  const clearCities = useCallback(() => {
    localStorage.removeItem('recent-cities');
    setRecentCities([]);
  }, []);

  return { recentCities, refreshCities, clearCities };
}
