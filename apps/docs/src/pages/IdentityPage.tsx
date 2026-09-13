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
  Separator,
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
          The ribbon F is the Flux mark. Use the gradient for branding and the
          currentColor icon beside controls. Flux Display remains a separate
          type-design experiment.
        </Text>
      </PageHeader>

      <Card className="identity-hero" padding="lg">
        <Stack gap="lg">
          <Inline gap="md" wrap>
            <img
              src={`${import.meta.env.BASE_URL}flux-mark.svg`}
              alt="Flux UI ribbon F"
              width={80}
              height={80}
            />
            <Text variant="display" weight="bold">
              fluxUI
            </Text>
          </Inline>
          <Inline gap="sm" wrap>
            <Badge tone="accent">64 original icons</Badge>
            <Badge>20 × 20 icon grid</Badge>
            <Badge>{drawnGlyphCount} display glyphs</Badge>
            <Badge>vector design source</Badge>
          </Inline>
        </Stack>
      </Card>

      <Stack aria-labelledby="brand-heading" as="section" gap="lg">
        <Heading id="brand-heading" level={2} size="lg">
          The ribbon F.
        </Heading>
        <Text as="p" variant="body" tone="muted">
          Three editable paths. No raster images, fonts, filters, or background.
          The app icon adds a dark tile; the interface icon inherits its color.
        </Text>
        <Grid columns={{ base: 1, sm: 2 }} gap="md">
          <Card>
            <Stack gap="md">
              <Inline gap="lg" align="center">
                <img
                  src={`${import.meta.env.BASE_URL}flux-mark.svg`}
                  alt=""
                  width={64}
                  height={64}
                />
                <Text as="strong" weight="medium">
                  Brand gradient
                </Text>
              </Inline>
              <Inline gap="md" wrap>
                <Link
                  href={`${import.meta.env.BASE_URL}flux-mark.svg`}
                  download="flux-mark.svg"
                >
                  Download SVG
                </Link>
                <Link
                  href={`${import.meta.env.BASE_URL}flux-app-icon.svg`}
                  download="flux-app-icon.svg"
                >
                  App icon SVG
                </Link>
              </Inline>
            </Stack>
          </Card>
          <Card>
            <Stack gap="md">
              <Inline
                gap="lg"
                role="group"
                aria-label="Monochrome Flux marks at 16, 24, and 32 pixels"
              >
                <FluxMarkIcon size={16} />
                <FluxMarkIcon size={24} />
                <FluxMarkIcon size={32} />
              </Inline>
              <Text as="p" variant="caption" tone="muted">
                FluxMarkIcon · 16 / 24 / 32px · currentColor
              </Text>
              <Link
                href={`${import.meta.env.BASE_URL}flux-mark-mono.svg`}
                download="flux-mark-mono.svg"
              >
                Monochrome SVG
              </Link>
            </Stack>
          </Card>
        </Grid>
      </Stack>

      <Stack aria-labelledby="icons-heading" as="section" gap="lg">
        <Stack gap="md">
          <Stack gap="md">
            <Text as="p" variant="eyebrow" tone="muted">
              Flux Icons
            </Text>
            <Heading id="icons-heading" level={2} size="lg">
              One grammar, more vocabulary.
            </Heading>
            <Text as="p" variant="lead" tone="muted">
              Browse 64 tree-shakeable icons with search, copyable imports,
              accessible naming, and per-icon size budgets.
            </Text>
          </Stack>
          <Card>
            <Stack gap="md">
              <Inline aria-hidden="true" gap="lg" justify="center" wrap>
                <SearchIcon size={26} />
                <CommandIcon size={26} />
                <SparkIcon size={26} />
                <BranchIcon size={26} />
                <GridIcon size={26} />
                <PaletteIcon size={26} />
                <ShieldCheckIcon size={26} />
              </Inline>
              <Link href="#icons" variant="solid">
                Browse all 64 icons
                <ArrowUpRightIcon aria-hidden="true" size={16} />
              </Link>
            </Stack>
          </Card>
        </Stack>
      </Stack>

      <Stack aria-labelledby="display-heading" as="section" gap="lg">
        <Stack gap="md">
          <Stack gap="md">
            <Text as="p" variant="eyebrow" tone="muted">
              Flux Display
            </Text>
            <Heading id="display-heading" level={2} size="lg">
              A typeface starts as shapes, not files.
            </Heading>
            <Text as="p" variant="lead" tone="muted">
              An uppercase vector prototype, not a production font. Lowercase,
              diacritics, and kerning are still in progress.
            </Text>
          </Stack>
          <Card padding="lg">
            <Stack gap="lg">
              <Box
                surface="subtle"
                border="all"
                radius="sm"
                padding="lg"
                className="display-stage"
              >
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
              <Stack
                gap="md"
                role="group"
                aria-label="Flux Display alphabet specimen"
                className="alphabet-specimen"
              >
                <Separator />
                <FluxDisplay text="ABCDEFGHIJKLMNOPQRSTUVWXYZ" size={58} />
                <FluxDisplay text="0123456789 / - . : +" size={58} />
              </Stack>
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
                Glyphs include render padding to avoid clipping. Optical
                spacing, kerning, lowercase, and Latin diacritics need review
                before a font binary is released.
              </Text>
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </Stack>
  );
}
