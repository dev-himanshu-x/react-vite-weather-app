import { getWeatherInfo, getDayName } from '../utils/weather';

export default function Forecast({ weather, unitSymbol }) {
  const daily = weather.daily;

  return (
    <section className="rounded-2xl border-4 border-black bg-white p-4 shadow-[8px_8px_0_#111111]">
      <h3 className="mb-3 text-lg font-black text-black" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>7-Day Forecast</h3>
      <div className="space-y-2">
        {daily.time.map((date, index) => {
          const info = getWeatherInfo(daily.weather_code[index]);
          const maxTemp = Math.round(daily.temperature_2m_max[index]);
          const minTemp = Math.round(daily.temperature_2m_min[index]);
          const dayName = getDayName(date);

          return (
            <div
              key={date}
              className="flex items-center justify-between gap-2 rounded-xl border-3 border-black bg-[#fff7cc] px-3 py-2"
            >
              <p className="w-18 text-sm font-extrabold text-black sm:w-20">{dayName}</p>
              <p className="w-8 text-center text-xl">{info.icon}</p>
              <p className="hidden flex-1 text-sm font-semibold text-black/70 sm:block">{info.description}</p>
              <div className="text-right">
                <p className="whitespace-nowrap text-sm font-extrabold text-black">
                  {minTemp}{unitSymbol} / {maxTemp}{unitSymbol}
                </p>
                <p className="hidden text-xs font-semibold text-black/70 sm:block">
                  Rain {daily.precipitation_sum[index]} mm | Wind {Math.round(daily.wind_speed_10m_max[index])} km/h
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
