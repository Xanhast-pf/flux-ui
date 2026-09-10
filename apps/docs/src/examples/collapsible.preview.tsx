import { Collapsible } from "@flux-ui/react";

export default function Example() {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger>Let me in on the details.</Collapsible.Trigger>
      <Collapsible.Content>
        <p>
          No provider, measured heights, or custom keyboard engine. Just a
          native disclosure and your content.
        </p>
        <a href="#rules">Read the engineering rules →</a>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
