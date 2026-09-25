import {
  Box,
  Button,
  Callout,
  Card,
  Code,
  ColorSwatch,
  Grid,
  Heading,
  IconButton,
  Inline,
  Input,
  PageHeader,
  ScrollArea,
  Separator,
  Stack,
  Switch,
  Text,
  Tooltip,
} from "@flux-ui/react";
import { cssVars, paletteVars, primitiveTokens } from "@flux-ui/tokens";
import { useState } from "react";
import { useColorValue } from "../lib/appearance.js";
import { AppearanceControls } from "../ui/AppearanceControls.js";

const paletteEntries = Object.entries(paletteVars);
const paletteSteps = Object.keys(paletteVars.slate);

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function SemanticToken({ variable }: { variable: string }) {
  const value = useColorValue(variable);
  const label = variable.replace("--flux-color-", "").replaceAll("-", " ");

  return (
    <Card>
      <Stack gap="sm">
        <Inline gap="sm" align="center">
          <ColorSwatch color={`var(${variable})`} size="sm" />
          <Stack gap="xs">
            <Text as="strong" weight="bold">
              {label}
            </Text>
            <Text variant="caption" tone="muted">
              {value}
            </Text>
          </Stack>
        </Inline>
        <Code>{variable}</Code>
      </Stack>
    </Card>
  );
}

function ThemePreview() {
  return (
    <Stack gap="md">
      <Inline justify="between" wrap gap="md">
        <Stack gap="xs">
          <Heading level={2} size="sm">
            Live theme preview
          </Heading>
          <Text as="p" variant="caption" tone="muted">
            These are ordinary Flux components using semantic tokens.
          </Text>
        </Stack>
        <Inline gap="sm" wrap align="center">
          <Button size="sm">Primary action</Button>
          <Button size="sm" tone="neutral" variant="outline">
            Secondary
          </Button>
          <Inline gap="sm" align="center">
            <Switch aria-label="Theme preview toggle" defaultChecked />
            <Text variant="caption">Enabled</Text>
          </Inline>
        </Inline>
      </Inline>
      <Grid minColumnWidth="14rem" gap="md">
        <Input
          aria-label="Theme preview input"
          placeholder="Search the palette…"
        />
        <Callout tone="info">
          Semantic info, success, warning, and danger tones stay meaningful.
        </Callout>
      </Grid>
    </Stack>
  );
}

export function TokensPage() {
  const [copyStatus, setCopyStatus] = useState("");

  async function copyVariable(variable: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(`var(${variable})`);
      setCopyStatus(`Copied ${variable}.`);
    } catch {
      setCopyStatus(
        `Clipboard unavailable. Use ${variable} directly in your CSS.`,
      );
    }
  }

  return (
    <Stack gap="lg">
      <PageHeader
        title={<>Design tokens</>}
        eyebrow={<>One language, balanced color</>}
      >
        <Text as="p" variant="lead" tone="muted">
          Choose a primary palette, pair it with a perceptually complementary
          secondary, flip the lights, and keep semantic roles intact.
        </Text>
      </PageHeader>

      <Card>
        <Stack gap="lg">
          <AppearanceControls />
          <Separator />
          <ThemePreview />
        </Stack>
      </Card>

      <Stack as="section" gap="lg">
        <Stack gap="sm">
          <Heading level={2} size="lg">
            Full color palette
          </Heading>
          <Text as="p" variant="body">
            {paletteEntries.length} balanced ramps,{" "}
            {paletteEntries.length * paletteSteps.length} colors. Hover or focus
            a swatch to reveal its CSS variable; activate it to copy the
            variable reference.
          </Text>
        </Stack>

        <Card>
          <Stack gap="md">
            <ScrollArea axis="horizontal" aria-label="Flux raw color palette">
              <Grid
                templateColumns="5.5rem repeat(11, 2rem)"
                gap="xs"
                align="center"
                padding="sm"
              >
                <Text variant="caption" tone="muted">
                  Palette
                </Text>
                {paletteSteps.map((step) => (
                  <Text key={step} variant="caption" tone="muted">
                    {step}
                  </Text>
                ))}
                {paletteEntries.flatMap(([family, ramp]) => [
                  <Text key={`${family}-label`} as="strong" weight="bold">
                    {titleCase(family)}
                  </Text>,
                  ...Object.values(ramp).map((variable) => (
                    <Tooltip
                      key={variable}
                      content={variable}
                      delay={0}
                      side="top"
                    >
                      <IconButton
                        aria-label={`Copy ${variable}`}
                        size="sm"
                        tone="neutral"
                        variant="ghost"
                        onClick={() => {
                          void copyVariable(variable);
                        }}
                      >
                        <ColorSwatch color={`var(${variable})`} size="lg" />
                      </IconButton>
                    </Tooltip>
                  )),
                ])}
              </Grid>
            </ScrollArea>
            <Text role="status" variant="caption" tone="muted">
              {copyStatus}
            </Text>
          </Stack>
        </Card>
      </Stack>

      <Stack as="section" gap="lg">
        <Stack gap="sm">
          <Heading level={2} size="lg">
            Semantic color roles
          </Heading>
          <Text as="p" variant="body">
            Components consume these roles rather than hard-coded palette
            shades. Their computed values update with the active mode and
            palette.
          </Text>
        </Stack>
        <Grid minColumnWidth="11rem" gap="sm">
          {Object.values(cssVars.color).map((variable) => (
            <SemanticToken key={variable} variable={variable} />
          ))}
        </Grid>
      </Stack>

      <Stack as="section" gap="lg">
        <Stack gap="md">
          <Heading level={2} size="lg">
            Spatial rhythm
          </Heading>
          <Text as="p" variant="body">
            Explicit quarter-rem steps. A 1rem default gap. A 0.25rem default
            radius. No mystery geometry.
          </Text>
          <Grid minColumnWidth="14rem" gap="md">
            {Object.entries(primitiveTokens.space).map(([step, value]) => (
              <Card key={step}>
                <Stack gap="md">
                  <Inline justify="between">
                    <Code>space.{step}</Code>
                    <Text as="strong" weight="bold">
                      {value}
                    </Text>
                  </Inline>
                  <Box
                    surface="subtle"
                    border="all"
                    radius="sm"
                    style={{ inlineSize: value, blockSize: "1rem" }}
                    aria-hidden="true"
                  />
                </Stack>
              </Card>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );
}
