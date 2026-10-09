import { Button, Field, Stack, Textarea } from "@varua/flux-ui";

export default function Example() {
  return (
    <Stack as="form" gap="sm">
      <Field.Root id="textarea-demo-notes">
        <Field.Label>Project notes</Field.Label>
        <Field.Control>
          <Textarea
            autoSize
            maxRows={6}
            minRows={2}
            placeholder="Add context for the team..."
          />
        </Field.Control>
        <Field.Description>
          Grows with content up to six rows while native values, forms, refs,
          and events remain available.
        </Field.Description>
      </Field.Root>
      <Button size="sm" type="reset" variant="outline">
        Reset notes
      </Button>
    </Stack>
  );
}
