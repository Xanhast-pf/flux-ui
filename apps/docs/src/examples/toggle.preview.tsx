import { Stack, Text, Toggle } from "@varua/flux-ui";
import { useState } from "react";
export default function Example() {
  const [saved, setSaved] = useState(false);
  return (
    <Stack gap="md" align="start">
      <Toggle pressed={saved} onPressedChange={setSaved}>
        Save example
      </Toggle>
      <Text as="p" variant="body" role="status">
        {saved ? "Added to your local collection." : "Not saved yet."}
      </Text>
    </Stack>
  );
}
