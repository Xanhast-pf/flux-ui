import { Button, Indicator } from "@varua/flux-ui";

export default function Example() {
  return (
    <Indicator content={4} max={99} tone="danger" placement="top-end">
      <Button aria-label="Inbox, 4 unread messages">Inbox</Button>
    </Indicator>
  );
}
