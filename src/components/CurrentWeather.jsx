import { getWeatherInfo, formatTime, formatDateTime, formatWindDirection } from '../utils/weather';

export default function CurrentWeather({ weather, city, unitSymbol, isFavorite, onToggleFavorite }) {
  const current = weather.current;
  const daily = weather.daily;
  const info = getWeatherInfo(current.weather_code, current.is_day);

  const sunrise = formatTime(daily.sunrise[0]);
  const sunset = formatTime(daily.sunset[0]);
  const updatedAt = formatDateTime(current.time, weather.timezone);
  const windDirection = formatWindDirection(current.wind_direction_10m || 0);

  return (
    <section className="rounded-2xl border-4 border-black bg-white p-4 shadow-[8px_8px_0_#111111]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-black sm:text-2xl" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>{city.name}</h2>
          <p className="text-sm font-semibold text-black/80 sm:text-base">
            {city.admin1 ? `${city.admin1}, ` : ''}{city.country || 'India'}
          </p>
          <p className="mt-1 text-xs font-semibold text-black/60">Updated {updatedAt}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-3xl">{info.icon}</p>
          <button
            type="button"
            onClick={onToggleFavorite}
            className="rounded-xl border-3 border-black bg-[#b3ff9f] px-2.5 py-1 text-xs font-extrabold text-black shadow-[2px_2px_0_#111111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          >
            {isFavorite ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-3">
        <p className="text-4xl font-black leading-none text-black sm:text-5xl" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>{Math.round(current.temperature_2m)}{unitSymbol}</p>
        <p className="text-sm font-extrabold text-black/80 sm:pb-1">{info.description}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <StatItem label="Feels like" value={`${Math.round(current.apparent_temperature)}${unitSymbol}`} />
        <StatItem label="Humidity" value={`${current.relative_humidity_2m}%`} />
        <StatItem label="Wind" value={`${Math.round(current.wind_speed_10m)} km/h`} />
        <StatItem label="Wind direction" value={windDirection} />
        <StatItem label="Wind gust" value={`${Math.round(current.wind_gusts_10m || 0)} km/h`} />
        <StatItem label="Pressure" value={`${Math.round(current.pressure_msl)} hPa`} />
        <StatItem label="Cloud cover" value={`${current.cloud_cover}%`} />
        <StatItem label="UV index" value={current.uv_index?.toFixed(1) || 'N/A'} />
        <StatItem label="Visibility" value={`${Math.round((current.visibility || 0) / 1000)} km`} />
        <StatItem label="Rain" value={`${(current.rain || 0).toFixed(1)} mm`} />
        <StatItem label="Precipitation" value={`${(current.precipitation || 0).toFixed(1)} mm`} />
        <StatItem label="Sunrise" value={sunrise} />
        <StatItem label="Sunset" value={sunset} />
        <StatItem label="High" value={`${Math.round(daily.temperature_2m_max[0])}${unitSymbol}`} />
        <StatItem label="Low" value={`${Math.round(daily.temperature_2m_min[0])}${unitSymbol}`} />
      </div>
    </section>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="rounded-xl border-3 border-black bg-[#f4f7ff] px-3 py-2">
      <p className="text-xs font-extrabold text-black/60">{label}</p>
      <p className="mt-0.5 text-sm font-extrabold text-black">{value}</p>
    </div>
  );
}
