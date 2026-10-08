import { Button, Inline } from "@flux-ui/react";

export default function ButtonVariants() {
  return (
    <Inline gap="sm" wrap>
      <Button>Solid</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </Inline>
  );
}

export function ButtonTones() {
  return (
    <Inline gap="sm" wrap>
      <Button>Accent</Button>
      <Button tone="neutral">Neutral</Button>
      <Button tone="danger">Danger</Button>
    </Inline>
  );
}

export function ButtonSizes() {
  return (
    <Inline gap="sm" wrap>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </Inline>
  );
}

export function ButtonStates() {
  return (
    <Inline gap="sm" wrap>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </Inline>
  );
}
