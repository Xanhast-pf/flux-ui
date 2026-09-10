import { Button, Card, Inline, Skeleton, Stack } from "@flux-ui/react";
import { useState } from "react";
export default function Example() {
  const [loaded, setLoaded] = useState(false);
  return (
    <Stack gap="md">
      <p role="status">
        {loaded
          ? "Preview content is ready."
          : "Loading layout preview. Use the button to reveal the content."}
      </p>
      <Card aria-busy={!loaded}>
        {loaded ? (
          <p>A small placeholder, replaced by real content.</p>
        ) : (
          <Stack gap="md">
            <Inline gap="md">
              <Skeleton shape="circle" />
              <Skeleton style={{ width: "60%" }} />
            </Inline>
            <Skeleton />
            <Skeleton style={{ width: "80%" }} />
          </Stack>
        )}
      </Card>
      <Button
        onClick={() => {
          setLoaded((value) => !value);
        }}
      >
        {loaded ? "Show placeholders" : "Reveal content"}
      </Button>
    </Stack>
  );
}
