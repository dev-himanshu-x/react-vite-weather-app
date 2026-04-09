import { getAqiLabel } from '../utils/weather';

export default function AirQualityPanel({ airQuality }) {
  if (!airQuality?.current) return null;

  const current = airQuality.current;
  const aqi = Math.round(current.us_aqi ?? 0);
  const aqiMeta = getAqiLabel(aqi);

  return (
    <section className="rounded-2xl border-4 border-black bg-white p-4 shadow-[8px_8px_0_#111111]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-lg font-black text-black" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>Air Quality</h3>
        <span className={`rounded-lg border-2 border-black px-2 py-1 text-xs font-extrabold text-black ${aqiMeta.color}`}>
          {aqiMeta.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Metric label="US AQI" value={aqi} />
        <Metric label="PM2.5" value={`${Math.round(current.pm2_5 ?? 0)} µg/m3`} />
        <Metric label="PM10" value={`${Math.round(current.pm10 ?? 0)} µg/m3`} />
        <Metric label="Ozone" value={`${Math.round(current.ozone ?? 0)} µg/m3`} />
        <Metric label="NO2" value={`${Math.round(current.nitrogen_dioxide ?? 0)} µg/m3`} />
        <Metric label="SO2" value={`${Math.round(current.sulphur_dioxide ?? 0)} µg/m3`} />
      </div>
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <article className="rounded-xl border-3 border-black bg-[#f4f7ff] p-2">
      <p className="text-xs font-extrabold text-black/60">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-black">{value}</p>
    </article>
  );
}
