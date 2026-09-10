import { Badge, Button, Card, Grid, Inline, Stack } from "@flux-ui/react";
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
    <Card className="token-card">
      <span
        className="token-color"
        style={{ background: `var(${variable})` }}
        aria-hidden="true"
      />
      <Stack gap="sm">
        <Inline justify="between" wrap>
          <strong>
            {variable.replace("--flux-color-", "").replaceAll("-", " ")}
          </strong>
          <Badge>{value}</Badge>
        </Inline>
        <code>{variable}</code>
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
        <span className="copy-status" role="status">
          {status}
        </span>
      </Stack>
    </Card>
  );
}
export function TokensPage() {
  return (
    <Stack gap="lg">
      <div>
        <p className="eyebrow">One language, many moods</p>
        <h1>Design tokens</h1>
        <p className="lede">
          Change the accent. Flip the lights. Watch the entire workshop respond.
        </p>
      </div>
      <Card>
        <AppearanceControls />
      </Card>
      <section>
        <Stack gap="md">
          <h2>Semantic color palette</h2>
          <p>
            The values below are read from the active CSS variables. Click to
            copy a variable reference, not a hard-coded color.
          </p>
          <Grid minColumnWidth="15rem" gap="md">
            {Object.values(cssVars.color).map((variable) => (
              <ColorToken key={variable} variable={variable} />
            ))}
          </Grid>
        </Stack>
      </section>
      <section>
        <Stack gap="md">
          <h2>Spatial rhythm</h2>
          <p>
            Explicit quarter-rem steps. A 1rem default gap. A 0.25rem default
            radius. No mystery geometry.
          </p>
          <Grid minColumnWidth="14rem" gap="md">
            {Object.entries(primitiveTokens.space).map(([step, value]) => (
              <Card key={step}>
                <Inline justify="between">
                  <code>space.{step}</code>
                  <strong>{value}</strong>
                </Inline>
                <div
                  className="space-sample"
                  style={{ width: value }}
                  aria-hidden="true"
                />
              </Card>
            ))}
          </Grid>
        </Stack>
      </section>
    </Stack>
  );
}
