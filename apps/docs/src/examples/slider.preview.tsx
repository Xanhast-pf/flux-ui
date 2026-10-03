import {
  Button,
  Field,
  Inline,
  Select,
  Slider,
  Stack,
  Text,
} from "@flux-ui/react";
import { useState } from "react";

const volumeMarks = [
  { value: 0, label: "Mute" },
  25,
  50,
  75,
  { value: 100, label: "Max" },
] as const;

export default function Example() {
  const [value, setValue] = useState(40);
  const [vertical, setVertical] = useState(false);
  return (
    <Stack gap="md">
      <Field.Root>
        <Field.Label>Slider orientation</Field.Label>
        <Field.Control>
          <Select
            value={vertical ? "vertical" : "horizontal"}
            onChange={(event) =>
              setVertical(event.currentTarget.value === "vertical")
            }
          >
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </Select>
        </Field.Control>
      </Field.Root>
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
            orientation={vertical ? "vertical" : "horizontal"}
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
      <Inline gap="md">
        <Button variant="outline" onClick={() => setValue(40)}>
          Reset volume
        </Button>
        <Text tone="muted">
          Native range with optional marks and value output.
        </Text>
      </Inline>
    </Stack>
  );
}
