import { Button, Callout, Stack } from "@flux-ui/react";
import { useState } from "react";

export default function Example() {
  const [saved, setSaved] = useState(false);
  return (
    <Stack gap="md">
      <Callout tone="info">
        Static information is a note, not an urgent announcement.
      </Callout>
      <Button
        onClick={() => {
          setSaved(true);
        }}
      >
        Save demo preference
      </Button>
      <Callout tone={saved ? "success" : "neutral"} role="status">
        {saved
          ? "Demo preference saved in this preview only."
          : "No changes yet."}
      </Callout>
    </Stack>
  );
}
