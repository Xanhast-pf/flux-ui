import { Card, Grid, Text } from "@flux-ui/react";
export default function Example() {
  return (
    <Card padding={3}>
      <Grid data-testid="example-grid" minColumnWidth="7rem" gap="sm">
        <Card key="One" surface="subtle" padding={3}>
          <Text>One</Text>
        </Card>
        <Card key="Two" surface="subtle" padding={3}>
          <Text>Two</Text>
        </Card>
        <Card key="Three" surface="subtle" padding={3}>
          <Text>Three</Text>
        </Card>
        <Card key="Four" surface="subtle" padding={3}>
          <Text>Four</Text>
        </Card>
      </Grid>
    </Card>
  );
}
