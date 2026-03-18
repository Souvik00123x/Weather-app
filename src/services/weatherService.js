const API_KEY = '4d8fb5b93d4af21d66a2948710284366'; // Free OpenWeatherMap key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export async function fetchWeather(city) {
  if (!city || !city.trim()) {
    throw new Error('Please enter a city name');
  }

  const url = `${BASE_URL}?q=${encodeURIComponent(city.trim())}&appid=${API_KEY}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`City "${city}" not found. Please check the spelling and try again.`);
    }
    if (response.status === 401) {
      throw new Error('API key issue. Please check your OpenWeatherMap API key.');
    }
    throw new Error('Failed to fetch weather data. Please try again later.');
  }

  const data = await response.json();

  return {
    city: data.name,
    country: data.sys.country,
    temp: data.main.temp,
    feelsLike: data.main.feels_like,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,
    humidity: data.main.humidity,
    wind: data.wind.speed,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    dt: data.dt,
    timezone: data.timezone,
    pressure: data.main.pressure,
    visibility: data.visibility,
  };
}

export function convertTemp(tempC, unit) {
  if (unit === 'F') {
    return (tempC * 9) / 5 + 32;
  }
  return tempC;
}

export function getWeatherTheme(condition) {
  const themes = {
    Clear: { gradient: ['#0f2027', '#203a43', '#2c5364'], particle: 'sun' },
    Clouds: { gradient: ['#3a6073', '#16222a'], particle: 'clouds' },
    Rain: { gradient: ['#0f0c29', '#302b63', '#24243e'], particle: 'rain' },
    Drizzle: { gradient: ['#373b44', '#4286f4'], particle: 'rain' },
    Thunderstorm: { gradient: ['#0f0c29', '#1a1a2e', '#16213e'], particle: 'thunder' },
    Snow: { gradient: ['#e6dada', '#274046'], particle: 'snow' },
    Mist: { gradient: ['#3e5151', '#decba4'], particle: 'mist' },
    Haze: { gradient: ['#3e5151', '#decba4'], particle: 'mist' },
    Fog: { gradient: ['#3e5151', '#decba4'], particle: 'mist' },
    Smoke: { gradient: ['#56ab2f', '#a8e063'], particle: 'mist' },
    Dust: { gradient: ['#c9d6ff', '#e2e2e2'], particle: 'mist' },
    default: { gradient: ['#0f2027', '#203a43', '#2c5364'], particle: 'clouds' },
  };
  return themes[condition] || themes.default;
}
