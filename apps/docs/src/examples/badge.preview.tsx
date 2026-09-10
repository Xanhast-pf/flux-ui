import { Badge, Inline } from "@flux-ui/react";

export default function Example() {
  return (
    <Inline gap="sm" wrap>
      <Badge>Draft</Badge>
      <Badge tone="accent">Preview</Badge>
      <Badge tone="success">Ready</Badge>
      <Badge tone="warning">Review</Badge>
      <Badge tone="danger">Blocked</Badge>
      <Badge tone="info">New</Badge>
    </Inline>
  );
}
