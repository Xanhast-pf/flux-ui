import { Button, Inline, Progress, Stack } from "@flux-ui/react";
import { useState } from "react";

export default function Example() {
  const [value, setValue] = useState(25);
  return (
    <Stack gap="md">
      <p>Example progress: {value}%</p>
      <Progress aria-label="Example progress" value={value} />
      <Inline gap="sm" wrap>
        <Button
          onClick={() => {
            setValue((current) => Math.min(current + 25, 100));
          }}
          disabled={value === 100}
        >
          Complete a step
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setValue(0);
          }}
        >
          Reset progress
        </Button>
      </Inline>
      <p>Indeterminate (no value supplied)</p>
      <Progress aria-label="Waiting for progress" />
    </Stack>
  );
}
