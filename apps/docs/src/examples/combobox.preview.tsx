import { Combobox, Field } from "@flux-ui/react";
import { useState } from "react";
const options = [
  { value: "design", label: "Design" },
  { value: "engineering", label: "Engineering" },
  { value: "research", label: "Research" },
  { value: "archive", label: "Archived team", disabled: true },
];
export default function Example() {
  const [value, setValue] = useState<string | null>("design");
  return (
    <Field.Root description="Type to filter. Use arrows and Enter to commit a team; Escape closes suggestions.">
      <Field.Label>Assign to team</Field.Label>
      <Field.Control>
        <Combobox
          options={options}
          value={value}
          onValueChange={setValue}
          name="team"
          listLabel="Available teams"
        />
      </Field.Control>
    </Field.Root>
  );
}
