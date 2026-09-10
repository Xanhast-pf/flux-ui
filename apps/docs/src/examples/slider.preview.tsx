import { Field, Slider } from "@flux-ui/react";
import { useState } from "react";

export default function Example() {
  const [value, setValue] = useState(40);
  return (
    <Field.Root>
      <Field.Label>Preview volume</Field.Label>
      <Field.Control>
        <Slider
          min={0}
          max={100}
          step={5}
          defaultValue={40}
          onValueChange={setValue}
          aria-valuetext={`${value}%`}
        />
      </Field.Control>
      <Field.Description>
        Volume: {value}%. Focus the slider and use the arrow keys.
      </Field.Description>
    </Field.Root>
  );
}
