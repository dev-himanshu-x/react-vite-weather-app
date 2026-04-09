import { getWeatherInfo, formatHour, getNextHourlySlots } from '../utils/weather';

export default function HourlyForecast({ weather, unitSymbol }) {
  const timezone = weather.timezone;
  const next24 = getNextHourlySlots(weather, 24);

  return (
    <section className="rounded-2xl border-4 border-black bg-white p-4 shadow-[8px_8px_0_#111111]">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="mb-3 text-lg font-black text-black" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>24-Hour Timeline</h3>
        <p className="text-xs font-semibold text-black/70">{timezone}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {next24.map((hour) => {
          const info = getWeatherInfo(hour.code, true);
          return (
            <article
              key={hour.time}
              className="min-w-34 rounded-xl border-3 border-black bg-[#e8f9ff] p-3 sm:min-w-36"
            >
              <p className="text-xs font-extrabold text-black/70">{formatHour(hour.time, timezone)}</p>
              <p className="mt-1 text-xl">{info.icon}</p>
              <p className="mt-1 text-lg font-extrabold text-black">{Math.round(hour.temperature)}{unitSymbol}</p>
              <p className="mt-1 text-xs font-semibold text-black/80">Rain {hour.precipitationProbability || 0}%</p>
              <p className="text-xs font-semibold text-black/80">Wind {Math.round(hour.wind || 0)} km/h</p>
              <p className="text-xs font-semibold text-black/80">Humidity {hour.humidity || 0}%</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
