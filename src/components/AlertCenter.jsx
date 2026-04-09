export default function AlertCenter({
  rules,
  onRulesChange,
  notificationPermission,
  onEnableNotifications,
  activeAlerts,
}) {
  return (
    <section className="rounded-2xl border-4 border-black bg-white p-4 shadow-[8px_8px_0_#111111] lg:col-span-2">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-black text-black" style={{ fontFamily: 'Outfit, Inter, sans-serif' }}>Alert Rules</h3>
        <button
          type="button"
          onClick={onEnableNotifications}
          className="rounded-lg border-2 border-black bg-[#ffec8a] px-3 py-1 text-xs font-extrabold text-black shadow-[2px_2px_0_#111111]"
        >
          Notifications: {notificationPermission}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <RuleSlider
          label="Rain probability threshold"
          value={rules.rainProbability}
          min={20}
          max={100}
          unit="%"
          onChange={(value) => onRulesChange({ ...rules, rainProbability: value })}
        />
        <RuleSlider
          label="High temperature threshold"
          value={rules.temperatureHigh}
          min={28}
          max={50}
          unit="°"
          onChange={(value) => onRulesChange({ ...rules, temperatureHigh: value })}
        />
        <RuleSlider
          label="AQI threshold"
          value={rules.aqiHigh}
          min={50}
          max={300}
          unit="AQI"
          onChange={(value) => onRulesChange({ ...rules, aqiHigh: value })}
        />
      </div>

      <div className="mt-3 rounded-xl border-3 border-black bg-[#ffb0b9] p-3">
        <p className="text-xs font-extrabold uppercase tracking-wide text-black/80">Active alerts</p>
        <ul className="mt-2 space-y-1 text-sm font-semibold text-black">
          {activeAlerts.length === 0 && <li>- No active alert based on current rules.</li>}
          {activeAlerts.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RuleSlider({ label, value, min, max, unit, onChange }) {
  return (
    <article className="rounded-xl border-3 border-black bg-[#f4f7ff] p-3">
      <p className="text-xs font-extrabold text-black/70">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-black">{value} {unit}</p>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-2 w-full accent-black"
      />
    </article>
  );
}
