import { Button, Inline, Progress, Stack, Text } from "@flux-ui/react";
import { useState } from "react";

export default function Example() {
  const [value, setValue] = useState(25);
  return (
    <Stack gap="md">
      <Text as="p" variant="body">
        Example progress: {value}%
      </Text>
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
      <Text as="p" variant="body">
        Indeterminate (no value supplied)
      </Text>
      <Progress aria-label="Waiting for progress" />
    </Stack>
  );
}
