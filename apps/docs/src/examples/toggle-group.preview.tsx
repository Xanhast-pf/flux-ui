import { Stack, Text, ToggleGroup } from "@flux-ui/react";
import { useState } from "react";
export default function Example() {
  const [formats, setFormats] = useState<readonly string[]>(["bold"]);
  return (
    <Stack gap="md">
      <ToggleGroup.Root
        type="multiple"
        value={formats}
        onValueChange={setFormats}
        aria-label="Text formatting"
      >
        <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
        <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
        <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
      </ToggleGroup.Root>
      <Text
        as="p"
        variant="body"
        weight={formats.includes("bold") ? "bold" : "regular"}
        italic={formats.includes("italic")}
        decoration={formats.includes("underline") ? "underline" : "none"}
      >
        Good design is a team sport.
      </Text>
      <Text as="p" variant="body" tone="muted">
        Use arrows to move focus; Space or Enter changes selection.
      </Text>
    </Stack>
  );
}
