const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export async function searchCity(query) {
  const response = await fetch(
    `${GEOCODING_API}?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
  );

  if (!response.ok) {
    throw new Error('Failed to search for location');
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`No place found with name "${query}" in India`);
  }

  const indianCities = data.results.filter(
    (city) => city.country_code === 'IN'
  );

  if (indianCities.length === 0) {
    throw new Error(`"${query}" was not found in India. Please search for an Indian city.`);
  }

  return indianCities[0];
}

export async function fetchWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'wind_speed_10m',
      'uv_index',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'Asia/Kolkata',
    forecast_days: '7',
  });

  const response = await fetch(`${WEATHER_API}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  return response.json();
}

export function getWeatherInfo(code, isDay = true) {
  const weatherMap = {
    0: { description: 'Clear sky', icon: isDay ? '☀️' : '🌙' },
    1: { description: 'Mainly clear', icon: isDay ? '🌤️' : '🌙' },
    2: { description: 'Partly cloudy', icon: '⛅' },
    3: { description: 'Overcast', icon: '☁️' },
    45: { description: 'Foggy', icon: '🌫️' },
    48: { description: 'Depositing rime fog', icon: '🌫️' },
    51: { description: 'Light drizzle', icon: '🌦️' },
    53: { description: 'Moderate drizzle', icon: '🌦️' },
    55: { description: 'Dense drizzle', icon: '🌧️' },
    61: { description: 'Slight rain', icon: '🌧️' },
    63: { description: 'Moderate rain', icon: '🌧️' },
    65: { description: 'Heavy rain', icon: '🌧️' },
    71: { description: 'Slight snow', icon: '🌨️' },
    73: { description: 'Moderate snow', icon: '❄️' },
    75: { description: 'Heavy snow', icon: '❄️' },
    77: { description: 'Snow grains', icon: '🌨️' },
    80: { description: 'Slight rain showers', icon: '🌦️' },
    81: { description: 'Moderate rain showers', icon: '🌧️' },
    82: { description: 'Violent rain showers', icon: '⛈️' },
    85: { description: 'Slight snow showers', icon: '🌨️' },
    86: { description: 'Heavy snow showers', icon: '❄️' },
    95: { description: 'Thunderstorm', icon: '⛈️' },
    96: { description: 'Thunderstorm with hail', icon: '⛈️' },
    99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
  };

  return weatherMap[code] || { description: 'Unknown', icon: '🌡️' };
}

export function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function getDayName(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

  return date.toLocaleDateString('en-IN', { weekday: 'short' });
}
