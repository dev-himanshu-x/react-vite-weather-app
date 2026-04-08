import { getWeatherInfo, getDayName } from '../utils/weather';

export default function Forecast({ weather }) {
  const daily = weather.daily;

  return (
    <section className="rounded-xl border-4 border-black bg-white p-4 shadow-[8px_8px_0_#111111]">
      <h3 className="mb-3 text-lg font-extrabold text-black">7-Day Forecast</h3>
      <div className="space-y-2">
        {daily.time.map((date, index) => {
          const info = getWeatherInfo(daily.weather_code[index]);
          const maxTemp = Math.round(daily.temperature_2m_max[index]);
          const minTemp = Math.round(daily.temperature_2m_min[index]);
          const dayName = getDayName(date);

          return (
            <div
              key={date}
              className="flex items-center justify-between gap-2 rounded-lg border-4 border-black bg-[#fff7cc] px-3 py-2"
            >
              <p className="w-18 text-sm font-bold text-black sm:w-20">{dayName}</p>
              <p className="w-8 text-center text-xl">{info.icon}</p>
              <p className="hidden flex-1 text-sm text-black/80 sm:block">{info.description}</p>
              <p className="whitespace-nowrap text-sm font-bold text-black">
                {minTemp}° / {maxTemp}°
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
