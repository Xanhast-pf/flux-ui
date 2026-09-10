import { Field, Select } from "@flux-ui/react";
import { useState } from "react";

export default function Example() {
  const [value, setValue] = useState("preview");
  return (
    <Field.Root>
      <Field.Label>Preview environment</Field.Label>
      <Field.Control>
        <Select
          value={value}
          onChange={(event) => {
            setValue(event.currentTarget.value);
          }}
        >
          <optgroup label="Available">
            <option value="preview">Preview</option>
            <option value="staging">Staging</option>
          </optgroup>
          <option value="production" disabled>
            Production (unavailable)
          </option>
        </Select>
      </Field.Control>
      <Field.Description>
        Selected: {value}. Try the native keyboard controls.
      </Field.Description>
    </Field.Root>
  );
}
