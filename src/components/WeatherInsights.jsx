export default function WeatherInsights({ weather, city, unitSymbol }) {
  const current = weather.current;
  const daily = weather.daily;

  const comfortScore = Math.max(
    0,
    Math.min(
      100,
      100 - Math.abs(current.apparent_temperature - 24) * 2 - Math.max(0, current.relative_humidity_2m - 65)
    )
  );

  const alerts = [];
  if ((current.uv_index || 0) >= 7) alerts.push('High UV: Use sunscreen and avoid direct sun at noon.');
  if ((current.wind_gusts_10m || 0) >= 35) alerts.push('Strong gusts expected: Secure loose outdoor items.');
  if ((daily.precipitation_sum?.[0] || 0) >= 15) alerts.push('Heavy rain likely today: Carry rain protection.');
  if (current.temperature_2m >= 36) alerts.push('Heat risk: Stay hydrated and avoid prolonged outdoor exposure.');
  if (alerts.length === 0) alerts.push('No severe weather signal right now.');

  const trend = daily.temperature_2m_max[1] - daily.temperature_2m_max[0];

  return (
    <section className="rounded-2xl border-4 border-black bg-white p-4 shadow-[8px_8px_0_#111111] lg:col-span-2">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-black text-black" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>Smart Insights</h3>
        <p className="text-xs font-semibold text-black/70">{city.name}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <article className="rounded-xl border-3 border-black bg-[#fff7cc] p-3">
          <p className="text-xs font-extrabold uppercase tracking-wide text-black/70">Comfort score</p>
          <p className="mt-1 text-2xl font-extrabold text-black">{Math.round(comfortScore)}/100</p>
          <p className="mt-1 text-xs font-semibold text-black/70">Based on feels-like and humidity</p>
        </article>

        <article className="rounded-xl border-3 border-black bg-[#f4f7ff] p-3">
          <p className="text-xs font-extrabold uppercase tracking-wide text-black/70">Tomorrow trend</p>
          <p className="mt-1 text-2xl font-extrabold text-black">
            {trend > 0 ? '+' : ''}{Math.round(trend)}{unitSymbol}
          </p>
          <p className="mt-1 text-xs font-semibold text-black/70">Compared to today's max temperature</p>
        </article>

        <article className="rounded-xl border-3 border-black bg-[#ecffef] p-3">
          <p className="text-xs font-extrabold uppercase tracking-wide text-black/70">Rain chance today</p>
          <p className="mt-1 text-2xl font-extrabold text-black">{Math.round(daily.precipitation_sum?.[0] || 0)} mm</p>
          <p className="mt-1 text-xs font-semibold text-black/70">Estimated daily precipitation</p>
        </article>
      </div>

      <div className="mt-3 rounded-xl border-3 border-black bg-[#ffb0b9] p-3">
        <p className="text-xs font-extrabold uppercase tracking-wide text-black/80">Advisories</p>
        <ul className="mt-2 space-y-1 text-sm font-semibold text-black">
          {alerts.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
