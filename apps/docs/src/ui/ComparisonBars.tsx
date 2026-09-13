import { Card, Grid, Meter, Stack, Text } from "@flux-ui/react";
import { formatMs } from "../lib/format.js";
export function ComparisonBars({
  label,
  native,
  flux,
}: {
  label: string;
  native: number;
  flux: number;
}) {
  const maximum = Math.max(native, flux, 0.01);
  return (
    <Card role="group" aria-label={label}>
      <Stack gap="md">
        <Text as="p" weight="medium">
          {label}
        </Text>
        {[
          { name: "Native React", value: native },
          { name: "Flux UI", value: flux },
        ].map((entry) => (
          <Stack key={entry.name} gap="xs">
            <Grid templateColumns="minmax(0, 1fr) auto" gap="sm">
              <Text>{entry.name}</Text>
              <Text numeric align="end" weight="medium">
                {formatMs(entry.value)}
              </Text>
            </Grid>
            <Meter
              aria-label={`${entry.name} ${label} milliseconds`}
              value={entry.value}
              max={maximum}
            />
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
