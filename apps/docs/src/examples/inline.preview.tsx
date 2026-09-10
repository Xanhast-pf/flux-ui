import { Button, Inline } from "@flux-ui/react";

export default function Example() {
  return (
    <Inline gap="sm" justify="between" wrap className="demo-boundary">
      <strong>Actions</strong>
      <Inline gap="sm" wrap>
        <Button size="sm" variant="outline">
          Export
        </Button>
        <Button size="sm">Create</Button>
      </Inline>
    </Inline>
  );
}
