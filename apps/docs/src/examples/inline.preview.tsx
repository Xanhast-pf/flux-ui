import { Button, Card, Inline, Text } from "@flux-ui/react";

export default function Example() {
  return (
    <Card padding={3}>
      <Inline gap="sm" justify="between" wrap>
        <Text as="strong" weight="bold">
          Actions
        </Text>
        <Inline gap="sm" wrap>
          <Button size="sm" variant="outline">
            Export
          </Button>
          <Button size="sm">Create</Button>
        </Inline>
      </Inline>
    </Card>
  );
}
