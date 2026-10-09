import { Button, Callout, Stack } from "@varua/flux-ui";
import { useState } from "react";

export default function StaticCallouts() {
  return (
    <Stack gap="sm">
      <Callout tone="info">Informational guidance for this section.</Callout>
      <Callout tone="success">The operation completed successfully.</Callout>
      <Callout tone="warning">Review this setting before continuing.</Callout>
      <Callout tone="danger">
        This action has a destructive consequence.
      </Callout>
    </Stack>
  );
}

export function LiveStatusCallout() {
  const [saved, setSaved] = useState(false);
  return (
    <Stack gap="md">
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
