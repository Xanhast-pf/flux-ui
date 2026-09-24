import { Field, Textarea } from "@flux-ui/react";

export default function Example() {
  return (
    <Field.Root id="textarea-demo-notes">
      <Field.Label>Project notes</Field.Label>
      <Field.Control>
        <Textarea placeholder="Add context for the team..." rows={4} />
      </Field.Control>
      <Field.Description>
        Native values, events, forms, refs, and resizing remain available.
      </Field.Description>
    </Field.Root>
  );
}
