import { Inline, Separator, Stack } from "@flux-ui/react";

export default function Example() {
  return (
    <Stack gap="md">
      <p>A semantic break between ideas.</p>
      <Separator />
      <Inline gap="md">
        <span>Compose</span>
        <Separator decorative orientation="vertical" />
        <span>Customize</span>
        <Separator decorative orientation="vertical" />
        <span>Ship</span>
      </Inline>
    </Stack>
  );
}
