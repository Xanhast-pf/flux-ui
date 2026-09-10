import { Button, Inline, Stack } from "@flux-ui/react";

export default function Example() {
  return (
    <Stack gap="md">
      <Inline gap="sm" wrap>
        <Button>Primary action</Button>
        <Button variant="soft">Soft action</Button>
        <Button variant="outline">Outline action</Button>
        <Button variant="ghost">Ghost action</Button>
      </Inline>
      <Inline gap="sm" wrap>
        <Button tone="neutral">Neutral</Button>
        <Button tone="danger">Danger</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
      </Inline>
    </Stack>
  );
}
