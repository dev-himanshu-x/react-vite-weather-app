import { getWeatherInfo, formatTime } from '../utils/weather';

export default function CurrentWeather({ weather, city }) {
  const current = weather.current;
  const daily = weather.daily;
  const info = getWeatherInfo(current.weather_code, current.is_day);

  const sunrise = formatTime(daily.sunrise[0]);
  const sunset = formatTime(daily.sunset[0]);

  return (
    <section className="rounded-xl border-4 border-black bg-white p-4 shadow-[8px_8px_0_#111111]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-black sm:text-2xl">{city.name}</h2>
          <p className="text-sm text-black/80 sm:text-base">
            {city.admin1 ? `${city.admin1}, ` : ''}India
          </p>
        </div>
        <p className="text-3xl">{info.icon}</p>
      </div>

      <div className="mt-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-3">
        <p className="text-4xl font-extrabold leading-none text-black sm:text-5xl">{Math.round(current.temperature_2m)}°C</p>
        <p className="text-sm font-semibold text-black/90 sm:pb-1">{info.description}</p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <StatItem label="Feels like" value={`${Math.round(current.apparent_temperature)}°C`} />
        <StatItem label="Humidity" value={`${current.relative_humidity_2m}%`} />
        <StatItem label="Wind" value={`${Math.round(current.wind_speed_10m)} km/h`} />
        <StatItem label="Pressure" value={`${Math.round(current.pressure_msl)} hPa`} />
        <StatItem label="Cloud cover" value={`${current.cloud_cover}%`} />
        <StatItem label="UV index" value={current.uv_index?.toFixed(1) || 'N/A'} />
        <StatItem label="Sunrise" value={sunrise} />
        <StatItem label="Sunset" value={sunset} />
        <StatItem label="High" value={`${Math.round(daily.temperature_2m_max[0])}°`} />
        <StatItem label="Low" value={`${Math.round(daily.temperature_2m_min[0])}°`} />
      </div>
    </section>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="rounded-lg border-4 border-black bg-[#f7fbff] px-3 py-2">
      <p className="text-xs font-semibold text-black/80">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-black">{value}</p>
    </div>
  );
}
