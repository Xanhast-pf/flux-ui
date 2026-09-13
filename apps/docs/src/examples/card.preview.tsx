import {
  Badge,
  Button,
  Card,
  Heading,
  Inline,
  Stack,
  Text,
} from "@flux-ui/react";
import { useState } from "react";

export default function Example() {
  const [clicked, setClicked] = useState(false);
  return (
    <Card>
      <Stack gap="md">
        <Inline justify="between" wrap>
          <Heading level={2} size="md">
            Ship in small pieces.
          </Heading>
          <Badge tone="accent">Composed</Badge>
        </Inline>
        <Text as="p" variant="body">
          Cards provide the surface. Your content supplies the meaning.
        </Text>
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
