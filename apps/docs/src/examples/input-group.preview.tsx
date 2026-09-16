import { Field, InputGroup, NumberField, Stack, Text } from "@flux-ui/react";
import { useState } from "react";
export default function Preview() {
  const [amount, setAmount] = useState<number | null>(120);
  return (
    <Stack gap="md">
      <Field.Root description="In US dollars. Empty input is reported as null.">
        <Field.Label>Amount</Field.Label>
        <InputGroup.Root>
          <InputGroup.Addon aria-hidden="true">USD</InputGroup.Addon>
          <Field.Control>
            <NumberField
              min={0}
              step={1}
              value={amount ?? ""}
              onValueChange={setAmount}
            />
          </Field.Control>
        </InputGroup.Root>
      </Field.Root>
      <Text role="status">
        {amount === null ? "No amount entered" : `${amount} USD`}
      </Text>
    </Stack>
  );
}
