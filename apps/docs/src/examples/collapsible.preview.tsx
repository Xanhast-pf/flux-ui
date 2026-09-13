import { Collapsible, Link, Text } from "@flux-ui/react";

export default function Example() {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger>Let me in on the details.</Collapsible.Trigger>
      <Collapsible.Content>
        <Text as="p" variant="body">
          No provider, measured heights, or custom keyboard engine. Just a
          native disclosure and your content.
        </Text>
        <Link href="#rules">Read the engineering rules →</Link>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
