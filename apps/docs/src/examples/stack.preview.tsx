import { Card, Stack, Text } from "@varua/flux-ui";
export default function Example() {
  return (
    <Card padding={3}>
      <Stack gap="sm" data-testid="example-stack">
        <Card key="First" surface="subtle" padding={3}>
          <Text>First</Text>
        </Card>
        <Card key="Second" surface="subtle" padding={3}>
          <Text>Second</Text>
        </Card>
        <Card key="Third" surface="subtle" padding={3}>
          <Text>Third</Text>
        </Card>
      </Stack>
    </Card>
  );
}
