import { Stack, Text, Toggle } from "@flux-ui/react";
import { useState } from "react";
export default function Example() {
  const [saved, setSaved] = useState(false);
  return (
    <Stack gap="md">
      <Toggle pressed={saved} onPressedChange={setSaved}>
        Save example
      </Toggle>
      <Text as="p" variant="body" role="status">
        {saved ? "Added to your local collection." : "Not saved yet."}
      </Text>
    </Stack>
  );
}
