import { IconButton, Inline, Text } from "@flux-ui/react";
import { useState } from "react";
export default function Example() {
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
