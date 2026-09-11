import { List } from "@flux-ui/react";

export default function Preview() {
  return (
    <List as="ol" start={3} variant="marker" gap={3}>
      <List.Item>Pick native semantics.</List.Item>
      <List.Item>Compose public primitives.</List.Item>
      <List.Item>Measure before making claims.</List.Item>
    </List>
  );
}
