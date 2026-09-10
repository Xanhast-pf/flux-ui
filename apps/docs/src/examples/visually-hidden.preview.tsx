import { Button, Inline, VisuallyHidden } from "@flux-ui/react";
import { useState } from "react";
export default function Example() {
  const [count, setCount] = useState(0);
  return (
    <Inline gap="md" wrap>
      <Button
        onClick={() => {
          setCount((value) => value + 1);
        }}
      >
        <span aria-hidden="true">+</span>
        <VisuallyHidden>Add a hidden-label spark</VisuallyHidden>
      </Button>
      <p role="status">
        {count} sparks. The plus button has a full screen-reader name.
      </p>
    </Inline>
  );
}
