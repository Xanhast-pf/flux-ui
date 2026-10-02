import { Button, Indicator } from "@flux-ui/react";

export default function Example() {
  return (
    <Indicator content={4} max={99} tone="danger" placement="top-end">
      <Button aria-label="Inbox, 4 unread messages">Inbox</Button>
    </Indicator>
  );
}
