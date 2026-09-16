import { useState } from "react";
import {
  Button,
  Field,
  Inline,
  Knob,
  NumberField,
  Select,
  Stack,
  Text,
} from "@flux-ui/react";
export default function Preview() {
  const [cutoff, setCutoff] = useState(1000);
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  return (
    <Stack gap="md">
      <Field.Root>
        <Field.Label>Knob size</Field.Label>
        <Field.Control>
          <Select
            value={size}
            onChange={(event) => {
              const next = event.currentTarget.value;
              if (next === "sm" || next === "md" || next === "lg")
                setSize(next);
            }}
          >
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="lg">Large</option>
          </Select>
        </Field.Control>
      </Field.Root>
      <Inline align="center" gap="lg" wrap>
        <Knob
          aria-label="Filter cutoff"
          size={size}
          resetValue={1000}
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
      <Button variant="outline" onClick={() => setCutoff(1000)}>
        Reset cutoff
      </Button>
      <Text tone="muted">
        Drag vertically. Arrow keys adjust; Shift makes fine adjustments.
        Home/End reach limits. Double-click resets to 1,000 Hz. This example is
        silent.
      </Text>
    </Stack>
  );
}
