import { DatePicker, Field } from "@varua/flux-ui";

export default function Example() {
  return (
    <Field.Root>
      <Field.Label>Delivery date</Field.Label>
      <Field.Control>
        <DatePicker
          name="delivery-date"
          defaultValue="2026-10-01"
          min="2026-01-01"
          max="2026-12-31"
        />
      </Field.Control>
      <Field.Description>
        A civil date stays serialized as YYYY-MM-DD.
      </Field.Description>
    </Field.Root>
  );
}
