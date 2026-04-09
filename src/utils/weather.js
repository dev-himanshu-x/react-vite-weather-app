const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const REVERSE_GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/reverse';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';
const AIR_QUALITY_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const IP_GEO_API = 'https://ipapi.co/json/';

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

export async function reverseGeocode(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    count: '1',
    language: 'en',
    format: 'json',
  });

  const response = await fetch(`${REVERSE_GEOCODING_API}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to get current location details');
  }

  const data = await response.json();
  if (!data.results || data.results.length === 0) {
    throw new Error('Could not resolve your current location');
  }

  return data.results[0];
}

export async function fetchApproximateLocation() {
  const response = await fetch(IP_GEO_API);
  if (!response.ok) {
    throw new Error('Failed to fetch approximate location');
  }

  const data = await response.json();
  if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
    throw new Error('Approximate location is unavailable');
  }

  return {
    latitude: data.latitude,
    longitude: data.longitude,
    city: data.city || 'Approximate Location',
    region: data.region || null,
    country: data.country_name || 'Your Area',
  };
}

export async function fetchWeather(latitude, longitude, temperatureUnit = 'celsius') {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'wind_speed_10m',
      'wind_gusts_10m',
      'wind_direction_10m',
      'uv_index',
      'visibility',
    ].join(','),
    hourly: [
      'temperature_2m',
      'weather_code',
      'precipitation_probability',
      'wind_speed_10m',
      'relative_humidity_2m',
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
    timezone: 'auto',
    forecast_days: '7',
    temperature_unit: temperatureUnit,
  });

  const response = await fetch(`${WEATHER_API}?${params}`);

  if (!response.ok) {
    let reason = 'Failed to fetch weather data';
    try {
      const errorData = await response.json();
      if (errorData?.reason) reason = errorData.reason;
    } catch {
      reason = 'Failed to fetch weather data';
    }
    throw new Error(reason);
  }

  return response.json();
}

export async function fetchAirQuality(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'us_aqi',
      'pm2_5',
      'pm10',
      'ozone',
      'nitrogen_dioxide',
      'sulphur_dioxide',
      'carbon_monoxide',
    ].join(','),
    hourly: [
      'us_aqi',
      'pm2_5',
      'pm10',
    ].join(','),
    timezone: 'auto',
    forecast_days: '2',
  });

  const response = await fetch(`${AIR_QUALITY_API}?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch air quality data');
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

export function formatDateTime(dateStr, timezone) {
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone,
  });
}

export function formatHour(dateStr, timezone) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    hour12: true,
    timeZone: timezone,
  });
}

export function formatWindDirection(degrees) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return dirs[index];
}

export function getAqiLabel(aqi) {
  if (aqi <= 50) return { label: 'Good', color: 'bg-[#b3ff9f]' };
  if (aqi <= 100) return { label: 'Moderate', color: 'bg-[#fff7cc]' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'bg-[#ffd58a]' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'bg-[#ffb0b9]' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'bg-[#d8b4fe]' };
  return { label: 'Hazardous', color: 'bg-[#fca5a5]' };
}

export function getNextHourlySlots(weather, hours = 24) {
  const startIndex = weather.hourly.time.findIndex((time) => new Date(time) >= new Date(weather.current.time));
  const from = startIndex === -1 ? 0 : startIndex;
  return weather.hourly.time.slice(from, from + hours).map((time, index) => ({
    time,
    temperature: weather.hourly.temperature_2m[from + index],
    code: weather.hourly.weather_code[from + index],
    precipitationProbability: weather.hourly.precipitation_probability[from + index] || 0,
    wind: weather.hourly.wind_speed_10m[from + index] || 0,
    humidity: weather.hourly.relative_humidity_2m[from + index] || 0,
  }));
}
