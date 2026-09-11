import { Field, Fieldset, Input } from "@flux-ui/react";

export default function Preview() {
  return (
    <Fieldset disabled>
      <Fieldset.Legend>Archived workspace</Fieldset.Legend>
      <Field.Root>
        <Field.Label>Project name</Field.Label>
        <Field.Control>
          <Input defaultValue="Archived project" />
        </Field.Control>
        <Field.Description>
          The native disabled fieldset disables its controls.
        </Field.Description>
      </Field.Root>
    </Fieldset>
  );
}
