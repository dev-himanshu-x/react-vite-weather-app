import { getNextHourlySlots } from '../utils/weather';

const CHART_HEIGHT = 160;
const CHART_WIDTH = 720;

function toPoints(values) {
  const cleaned = values.filter((value) => Number.isFinite(value));
  if (cleaned.length === 0) return '';

  const max = Math.max(...cleaned);
  const min = Math.min(...cleaned);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * CHART_WIDTH;
      const normalized = (value - min) / range;
      const y = CHART_HEIGHT - normalized * CHART_HEIGHT;
      return `${x},${y}`;
    })
    .join(' ');
}

export default function TrendChart({ weather, unitSymbol }) {
  const next24 = getNextHourlySlots(weather, 24);
  const tempPoints = toPoints(next24.map((item) => item.temperature));
  const rainPoints = toPoints(next24.map((item) => item.precipitationProbability));
  const windPoints = toPoints(next24.map((item) => item.wind));

  return (
    <section className="rounded-2xl border-4 border-black bg-white p-4 shadow-[8px_8px_0_#111111] lg:col-span-2">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-lg font-black text-black" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>Trend Chart (Next 24h)</h3>
        <p className="text-xs font-semibold text-black/70">Temp, Rain %, Wind</p>
      </div>

      <div className="rounded-xl border-3 border-black bg-[#e8f9ff] p-3">
        <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} className="h-40 w-full">
          <polyline fill="none" stroke="#0f172a" strokeWidth="4" points={tempPoints} />
          <polyline fill="none" stroke="#fb7185" strokeWidth="3" points={rainPoints} />
          <polyline fill="none" stroke="#38bdf8" strokeWidth="3" points={windPoints} />
        </svg>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Legend title="Temperature" color="bg-black" value={`${Math.round(next24[0]?.temperature ?? 0)}${unitSymbol} now`} />
        <Legend title="Rain Probability" color="bg-[#ff5d73]" value={`${Math.round(next24[0]?.precipitationProbability ?? 0)}% now`} />
        <Legend title="Wind" color="bg-[#0ea5e9]" value={`${Math.round(next24[0]?.wind ?? 0)} km/h now`} />
      </div>
    </section>
  );
}

function Legend({ title, color, value }) {
  return (
    <article className="rounded-xl border-3 border-black bg-white p-2">
      <div className="flex items-center gap-2">
        <span className={`h-3 w-3 rounded-sm border border-black ${color}`} />
        <p className="text-xs font-extrabold text-black/70">{title}</p>
      </div>
      <p className="mt-1 text-sm font-extrabold text-black">{value}</p>
    </article>
  );
}
