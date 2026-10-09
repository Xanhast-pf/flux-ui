import { StatusBadge, Inline } from "@varua/flux-ui";

export default function Example() {
  return (
    <Inline gap="sm" wrap>
      <StatusBadge>Draft</StatusBadge>
      <StatusBadge tone="accent">Preview</StatusBadge>
      <StatusBadge tone="success">Ready</StatusBadge>
      <StatusBadge tone="warning">Review</StatusBadge>
      <StatusBadge tone="danger">Blocked</StatusBadge>
      <StatusBadge tone="info">New</StatusBadge>
    </Inline>
  );
}
