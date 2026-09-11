import {
  ArrowUpRightIcon,
  BranchIcon,
  CommandIcon,
  FluxMarkIcon,
  GridIcon,
  PaletteIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparkIcon,
} from "@flux-ui/icons";
import {
  fluxDisplayGlyphs,
  fluxDisplayMetrics,
  getUnsupportedFluxDisplayCharacters,
} from "@flux-ui/identity";
import {
  Badge,
  Card,
  Grid,
  Inline,
  Input,
  Slider,
  Stack,
} from "@flux-ui/react";
import { useState } from "react";
import { FluxDisplay } from "../identity/FluxDisplay.js";

const drawnGlyphCount = Object.values(fluxDisplayGlyphs).filter(
  (glyph) => glyph.path.length > 0,
).length;

export function IdentityPage() {
  const [specimen, setSpecimen] = useState("FLUX UI");
  const [displaySize, setDisplaySize] = useState(88);
  const unsupported = getUnsupportedFluxDisplayCharacters(specimen);

  return (
    <Stack gap="xl">
      <div>
        <p className="eyebrow">Flux identity lab</p>
        <h1>Drawn for the system.</h1>
        <p className="lede">
          Flux Icons and Flux Display share a geometric vocabulary: compact
          grids, deliberate gaps, technical terminals, and enough personality to
          feel like one system without becoming decoration for its own sake.
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
            <Badge tone="accent">64 original icons</Badge>
            <Badge>20 × 20 icon grid</Badge>
            <Badge>{drawnGlyphCount} display glyphs</Badge>
            <Badge>vector design source</Badge>
          </Inline>
        </Stack>
      </Card>

      <section aria-labelledby="icons-heading">
        <Stack gap="md">
          <div>
            <p className="eyebrow">Flux Icons</p>
            <h2 id="icons-heading">One grammar, more vocabulary.</h2>
            <p className="lede">
              The icon set is a publishable package with per-icon size budgets,
              real accessibility defaults, and search metadata. The full browser
              now lives on its own page so this lab can stay focused on the
              identity system itself.
            </p>
          </div>
          <Card className="identity-icon-teaser">
            <div className="identity-icon-teaser-grid" aria-hidden="true">
              <SearchIcon size={26} />
              <CommandIcon size={26} />
              <SparkIcon size={26} />
              <BranchIcon size={26} />
              <GridIcon size={26} />
              <PaletteIcon size={26} />
              <ShieldCheckIcon size={26} />
            </div>
            <a className="primary-link" href="#icons">
              Browse all 64 icons
              <ArrowUpRightIcon aria-hidden="true" size={16} />
            </a>
          </Card>
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
              glyph source. It is not a production font yet: lowercase,
              diacritics, spacing pairs, and kerning still need a dedicated
              type-design pass before font engineering begins.
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
                  <p className="muted" role="status">
                    {unsupported.length === 0
                      ? "Every character in this specimen is covered by the current prototype."
                      : `Not drawn yet: ${unsupported.join(" ")}. Unsupported characters render as spaces.`}
                  </p>
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
              <span className="muted">Units / em target</span>
              <strong>{fluxDisplayMetrics.unitsPerEm}</strong>
            </Card>
            <Card className="metric-card">
              <span className="muted">Cap height target</span>
              <strong>{fluxDisplayMetrics.capHeight}</strong>
            </Card>
            <Card className="metric-card">
              <span className="muted">Target stem</span>
              <strong>~{fluxDisplayMetrics.stem}</strong>
            </Card>
            <Card className="metric-card">
              <span className="muted">Current status</span>
              <strong>Prototype</strong>
            </Card>
          </Grid>
          <Card>
            <Stack gap="sm">
              <p className="eyebrow">Audit note</p>
              <h3>The source is healthy, but the font is not finished.</h3>
              <p>
                The SVG renderer now reserves a full design-grid unit around the
                glyph run so sharp mitered corners and Q/R tails cannot be
                clipped. The next typography milestone is optical spacing,
                kerning, lowercase, and Latin diacritics—not a premature font
                binary.
              </p>
            </Stack>
          </Card>
        </Stack>
      </section>
    </Stack>
  );
}
