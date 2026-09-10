import { Badge, Button, Card, Inline, Stack } from "@flux-ui/react";
import { useState } from "react";

export default function Example() {
  const [clicked, setClicked] = useState(false);
  return (
    <Card>
      <Stack gap="md">
        <Inline justify="between" wrap>
          <h2>Ship in small pieces.</h2>
          <Badge tone="accent">Composed</Badge>
        </Inline>
        <p>Cards provide the surface. Your content supplies the meaning.</p>
        <Button
          onClick={() => {
            setClicked(true);
          }}
        >
          {clicked ? "That is a real Flux button." : "Try this action"}
        </Button>
      </Stack>
    </Card>
  );
}
