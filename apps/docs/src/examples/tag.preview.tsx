import { Button, Inline, Tag, Text } from "@flux-ui/react";
import { useRef, useState } from "react";
export default function Example() {
  const [removed, setRemoved] = useState(false);
  const reset = useRef<HTMLButtonElement>(null);
  return (
    <Inline wrap gap="sm">
      {removed ? (
        <Text role="status">Design filter removed.</Text>
      ) : (
        <Tag
          tone="accent"
          removeLabel="Remove Design filter"
          onRemove={() => {
            setRemoved(true);
            reset.current?.focus();
          }}
        >
          Design
        </Tag>
      )}
      <Button
        ref={reset}
        variant="outline"
        size="sm"
        onClick={() => setRemoved(false)}
      >
        Reset filter
      </Button>
    </Inline>
  );
}
