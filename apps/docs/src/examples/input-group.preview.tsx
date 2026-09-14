import { Field, InputGroup } from "@flux-ui/react";
export default function Example() {
  return (
    <Field.Root description="The prefix is decorative; the label supplies the currency.">
      <Field.Label>Amount in US dollars</Field.Label>
      <InputGroup.Root>
        <InputGroup.Addon aria-hidden="true">USD</InputGroup.Addon>
        <Field.Control>
          <InputGroup.Input type="number" min={0} step={1} defaultValue={120} />
        </Field.Control>
      </InputGroup.Root>
    </Field.Root>
  );
}
