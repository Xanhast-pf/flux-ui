import { Stack, ToggleGroup } from "@flux-ui/react";
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
      <p
        style={{
          fontWeight: formats.includes("bold") ? 700 : 400,
          fontStyle: formats.includes("italic") ? "italic" : "normal",
          textDecoration: formats.includes("underline") ? "underline" : "none",
        }}
      >
        Good design is a team sport.
      </p>
      <p className="demo-help">
        Use arrows to move focus; Space or Enter changes selection.
      </p>
    </Stack>
  );
}
