import { DateTimePicker, Field } from "@flux-ui/react";

export default function Example() {
  return (
    <Field.Root>
      <Field.Label>Local appointment</Field.Label>
      <Field.Control>
        <DateTimePicker
          name="local-appointment"
          defaultValue="2026-10-01T14:30"
          min="2026-10-01T09:00"
          max="2026-10-01T18:00"
        />
      </Field.Control>
      <Field.Description>
        This is a local civil datetime, not a timezone-aware instant.
      </Field.Description>
    </Field.Root>
  );
}
