import { Button, Inline, Text, VisuallyHidden } from "@flux-ui/react";
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
        <Text aria-hidden="true">+</Text>
        <VisuallyHidden>Add a hidden-label spark</VisuallyHidden>
      </Button>
      <Text as="p" variant="body" role="status">
        {count} sparks. The plus button has a full screen-reader name.
      </Text>
    </Inline>
  );
}
