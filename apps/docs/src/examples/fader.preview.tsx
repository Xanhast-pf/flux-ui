import { useState } from "react";
import { Fader, Field, Inline, LevelMeter, Stack, Text } from "@flux-ui/react";
export default function Preview() {
  const [gain, setGain] = useState(-12);
  return (
    <Stack gap="md">
      <Inline align="center" gap="lg">
        <Field.Root>
          <Field.Label>Master gain (dB)</Field.Label>
          <Field.Control>
            <Fader
              min={-60}
              max={0}
              step={1}
              value={gain}
              onValueChange={setGain}
              aria-valuetext={`${gain} dB`}
            />
          </Field.Control>
        </Field.Root>
        <LevelMeter
          aria-label="Illustrative level, not audio output"
          value={gain}
          min={-60}
          max={0}
          peak={-6}
        />
      </Inline>
      <Text tone="muted">
        {gain} dB · Native range interaction; no audio is started.
      </Text>
    </Stack>
  );
}
