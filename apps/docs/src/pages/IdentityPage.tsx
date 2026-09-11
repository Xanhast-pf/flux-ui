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
  Box,
  Card,
  Field,
  Grid,
  Heading,
  Inline,
  Input,
  Link,
  PageHeader,
  Slider,
  Stack,
  Stat,
  Text,
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
      <PageHeader
        title={<>Drawn for the system.</>}
        eyebrow={<>Flux identity lab</>}
      >
        <Text as="p" variant="lead" tone="muted">
          Flux Icons and Flux Display share a geometric vocabulary: compact
          grids, deliberate gaps, technical terminals, and enough personality to
          feel like one system without becoming decoration for its own sake.
        </Text>
      </PageHeader>

      <Card className="identity-hero">
        <Stack gap="lg">
          <Box className="identity-mark-lockup">
            <FluxMarkIcon size={56} />
            <FluxDisplay
              text="FLUX UI"
              size={84}
              className="identity-wordmark"
            />
          </Box>
          <Inline gap="sm" wrap>
            <Badge tone="accent">64 original icons</Badge>
            <Badge>20 × 20 icon grid</Badge>
            <Badge>{drawnGlyphCount} display glyphs</Badge>
            <Badge>vector design source</Badge>
          </Inline>
        </Stack>
      </Card>

      <Stack aria-labelledby="icons-heading" as="section" gap="lg">
        <Stack gap="md">
          <Box>
            <Text as="p" variant="eyebrow" tone="muted">
              Flux Icons
            </Text>
            <Heading id="icons-heading" level={2} size="lg">
              One grammar, more vocabulary.
            </Heading>
            <Text as="p" variant="lead" tone="muted">
              The icon set is a publishable package with per-icon size budgets,
              real accessibility defaults, and search metadata. The full browser
              now lives on its own page so this lab can stay focused on the
              identity system itself.
            </Text>
          </Box>
          <Card className="identity-icon-teaser">
            <Box aria-hidden="true" className="identity-icon-teaser-grid">
              <SearchIcon size={26} />
              <CommandIcon size={26} />
              <SparkIcon size={26} />
              <BranchIcon size={26} />
              <GridIcon size={26} />
              <PaletteIcon size={26} />
              <ShieldCheckIcon size={26} />
            </Box>
            <Link href="#icons" variant="solid">
              Browse all 64 icons
              <ArrowUpRightIcon aria-hidden="true" size={16} />
            </Link>
          </Card>
        </Stack>
      </Stack>

      <Stack aria-labelledby="display-heading" as="section" gap="lg">
        <Stack gap="md">
          <Box>
            <Text as="p" variant="eyebrow" tone="muted">
              Flux Display
            </Text>
            <Heading id="display-heading" level={2} size="lg">
              A typeface starts as shapes, not files.
            </Heading>
            <Text as="p" variant="lead" tone="muted">
              This uppercase prototype is rendered directly from Flux vector
              glyph source. It is not a production font yet: lowercase,
              diacritics, spacing pairs, and kerning still need a dedicated
              type-design pass before font engineering begins.
            </Text>
          </Box>
          <Card className="display-lab">
            <Stack gap="lg">
              <Box className="display-stage">
                <FluxDisplay
                  size={displaySize}
                  text={specimen || "FLUX UI"}
                  className="display-specimen"
                />
              </Box>
              <Grid minColumnWidth="16rem" gap="md">
                <Stack gap="sm">
                  <Field.Root controlId="flux-display-text">
                    <Field.Label>Specimen</Field.Label>
                    <Field.Control>
                      <Input
                        value={specimen}
                        onChange={(event) => {
                          setSpecimen(event.currentTarget.value.toUpperCase());
                        }}
                        maxLength={30}
                      />
                    </Field.Control>
                  </Field.Root>
                  <Text role="status" as="p" variant="body" tone="muted">
                    {unsupported.length === 0
                      ? "Every character in this specimen is covered by the current prototype."
                      : `Not drawn yet: ${unsupported.join(" ")}. Unsupported characters render as spaces.`}
                  </Text>
                </Stack>
                <Stack gap="sm">
                  <Field.Root controlId="flux-display-size">
                    <Field.Label>Display size</Field.Label>
                    <Field.Control>
                      <Slider
                        aria-label="Flux Display size"
                        min={48}
                        max={140}
                        step={4}
                        value={displaySize}
                        onValueChange={setDisplaySize}
                      />
                    </Field.Control>
                  </Field.Root>
                  <Text tone="muted">{displaySize}px specimen height</Text>
                </Stack>
              </Grid>
              <Box
                role="group"
                aria-label="Flux Display alphabet specimen"
                className="alphabet-specimen"
              >
                <FluxDisplay text="ABCDEFGHIJKLMNOPQRSTUVWXYZ" size={58} />
                <FluxDisplay text="0123456789 / - . : +" size={58} />
              </Box>
            </Stack>
          </Card>
          <Grid minColumnWidth="12rem" gap="sm">
            <Card>
              <Stat
                label={<>Units / em target</>}
                value={<>{fluxDisplayMetrics.unitsPerEm}</>}
              />
            </Card>
            <Card>
              <Stat
                label={<>Cap height target</>}
                value={<>{fluxDisplayMetrics.capHeight}</>}
              />
            </Card>
            <Card>
              <Stat
                label={<>Target stem</>}
                value={<>~{fluxDisplayMetrics.stem}</>}
              />
            </Card>
            <Card>
              <Stat label={<>Current status</>} value={<>Prototype</>} />
            </Card>
          </Grid>
          <Card>
            <Stack gap="sm">
              <Text as="p" variant="eyebrow" tone="muted">
                Audit note
              </Text>
              <Heading level={3} size="md">
                The source is healthy, but the font is not finished.
              </Heading>
              <Text as="p" variant="body">
                The SVG renderer now reserves a full design-grid unit around the
                glyph run so sharp mitered corners and Q/R tails cannot be
                clipped. The next typography milestone is optical spacing,
                kerning, lowercase, and Latin diacritics—not a premature font
                binary.
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </Stack>
  );
}
