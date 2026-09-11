import { Box, Text } from "@flux-ui/react";
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
    <Box role="group" aria-label={label} className="comparison-bars">
      <Text className="chart-label" as="p" variant="body">
        {label}
      </Text>
      {[
        { name: "Native React", value: native, className: "bar-native" },
        { name: "Flux UI", value: flux, className: "bar-flux" },
      ].map((entry) => (
        <Box key={entry.name} className="comparison-row">
          <Text>{entry.name}</Text>
          <span aria-hidden="true" className="bar-track">
            <span
              className={entry.className}
              style={{ width: `${(entry.value / maximum) * 100}%` }}
            />
          </span>
          <Text as="strong" weight="bold">
            {formatMs(entry.value)}
          </Text>
        </Box>
      ))}
    </Box>
  );
}
