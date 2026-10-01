import { useState } from "react";
import { Box, Rating, Stack, Text, type RatingValue } from "@flux-ui/react";

export default function Preview() {
  const [value, setValue] = useState<RatingValue>(3.5);

  return (
    <Box aria-label="Rating example" as="form">
      <Stack gap="sm">
        <Text as="strong">Product quality</Text>
        <Rating
          aria-label="Product quality"
          name="quality"
          step={0.5}
          value={value}
          onValueChange={setValue}
        />
        <Text as="p" role="status" variant="caption" tone="muted">
          {value === null ? "No rating selected" : `${value} of 5 stars`}
        </Text>
      </Stack>
    </Box>
  );
}
