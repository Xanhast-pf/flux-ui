import { useState } from "react";
import { health } from "../generated/health.js";
import { formatBytes } from "../lib/format.js";

interface BundleEntry {
  name: string;
  slug: string;
  raw: number | null;
  gzip: number | null;
  brotli: number | null;
}
const recordedEntries: readonly BundleEntry[] = health.size.components;

type Compression = "raw" | "gzip" | "brotli";
export function BundleExplorer() {
  const [search, setSearch] = useState("");
  const [compression, setCompression] = useState<Compression>("brotli");
  const entries = recordedEntries
    .filter((entry) =>
      entry.name.toLowerCase().includes(search.trim().toLowerCase()),
    )
    .sort(
      (left, right) => (right[compression] ?? 0) - (left[compression] ?? 0),
    );
  const maximum = Math.max(
    1,
    ...entries.map((entry) => entry[compression] ?? 0),
  );
  return (
    <section className="bundle-explorer" aria-label="Bundle-size visualization">
      <div className="explorer-heading">
        <div>
          <p className="eyebrow">Anatomy of a lightweight system</p>
          <h2>Every component, in perspective.</h2>
        </div>
        <div className="explorer-controls">
          <label>
            Find a component
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
          </label>
          <label>
            Compression
            <select
              value={compression}
              onChange={(event) => {
                const value = event.target.value;
                setCompression(
                  value === "raw" || value === "gzip" ? value : "brotli",
                );
              }}
            >
              <option value="brotli">Brotli</option>
              <option value="gzip">Gzip</option>
              <option value="raw">Raw bytes</option>
            </select>
          </label>
        </div>
      </div>
      <p className="muted">
        Committed emitted runtime graphs · largest first · shared modules can
        overlap. React and external packages are excluded. These values are not
        additive application bundle sizes.
      </p>
      <p role="status" className="result-count">
        {entries.length} matching components
      </p>
      <div className="bundle-bars">
        {entries.map((entry) => (
          <div className="bundle-row" key={entry.slug}>
            <a href={`#components/${entry.slug}`}>{entry.name}</a>
            <span className="bar-track" aria-hidden="true">
              <span
                className="bar-flux"
                style={{
                  width: `${((entry[compression] ?? 0) / maximum) * 100}%`,
                }}
              />
            </span>
            <strong>{formatBytes(entry[compression])}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
