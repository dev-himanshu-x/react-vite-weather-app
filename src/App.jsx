import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import HourlyForecast from './components/HourlyForecast';
import WeatherInsights from './components/WeatherInsights';
import AirQualityPanel from './components/AirQualityPanel';
import TrendChart from './components/TrendChart';
import AlertCenter from './components/AlertCenter';
import ActivityPlanner from './components/ActivityPlanner';
import ErrorMessage from './components/ErrorMessage';
import { searchCity, fetchWeather, reverseGeocode, fetchApproximateLocation, fetchAirQuality } from './utils/weather';
import logo from './assets/weather-logo.svg';

const RECENT_KEY = 'weather-app-recent-searches';
const FAVORITES_KEY = 'weather-app-favorites';
const ALERT_RULES_KEY = 'weather-app-alert-rules';

function getGeolocationErrorMessage(error) {
  if (!error) return 'Could not detect your location.';
  if (error.code === 1) return 'Location permission denied. Allow location in browser site settings and try again.';
  if (error.code === 2) return 'Location unavailable right now. Check GPS/network and retry.';
  if (error.code === 3) return 'Location request timed out. Please try again.';
  return 'Could not detect your location.';
}

export default function App() {
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [city, setCity] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');
  const [recentSearches, setRecentSearches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [searchClearToken, setSearchClearToken] = useState(0);
  const [alertRules, setAlertRules] = useState({ rainProbability: 60, temperatureHigh: 38, aqiHigh: 120 });
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );
  const lastNotifiedRef = useRef('');

  const unitSymbol = useMemo(() => (temperatureUnit === 'celsius' ? '°C' : '°F'), [temperatureUnit]);

  useEffect(() => {
    const savedRecent = localStorage.getItem(RECENT_KEY);
    const savedFavorites = localStorage.getItem(FAVORITES_KEY);
    const savedRules = localStorage.getItem(ALERT_RULES_KEY);

    try {
      if (savedRecent) {
        setRecentSearches(JSON.parse(savedRecent));
      }
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
      if (savedRules) {
        setAlertRules(JSON.parse(savedRules));
      }
    } catch {
      setRecentSearches([]);
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(ALERT_RULES_KEY, JSON.stringify(alertRules));
  }, [alertRules]);

  const getTriggeredAlerts = useCallback((weatherData, airData, rules) => {
    const triggered = [];
    const current = weatherData?.current;
    if (!current) return triggered;

    const hourly = weatherData?.hourly;
    if (hourly?.precipitation_probability?.length) {
      const maxRain = Math.max(...hourly.precipitation_probability.slice(0, 6));
      if (maxRain >= rules.rainProbability) {
        triggered.push(`Rain risk high in next hours (${Math.round(maxRain)}%)`);
      }
    }

    if ((current.temperature_2m || 0) >= rules.temperatureHigh) {
      triggered.push(`Temperature is high (${Math.round(current.temperature_2m)}${unitSymbol})`);
    }

    const aqi = airData?.current?.us_aqi;
    if (typeof aqi === 'number' && aqi >= rules.aqiHigh) {
      triggered.push(`Air quality is unhealthy (AQI ${Math.round(aqi)})`);
    }

    return triggered;
  }, [unitSymbol]);

  const activeAlerts = useMemo(
    () => getTriggeredAlerts(weather, airQuality, alertRules),
    [weather, airQuality, alertRules, getTriggeredAlerts]
  );

  const addToRecent = useCallback((cityData, queryLabel) => {
    setRecentSearches((prev) => {
      const normalized = {
        ...cityData,
        searchLabel: queryLabel || cityData.searchLabel || cityData.name,
      };
      const next = [
        normalized,
        ...prev.filter((item) => !(item.latitude === cityData.latitude && item.longitude === cityData.longitude)),
      ];
      return next.slice(0, 6);
    });
  }, []);

  const loadWeatherByCity = useCallback(async (cityData, queryLabel = cityData.name) => {
    const [weatherData, airData] = await Promise.all([
      fetchWeather(cityData.latitude, cityData.longitude, temperatureUnit),
      fetchAirQuality(cityData.latitude, cityData.longitude).catch(() => null),
    ]);
    setCity(cityData);
    setWeather(weatherData);
    setAirQuality(airData);
    setLastQuery(queryLabel);
    addToRecent(cityData, queryLabel);
  }, [addToRecent, temperatureUnit]);

  const handleSearch = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    setLastQuery(query);

    try {
      const cityData = await searchCity(query);
      await loadWeatherByCity(cityData, query);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [loadWeatherByCity]);

  const handleSelectSavedCity = useCallback(async (cityData) => {
    setIsLoading(true);
    setError(null);

    try {
      await loadWeatherByCity(cityData, cityData.name);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [loadWeatherByCity]);

  const handleUseLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    const options = { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 };

    const loadByCoordinates = async (latitude, longitude, label = 'Current Location', region = null, country = 'Your Area') => {
      let cityData;
      try {
        cityData = await reverseGeocode(latitude, longitude);
      } catch {
        cityData = {
          name: label,
          admin1: region,
          country,
          latitude,
          longitude,
          searchLabel: label,
        };
      }

      await loadWeatherByCity(cityData, cityData.searchLabel || cityData.name);
    };

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        await loadByCoordinates(latitude, longitude);
      } catch (err) {
        setError(err.message || 'Failed to load weather for your location');
      } finally {
        setIsLoading(false);
      }
    }, (geoError) => {
      (async () => {
        try {
          const approx = await fetchApproximateLocation();
          await loadByCoordinates(
            approx.latitude,
            approx.longitude,
            approx.city,
            approx.region,
            approx.country
          );
        } catch {
          setError(getGeolocationErrorMessage(geoError));
        } finally {
          setIsLoading(false);
        }
      })();
    }, options);
  }, [loadWeatherByCity]);

  const handleToggleFavorite = useCallback(() => {
    if (!city) return;

    setFavorites((prev) => {
      const exists = prev.some((item) => item.latitude === city.latitude && item.longitude === city.longitude);
      if (exists) {
        return prev.filter((item) => !(item.latitude === city.latitude && item.longitude === city.longitude));
      }
      return [city, ...prev].slice(0, 8);
    });
  }, [city]);

  const handleTemperatureUnitChange = useCallback(async (nextUnit) => {
    if (nextUnit === temperatureUnit) return;

    setTemperatureUnit(nextUnit);
    if (!city) return;

    setIsLoading(true);
    setError(null);

    try {
      const [weatherData, airData] = await Promise.all([
        fetchWeather(city.latitude, city.longitude, nextUnit),
        fetchAirQuality(city.latitude, city.longitude).catch(() => null),
      ]);
      setWeather(weatherData);
      setAirQuality(airData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [city, temperatureUnit]);

  const handleRefreshWeather = useCallback(async () => {
    if (!city) return;

    setIsLoading(true);
    setError(null);

    try {
      const [weatherData, airData] = await Promise.all([
        fetchWeather(city.latitude, city.longitude, temperatureUnit),
        fetchAirQuality(city.latitude, city.longitude).catch(() => null),
      ]);
      setWeather(weatherData);
      setAirQuality(airData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [city, temperatureUnit]);

  useEffect(() => {
    if (!autoRefresh || !city) return;

    const id = setInterval(() => {
      handleRefreshWeather();
    }, 300000);

    return () => clearInterval(id);
  }, [autoRefresh, city, handleRefreshWeather]);

  const handleShareReport = useCallback(async () => {
    if (!weather || !city) return;

    const current = weather.current;
    const aqi = airQuality?.current?.us_aqi;
    const text = `${city.name}: ${Math.round(current.temperature_2m)}${unitSymbol}, feels like ${Math.round(current.apparent_temperature)}${unitSymbol}, humidity ${current.relative_humidity_2m}%, wind ${Math.round(current.wind_speed_10m)} km/h${typeof aqi === 'number' ? `, AQI ${Math.round(aqi)}` : ''}.`;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      setError('Could not copy report. Please copy manually.');
    }
  }, [weather, city, unitSymbol, airQuality]);

  const handleEnableNotifications = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      setNotificationPermission('unsupported');
      setError('Browser notifications are not supported on this device.');
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    if (permission !== 'granted') {
      setError('Notifications are blocked. Allow them in browser settings to enable alerts.');
    }
  }, []);

  useEffect(() => {
    if (notificationPermission !== 'granted') return;
    if (!city || activeAlerts.length === 0) return;

    const signature = `${city.name}|${activeAlerts.join('|')}`;
    if (lastNotifiedRef.current === signature) return;

    new Notification(`Weather Alert: ${city.name}`, {
      body: activeAlerts.slice(0, 2).join(' | '),
    });

    lastNotifiedRef.current = signature;
  }, [notificationPermission, city, activeAlerts]);

  const handleDismissError = () => setError(null);
  const handleDismissErrorAndClearSearch = () => {
    setError(null);
    setSearchClearToken((token) => token + 1);
  };
  const handleRetry = () => lastQuery && handleSearch(lastQuery);
  const isFavorite = !!city && favorites.some((item) => item.latitude === city.latitude && item.longitude === city.longitude);

  return (
    <div
      className="min-h-screen w-full p-3 sm:p-5"
      style={{
        backgroundColor: '#ffd84d',
        backgroundImage: 'linear-gradient(0deg, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }}
    >
      <div className="min-h-[calc(100vh-1.5rem)] w-full flex flex-col gap-4">
        <header className="rounded-2xl border-4 border-black bg-[#fff8e6] p-4 shadow-[8px_8px_0_#111111] md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Weather App logo" className="h-12 w-12 shrink-0 sm:h-14 sm:w-14" />
              <div>
                <h1 className="text-2xl font-black leading-tight text-black sm:text-3xl" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>Weather App</h1>
                <p className="text-sm font-semibold text-black/80 sm:text-base">Advanced live weather intelligence for Indian cities</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleTemperatureUnitChange('celsius')}
                className={`rounded-xl border-3 border-black px-3 py-1.5 text-sm font-extrabold text-black shadow-[3px_3px_0_#111111] transition ${temperatureUnit === 'celsius' ? 'bg-[#fff7cc]' : 'bg-white hover:bg-[#f4f4f4]'}`}
              >
                Celsius
              </button>
              <button
                type="button"
                onClick={() => handleTemperatureUnitChange('fahrenheit')}
                className={`rounded-xl border-3 border-black px-3 py-1.5 text-sm font-extrabold text-black shadow-[3px_3px_0_#111111] transition ${temperatureUnit === 'fahrenheit' ? 'bg-[#fff7cc]' : 'bg-white hover:bg-[#f4f4f4]'}`}
              >
                Fahrenheit
              </button>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4">
          <SearchBar
            key={searchClearToken}
            onSearch={handleSearch}
            isLoading={isLoading}
            onFocus={handleDismissError}
            onUseLocation={handleUseLocation}
            recentSearches={recentSearches}
            favorites={favorites}
            onSelectRecent={handleSelectSavedCity}
            onSelectFavorite={handleSelectSavedCity}
          />

          {city && weather && (
            <section className="rounded-2xl border-4 border-black bg-white p-3 shadow-[8px_8px_0_#111111]">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleRefreshWeather}
                  disabled={isLoading}
                  className="rounded-xl border-3 border-black bg-white px-3 py-1.5 text-sm font-extrabold text-black shadow-[3px_3px_0_#111111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none disabled:opacity-60"
                >
                  Refresh now
                </button>
                <button
                  type="button"
                  onClick={() => setAutoRefresh((value) => !value)}
                  className={`rounded-xl border-3 border-black px-3 py-1.5 text-sm font-extrabold text-black shadow-[3px_3px_0_#111111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none ${autoRefresh ? 'bg-[#b3ff9f]' : 'bg-white hover:bg-[#f4f4f4]'}`}
                >
                  {autoRefresh ? 'Auto-refresh on (5m)' : 'Auto-refresh off'}
                </button>
                <button
                  type="button"
                  onClick={handleShareReport}
                  className="rounded-xl border-3 border-black bg-[#fff7cc] px-3 py-1.5 text-sm font-extrabold text-black shadow-[3px_3px_0_#111111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                >
                  Copy report
                </button>
              </div>
            </section>
          )}

          {isLoading && !weather && (
            <p className="text-center text-base font-extrabold text-black">Loading weather data...</p>
          )}

          {error && (
            <ErrorMessage
              message={error}
              onDismiss={handleDismissErrorAndClearSearch}
              onRetry={handleRetry}
            />
          )}

          {weather && city && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <CurrentWeather
                weather={weather}
                city={city}
                unitSymbol={unitSymbol}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
              <Forecast weather={weather} unitSymbol={unitSymbol} />
              <AirQualityPanel airQuality={airQuality} />
              <HourlyForecast weather={weather} unitSymbol={unitSymbol} />
              <TrendChart weather={weather} unitSymbol={unitSymbol} />
              <ActivityPlanner weather={weather} city={city} unitSymbol={unitSymbol} />
              <AlertCenter
                rules={alertRules}
                onRulesChange={setAlertRules}
                notificationPermission={notificationPermission}
                onEnableNotifications={handleEnableNotifications}
                activeAlerts={activeAlerts}
              />
              <WeatherInsights weather={weather} city={city} unitSymbol={unitSymbol} />
            </div>
          )}
        </main>

        <footer className="rounded-2xl border-4 border-black bg-[#fff8e6] px-4 py-3 text-center text-sm font-semibold text-black/80 shadow-[8px_8px_0_#111111]">
          Weather data from{' '}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-extrabold text-black underline"
          >
            Open-Meteo
          </a>
        </footer>
      </div>
    </div>
  );
}
