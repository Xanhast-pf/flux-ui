import { Card, Grid, Sparkline, Stack, Text } from "@flux-ui/react";
export default function Preview() {
  return (
    <Grid columns={{ base: 1, md: 2 }} gap="md">
      <Card>
        <Stack gap="md">
          <Text weight="bold">Weekly activity</Text>
          <Sparkline
            label="Activity: 2, 4, 3, 7, 5, 9, 8"
            values={[2, 4, 3, 7, 5, 9, 8]}
          />
        </Stack>
      </Card>
      <Card>
        <Stack gap="md">
          <Text weight="bold">Missing samples stay missing</Text>
          <Sparkline
            label="Readings: 2, 3, missing, 6, 7"
            values={[2, 3, null, 6, 7]}
          />
        </Stack>
      </Card>
    </Grid>
  );
}
