import { useState, useCallback } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import ErrorMessage from './components/ErrorMessage';
import { searchCity, fetchWeather } from './utils/weather';
import logo from './assets/weather-logo.svg';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('');

  const handleSearch = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    setLastQuery(query);

    try {
      const cityData = await searchCity(query);
      const weatherData = await fetchWeather(cityData.latitude, cityData.longitude);

      setCity(cityData);
      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setCity(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDismissError = () => setError(null);
  const handleRetry = () => lastQuery && handleSearch(lastQuery);

  return (
    <div
      className="min-h-screen w-full bg-[#ffd34d] p-3 sm:p-4"
      style={{
        backgroundImage:
          'linear-gradient(0deg, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="min-h-[calc(100vh-1.5rem)] w-full flex flex-col gap-4">
        <header className="rounded-xl border-4 border-black bg-white p-4 shadow-[8px_8px_0_#111111]">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Weather App logo" className="h-14 w-14 shrink-0 sm:h-16 sm:w-16" />
            <div>
              <h1 className="text-2xl font-bold leading-tight text-black sm:text-3xl">Weather App</h1>
              <p className="text-sm text-black/80 sm:text-base">Simple forecast for Indian cities</p>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} onFocus={handleDismissError} />

          {isLoading && !weather && (
            <p className="text-center text-base font-semibold text-black">Loading weather data...</p>
          )}

          {error && (
            <ErrorMessage
              message={error}
              onDismiss={handleDismissError}
              onRetry={handleRetry}
            />
          )}

          {weather && city && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <CurrentWeather weather={weather} city={city} />
              <Forecast weather={weather} />
            </div>
          )}
        </main>

        <footer className="rounded-xl border-4 border-black bg-white px-4 py-3 text-center text-sm text-black shadow-[6px_6px_0_#111111]">
          Weather data from{' '}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Open-Meteo
          </a>
        </footer>
      </div>
    </div>
  );
}
