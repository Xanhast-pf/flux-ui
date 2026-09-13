import { Box, Field, Input } from "@flux-ui/react";
import type { ScenarioProps } from "../scenario.types.js";

export default function Fixture({ count, revision }: ScenarioProps) {
  return (
    <Box data-perf-root>
      {Array.from({ length: count }, (_, i) => `field-${i}`).map((id) => (
        <Field.Root key={id}>
          <Field.Label>{id}</Field.Label>
          <Field.Control>
            <Input value={`Revision ${revision}`} readOnly />
          </Field.Control>
        </Field.Root>
      ))}
    </Box>
  );
}
