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

export function PlainList() {
  return (
    <List variant="plain" gap={3}>
      <List.Item>No decorative marker.</List.Item>
      <List.Item>Native list semantics remain intact.</List.Item>
      <List.Item>Spacing still uses shared layout tokens.</List.Item>
    </List>
  );
}
