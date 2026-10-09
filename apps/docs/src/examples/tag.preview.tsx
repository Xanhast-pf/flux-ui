import { Button, Inline, Tag, Text } from "@varua/flux-ui";
import { useRef, useState } from "react";

export default function PassiveTags() {
  return (
    <Inline wrap gap="sm">
      <Tag>Design</Tag>
      <Tag tone="accent">Frontend</Tag>
    </Inline>
  );
}

export function RemovableTag() {
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
