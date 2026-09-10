import { Field, Input, Stack } from "@flux-ui/react";

export default function Example() {
  return (
    <Stack gap="lg">
      <Field.Root id="field-demo-email" required>
        <Field.Label>Work email</Field.Label>
        <Field.Control>
          <Input type="email" placeholder="jo@example.com" />
        </Field.Control>
        <Field.Description>
          Used for account and project notifications.
        </Field.Description>
      </Field.Root>
      <Field.Root id="field-demo-invalid" invalid>
        <Field.Label>Invalid email</Field.Label>
        <Field.Control>
          <Input defaultValue="not-an-email" type="email" />
        </Field.Control>
        <Field.Error>Enter a valid email address.</Field.Error>
      </Field.Root>
    </Stack>
  );
}
