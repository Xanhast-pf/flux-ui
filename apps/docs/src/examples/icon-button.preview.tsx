import { IconButton, Inline } from "@flux-ui/react";
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
        <span aria-hidden="true">+</span>
      </IconButton>
      <IconButton
        aria-label="Reset sparks"
        tone="neutral"
        variant="outline"
        onClick={() => {
          setCount(0);
        }}
      >
        <span aria-hidden="true">↺</span>
      </IconButton>
      <output aria-live="polite">{count} sparks</output>
    </Inline>
  );
}
