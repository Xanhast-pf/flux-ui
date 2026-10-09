import { Combobox, Field } from "@varua/flux-ui";
import { useState } from "react";
const options = [
  { value: "design", label: "Design", group: "Product" },
  { value: "research", label: "Research", group: "Product" },
  { value: "engineering", label: "Engineering", group: "Engineering" },
  {
    value: "archive",
    label: "Archived team",
    group: "Engineering",
    disabled: true,
  },
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
