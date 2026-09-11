import { formatMs } from "../lib/format.js";

export function ComparisonBars({
  label,
  native,
  flux,
}: {
  label: string;
  native: number;
  flux: number;
}) {
  const maximum = Math.max(native, flux, 0.01);
  return (
    <div className="comparison-bars" role="group" aria-label={label}>
      <p className="chart-label">{label}</p>
      {[
        { name: "Native React", value: native, className: "bar-native" },
        { name: "Flux UI", value: flux, className: "bar-flux" },
      ].map((entry) => (
        <div className="comparison-row" key={entry.name}>
          <span>{entry.name}</span>
          <span className="bar-track" aria-hidden="true">
            <span
              className={entry.className}
              style={{ width: `${(entry.value / maximum) * 100}%` }}
            />
          </span>
          <strong>{formatMs(entry.value)}</strong>
        </div>
      ))}
    </div>
  );
}
