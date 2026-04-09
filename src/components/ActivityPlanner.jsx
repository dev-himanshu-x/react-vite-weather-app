import { formatHour, getNextHourlySlots } from '../utils/weather';

function getTempScore(temp, unitSymbol) {
  const minComfort = unitSymbol === '°F' ? 64 : 18;
  const maxComfort = unitSymbol === '°F' ? 86 : 30;

  if (temp >= minComfort && temp <= maxComfort) return 40;
  const delta = temp < minComfort ? minComfort - temp : temp - maxComfort;
  return Math.max(5, 40 - delta * 3);
}

function getOutdoorScore(slot, unitSymbol) {
  const tempScore = getTempScore(slot.temperature, unitSymbol);
  const rainScore = Math.max(0, 35 - slot.rainProbability * 0.5);
  const windScore = Math.max(0, 15 - slot.wind * 0.4);
  const humidityScore = Math.max(0, 10 - Math.max(0, slot.humidity - 70) * 0.25);
  return Math.round(tempScore + rainScore + windScore + humidityScore);
}

function scoreLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Moderate';
  return 'Risky';
}

export default function ActivityPlanner({ weather, city, unitSymbol }) {
  const candidates = getNextHourlySlots(weather, 24)
    .map((slot) => ({ ...slot, score: getOutdoorScore(slot, unitSymbol) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <section className="rounded-2xl border-4 border-black bg-white p-4 shadow-[8px_8px_0_#111111] lg:col-span-2">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-lg font-black text-black" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>
          Outdoor Planner (Next 24h)
        </h3>
        <p className="text-xs font-semibold text-black/70">{city.name}</p>
      </div>

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        {candidates.map((slot) => (
          <article key={slot.time} className="rounded-xl border-3 border-black bg-[#f4f7ff] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-extrabold text-black">{formatHour(slot.time, weather.timezone)}</p>
              <span className="rounded-lg border-2 border-black bg-white px-2 py-0.5 text-xs font-extrabold text-black">
                {scoreLabel(slot.score)}
              </span>
            </div>
            <p className="mt-1 text-xl font-black text-black">{slot.score}/100</p>
            <p className="mt-1 text-xs font-semibold text-black/80">
              Temp {Math.round(slot.temperature)}{unitSymbol} | Rain {Math.round(slot.rainProbability)}% | Wind {Math.round(slot.wind)} km/h
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
