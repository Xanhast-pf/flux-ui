import { Field, TimePicker } from "@flux-ui/react";

export default function Example() {
  return (
    <Field.Root>
      <Field.Label>Appointment time</Field.Label>
      <Field.Control>
        <TimePicker
          name="appointment-time"
          defaultValue="14:30"
          min="09:00"
          max="18:00"
        />
      </Field.Control>
      <Field.Description>
        A local civil time has no timezone or date attached.
      </Field.Description>
    </Field.Root>
  );
}
