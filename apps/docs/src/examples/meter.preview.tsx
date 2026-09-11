import { Meter, Stack, Text } from "@flux-ui/react";

export default function Preview() {
  return (
    <Stack gap="sm">
      <Text as="p">Measured budget usage: 62%.</Text>
      <Meter aria-label="Measured budget usage" min={0} max={100} value={62}>
        62%
      </Meter>
      <Text as="p" variant="caption" tone="muted">
        Missing measurements should render a pending state, not a zero-value
        meter.
      </Text>
    </Stack>
  );
}
