import { IconButton, Inline, Text } from "@varua/flux-ui";
import { useState } from "react";

export default function InteractiveIconButtons() {
  const [count, setCount] = useState(0);
  return (
    <Inline gap="md" wrap>
      <IconButton
        aria-label="Add a spark"
        onClick={() => {
          setCount((value) => value + 1);
        }}
      >
        <Text aria-hidden="true">+</Text>
      </IconButton>
      <IconButton
        aria-label="Reset sparks"
        tone="neutral"
        variant="outline"
        onClick={() => {
          setCount(0);
        }}
      >
        <Text aria-hidden="true">↺</Text>
      </IconButton>
      <Text role="status">{count} sparks</Text>
    </Inline>
  );
}

export function IconButtonScaleAndTreatments() {
  return (
    <Inline gap="sm" wrap>
      <IconButton aria-label="Small solid action" size="sm">
        <Text aria-hidden="true">+</Text>
      </IconButton>
      <IconButton aria-label="Medium soft action" size="md" variant="soft">
        <Text aria-hidden="true">+</Text>
      </IconButton>
      <IconButton
        aria-label="Large outline action"
        size="lg"
        variant="outline"
        tone="neutral"
      >
        <Text aria-hidden="true">+</Text>
      </IconButton>
      <IconButton
        aria-label="Ghost danger action"
        variant="ghost"
        tone="danger"
      >
        <Text aria-hidden="true">×</Text>
      </IconButton>
    </Inline>
  );
}
