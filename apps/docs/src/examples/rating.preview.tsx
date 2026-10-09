import { useState } from "react";
import { Box, Rating, Stack, Text, type RatingValue } from "@varua/flux-ui";

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

export function ReadOnlyRating() {
  return (
    <Stack gap="sm">
      <Text as="strong">Average customer rating</Text>
      <Rating
        aria-label="Average customer rating"
        value={4.5}
        step={0.5}
        readOnly
      />
      <Text as="p" variant="caption" tone="muted">
        4.5 of 5 stars from verified reviews.
      </Text>
    </Stack>
  );
}
