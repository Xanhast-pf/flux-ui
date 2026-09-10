import { FluxMarkIcon } from "@flux-ui/icons";
import { iconCatalog } from "@flux-ui/icons/catalog";
import {
  Badge,
  Card,
  Grid,
  Inline,
  Input,
  Select,
  Slider,
  Stack,
} from "@flux-ui/react";
import { createElement, useMemo, useState } from "react";
import { FluxDisplay } from "../identity/FluxDisplay.js";
import { CodeBlock } from "../ui/CodeBlock.js";

const iconSizes = [16, 20, 24, 32] as const;
const categories = [
  "all",
  ...Array.from(new Set(iconCatalog.map((entry) => entry.category))).sort(
    (left, right) => left.localeCompare(right),
  ),
];

export function IdentityPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [iconSize, setIconSize] = useState<number>(20);
  const [selected, setSelected] = useState("FluxMarkIcon");
  const [specimen, setSpecimen] = useState("FLUX UI");
  const [displaySize, setDisplaySize] = useState(88);
  const normalizedQuery = query.trim().toLowerCase();
  const visibleIcons = useMemo(
    () =>
      iconCatalog.filter(
        (entry) =>
          (category === "all" || entry.category === category) &&
          `${entry.name} ${entry.category} ${entry.keywords.join(" ")}`
            .toLowerCase()
            .includes(normalizedQuery),
      ),
    [category, normalizedQuery],
  );
  const selectedEntry =
    iconCatalog.find((entry) => entry.name === selected) ?? iconCatalog[0];

  return (
    <Stack gap="lg">
      <div>
        <p className="eyebrow">Flux identity lab</p>
        <h1>Drawn for the system.</h1>
        <p className="lede">
          Original iconography and a vector display alphabet built from the same
          geometric rules. This is the place to pressure-test the visual
          language before it becomes permanent.
        </p>
      </div>

      <Card className="identity-hero">
        <Stack gap="lg">
          <div className="identity-mark-lockup">
            <FluxMarkIcon size={56} />
            <FluxDisplay
              text="FLUX UI"
              size={84}
              className="identity-wordmark"
            />
          </div>
          <Inline gap="sm" wrap>
            <Badge tone="accent">34 original icons</Badge>
            <Badge>20 × 20 grid</Badge>
            <Badge>1.5 stroke</Badge>
            <Badge>vector display source</Badge>
          </Inline>
        </Stack>
      </Card>

      <section aria-labelledby="icons-heading">
        <Stack gap="md">
          <div>
            <p className="eyebrow">Flux Icons</p>
            <h2 id="icons-heading">Small marks, one visual grammar.</h2>
            <p className="lede">
              Decorative by default, accessible when labelled, and driven by
              currentColor. Filter the set, change its optical size, then pick a
              glyph to inspect the public import.
            </p>
          </div>
          <div className="identity-controls">
            <Input
              aria-label="Filter Flux icons"
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.currentTarget.value);
              }}
              placeholder="Search icons…"
            />
            <Select
              aria-label="Icon category"
              value={category}
              onChange={(event) => {
                setCategory(event.currentTarget.value);
              }}
            >
              {categories.map((value) => (
                <option key={value} value={value}>
                  {value === "all" ? "All categories" : value}
                </option>
              ))}
            </Select>
            <div
              className="icon-size-options"
              role="group"
              aria-label="Icon preview size"
            >
              {iconSizes.map((value) => (
                <button
                  aria-pressed={iconSize === value}
                  className="identity-size-button"
                  key={value}
                  onClick={() => {
                    setIconSize(value);
                  }}
                  type="button"
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
          <p className="result-count" role="status">
            {visibleIcons.length} {visibleIcons.length === 1 ? "icon" : "icons"}
          </p>
          <Grid minColumnWidth="8rem" gap="sm" className="icon-gallery">
            {visibleIcons.map((entry) => {
              return (
                <button
                  aria-pressed={selected === entry.name}
                  className="icon-tile"
                  key={entry.name}
                  onClick={() => {
                    setSelected(entry.name);
                  }}
                  type="button"
                >
                  <span className="icon-tile-stage" aria-hidden="true">
                    {createElement(entry.component, { size: iconSize })}
                  </span>
                  <span>{entry.name.replace(/Icon$/u, "")}</span>
                  <small>{entry.category}</small>
                </button>
              );
            })}
          </Grid>
          {selectedEntry === undefined ? null : (
            <CodeBlock
              label={`${selectedEntry.name} import`}
              code={`import { ${selectedEntry.name} } from "@flux-ui/icons";\n\n<${selectedEntry.name} aria-label="…" />`}
            />
          )}
        </Stack>
      </section>

      <section aria-labelledby="display-heading">
        <Stack gap="md">
          <div>
            <p className="eyebrow">Flux Display</p>
            <h2 id="display-heading">
              A typeface starts as shapes, not files.
            </h2>
            <p className="lede">
              This uppercase prototype is rendered directly from Flux vector
              glyph source. No font binary is being shipped yet; first we make
              the letterforms earn it.
            </p>
          </div>
          <Card className="display-lab">
            <Stack gap="lg">
              <div className="display-stage">
                <FluxDisplay
                  className="display-specimen"
                  size={displaySize}
                  text={specimen || "FLUX UI"}
                />
              </div>
              <Grid minColumnWidth="16rem" gap="md">
                <Stack gap="sm">
                  <label htmlFor="flux-display-text">Specimen</label>
                  <Input
                    id="flux-display-text"
                    value={specimen}
                    onChange={(event) => {
                      setSpecimen(event.currentTarget.value.toUpperCase());
                    }}
                    maxLength={30}
                  />
                </Stack>
                <Stack gap="sm">
                  <label htmlFor="flux-display-size">Display size</label>
                  <Slider
                    id="flux-display-size"
                    aria-label="Flux Display size"
                    min={48}
                    max={140}
                    step={4}
                    value={displaySize}
                    onValueChange={setDisplaySize}
                  />
                  <span className="muted">{displaySize}px specimen height</span>
                </Stack>
              </Grid>
              <div
                className="alphabet-specimen"
                role="group"
                aria-label="Flux Display alphabet specimen"
              >
                <FluxDisplay text="ABCDEFGHIJKLMNOPQRSTUVWXYZ" size={58} />
                <FluxDisplay text="0123456789 / - . : +" size={58} />
              </div>
            </Stack>
          </Card>
          <Grid minColumnWidth="12rem" gap="sm">
            <Card className="metric-card">
              <span className="muted">Units / em</span>
              <strong>1000</strong>
            </Card>
            <Card className="metric-card">
              <span className="muted">Cap height</span>
              <strong>700</strong>
            </Card>
            <Card className="metric-card">
              <span className="muted">Target stem</span>
              <strong>~82</strong>
            </Card>
            <Card className="metric-card">
              <span className="muted">Current scope</span>
              <strong>A–Z / 0–9</strong>
            </Card>
          </Grid>
        </Stack>
      </section>
    </Stack>
  );
}
