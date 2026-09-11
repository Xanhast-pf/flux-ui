import {
  Badge,
  Button,
  Card,
  Code,
  ColorSwatch,
  Grid,
  Heading,
  Inline,
  PageHeader,
  Stack,
  Text,
} from "@flux-ui/react";
import { cssVars, primitiveTokens } from "@flux-ui/tokens";
import { useState } from "react";
import { useColorValue } from "../lib/appearance.js";
import { AppearanceControls } from "../ui/AppearanceControls.js";
function ColorToken({ variable }: { variable: string }) {
  const value = useColorValue(variable);
  const [status, setStatus] = useState("");
  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(`var(${variable})`);
      setStatus("Copied CSS variable.");
    } catch {
      setStatus("Clipboard unavailable. Select the variable below to copy.");
    }
  }
  return (
    <Card>
      <Stack gap="sm">
        <ColorSwatch color={`var(${variable})`} size="lg" />
        <Stack gap="sm">
          <Inline justify="between" wrap>
            <Text as="strong" weight="bold">
              {variable.replace("--flux-color-", "").replaceAll("-", " ")}
            </Text>
            <Badge>{value}</Badge>
          </Inline>
          <Code>{variable}</Code>
          <Button
            size="sm"
            variant="ghost"
            tone="neutral"
            onClick={() => {
              void copy();
            }}
          >
            Copy {variable.replace("--flux-color-", "")}
          </Button>
          <Text role="status" variant="caption" tone="muted">
            {status}
          </Text>
        </Stack>
      </Stack>
    </Card>
  );
}
export function TokensPage() {
  return (
    <Stack gap="lg">
      <PageHeader
        title={<>Design tokens</>}
        eyebrow={<>One language, many moods</>}
      >
        <Text as="p" variant="lead" tone="muted">
          Change the accent. Flip the lights. Watch the entire workshop respond.
        </Text>
      </PageHeader>
      <Card>
        <AppearanceControls />
      </Card>
      <Stack as="section" gap="lg">
        <Stack gap="md">
          <Heading level={2} size="lg">
            Semantic color palette
          </Heading>
          <Text as="p" variant="body">
            The values below are read from the active CSS variables. Click to
            copy a variable reference, not a hard-coded color.
          </Text>
          <Grid minColumnWidth="15rem" gap="md">
            {Object.values(cssVars.color).map((variable) => (
              <ColorToken key={variable} variable={variable} />
            ))}
          </Grid>
        </Stack>
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
                <Inline justify="between">
                  <Code>space.{step}</Code>
                  <Text as="strong" weight="bold">
                    {value}
                  </Text>
                </Inline>
                <div
                  style={{ width: value }}
                  aria-hidden="true"
                  className="space-sample"
                />
              </Card>
            ))}
          </Grid>
        </Stack>
      </Stack>
    </Stack>
  );
}
