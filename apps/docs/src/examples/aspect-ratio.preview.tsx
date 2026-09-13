import { AspectRatio, Card, Field, Select, Stack, Text } from "@flux-ui/react";
import { useState } from "react";
export default function Example() {
  const [ratio, setRatio] = useState(16 / 9);
  return (
    <Stack gap="md">
      <Field.Root>
        <Field.Label>Preview ratio</Field.Label>
        <Field.Control>
          <Select
            value={String(ratio)}
            onChange={(event) => {
              setRatio(Number(event.currentTarget.value));
            }}
          >
            <option value={String(16 / 9)}>Wide · 16:9</option>
            <option value="1">Square · 1:1</option>
            <option value={String(4 / 3)}>Classic · 4:3</option>
          </Select>
        </Field.Control>
      </Field.Root>
      <Card surface="subtle">
        <AspectRatio ratio={ratio} align="center">
          <Text>Room for your next idea.</Text>
        </AspectRatio>
      </Card>
    </Stack>
  );
}
