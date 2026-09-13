import { useState } from "react";
import { Field, NumberField, Stack, Text } from "@flux-ui/react";
export default function Preview() {
  const [tempo, setTempo] = useState<number | null>(120);
  return (
    <Stack gap="md">
      <Field.Root>
        <Field.Label>Tempo (BPM)</Field.Label>
        <Field.Control>
          <NumberField
            min={40}
            max={240}
            step={1}
            value={tempo ?? ""}
            onValueChange={setTempo}
          />
        </Field.Control>
        <Field.Description>
          Type an exact value or use the native stepper.
        </Field.Description>
      </Field.Root>
      <Text tone="muted">
        {tempo === null ? "No tempo entered" : `${tempo} beats per minute`}
      </Text>
    </Stack>
  );
}
