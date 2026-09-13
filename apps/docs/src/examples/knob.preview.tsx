import { useState } from "react";
import { Field, Inline, Knob, NumberField, Stack, Text } from "@flux-ui/react";
export default function Preview() {
  const [cutoff, setCutoff] = useState(1000);
  return (
    <Stack gap="md">
      <Inline align="center" gap="lg" wrap>
        <Knob
          aria-label="Filter cutoff"
          min={20}
          max={20000}
          step={10}
          scale="log"
          value={cutoff}
          onValueChange={setCutoff}
          formatValue={(value) => `${value.toLocaleString()} Hz`}
        />
        <Field.Root>
          <Field.Label>Exact cutoff (Hz)</Field.Label>
          <Field.Control>
            <NumberField
              min={20}
              max={20000}
              step={10}
              value={cutoff}
              onValueChange={(value) => {
                if (value !== null)
                  setCutoff(Math.max(20, Math.min(20000, value)));
              }}
            />
          </Field.Control>
        </Field.Root>
      </Inline>
      <Text tone="muted">
        Drag vertically. Arrow keys adjust; Shift makes fine adjustments.
        Home/End reach limits. This example is silent.
      </Text>
    </Stack>
  );
}
