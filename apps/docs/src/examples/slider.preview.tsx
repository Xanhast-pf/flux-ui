import { Button, Field, Inline, Slider, Stack, Text } from "@flux-ui/react";
import { useState } from "react";

const volumeMarks = [
  { value: 0, label: "Mute" },
  25,
  50,
  75,
  { value: 100, label: "Max" },
] as const;

export default function CustomHorizontalSlider() {
  const [value, setValue] = useState(40);
  return (
    <Stack gap="md">
      <Field.Root>
        <Field.Label>Preview volume</Field.Label>
        <Field.Control>
          <Slider
            min={0}
            max={100}
            step={5}
            value={value}
            onValueChange={setValue}
            appearance="custom"
            resetValue={40}
            marks={volumeMarks}
            showValue
            formatValue={(next) => `${next}%`}
            aria-valuetext={`${value}%`}
          />
        </Field.Control>
        <Field.Description>
          Volume: {value}%. Use arrow keys; double-click to reset to 40%.
        </Field.Description>
      </Field.Root>
      <Button variant="outline" onClick={() => setValue(40)}>
        Reset volume
      </Button>
    </Stack>
  );
}

export function VerticalSlider() {
  const [value, setValue] = useState(65);
  return (
    <Inline gap="md">
      <Slider
        aria-label="Vertical level"
        min={0}
        max={100}
        value={value}
        onValueChange={setValue}
        appearance="custom"
        orientation="vertical"
        showValue
        formatValue={(next) => `${next}%`}
      />
      <Text tone="muted">Minimum is at the bottom.</Text>
    </Inline>
  );
}

export function NativeSlider() {
  return (
    <Stack gap="sm">
      <Text>Browser-native appearance</Text>
      <Slider aria-label="Native range example" defaultValue={60} />
    </Stack>
  );
}
