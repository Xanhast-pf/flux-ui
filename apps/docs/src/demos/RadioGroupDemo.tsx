import {
  Box,
  Button,
  Field,
  Inline,
  RadioGroup,
  Stack,
  Text,
} from "@flux-ui/react";
import { useState } from "react";
const initialEnvironment = "staging";
function RadioOption({
  controlId,
  description,
  disabled = false,
  label,
  value,
}: {
  controlId: string;
  description?: string | undefined;
  disabled?: boolean | undefined;
  label: string;
  value: string;
}) {
  return (
    <Field.Root controlId={controlId} disabled={disabled}>
      <Inline gap="sm">
        <Field.Control>
          <RadioGroup.Item value={value} />
        </Field.Control>
        <Field.Label>{label}</Field.Label>
      </Inline>
      {description === undefined ? null : (
        <Field.Description>{description}</Field.Description>
      )}
    </Field.Root>
  );
}
export function RadioGroupDemo() {
  const [environment, setEnvironment] = useState(initialEnvironment);
  return (
    <Box
      aria-label="Radio preferences"
      onReset={() => {
        setEnvironment(initialEnvironment);
      }}
      as="form"
    >
      <Stack gap="lg">
        <RadioGroup.Root
          aria-describedby="radio-demo-channel-help"
          defaultValue="stable"
          name="release-channel"
          required
        >
          <RadioGroup.Legend>Release channel</RadioGroup.Legend>
          <Stack gap="md">
            <Text
              id="radio-demo-channel-help"
              as="p"
              variant="caption"
              tone="muted"
            >
              Native arrow-key navigation moves the selected option.
            </Text>
            <Stack gap="sm">
              <RadioOption
                controlId="radio-demo-stable"
                description="Recommended for production applications."
                label="Stable"
                value="stable"
              />
              <RadioOption
                controlId="radio-demo-beta"
                description="Preview upcoming APIs before they become stable."
                label="Beta"
                value="beta"
              />
              <RadioOption
                controlId="radio-demo-canary"
                disabled
                label="Canary (unavailable)"
                value="canary"
              />
            </Stack>
          </Stack>
        </RadioGroup.Root>

        <RadioGroup.Root
          name="environment"
          onValueChange={setEnvironment}
          value={environment}
        >
          <RadioGroup.Legend>Deployment environment</RadioGroup.Legend>
          <Stack gap="sm">
            <RadioOption
              controlId="radio-demo-staging"
              label="Staging"
              value="staging"
            />
            <RadioOption
              controlId="radio-demo-production"
              label="Production"
              value="production"
            />
          </Stack>
        </RadioGroup.Root>

        <Inline gap="sm" wrap>
          <Button type="reset" variant="outline">
            Reset radio groups
          </Button>
        </Inline>
      </Stack>
    </Box>
  );
}
