import { Card, Grid, Text, ThemeScope } from "@flux-ui/react";
import "@flux-ui/tokens/presets.css";

export default function Preview() {
  return (
    <ThemeScope
      theme="paper"
      query
      padding={6}
      surface="canvas"
      border="all"
      radius="md"
    >
      <Grid columns={{ base: 1, md: 2 }} responsiveTo="container" gap="md">
        <Card>
          <Text as="p">Paper is an optional complete palette.</Text>
        </Card>
        <Card>
          <Text as="p">
            These columns follow this canvas, not the browser width.
          </Text>
        </Card>
      </Grid>
    </ThemeScope>
  );
}
