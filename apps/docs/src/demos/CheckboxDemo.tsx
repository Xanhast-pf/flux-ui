import {
  Box,
  Button,
  Checkbox,
  Field,
  Fieldset,
  Inline,
  Stack,
} from "@flux-ui/react";
import { useState } from "react";
const initialChannels = { email: true, push: false };
export function CheckboxDemo() {
  const [channels, setChannels] = useState(initialChannels);
  const [accepted, setAccepted] = useState(false);
  const allSelected = channels.email && channels.push;
  const someSelected = channels.email !== channels.push;
  return (
    <Box
      aria-label="Checkbox preferences"
      onReset={() => {
        // The browser resets defaultChecked; the demo owns controlled state.
        setChannels(initialChannels);
        setAccepted(false);
      }}
      as="form"
    >
      <Stack gap="lg">
        <Field.Root controlId="checkbox-demo-updates">
          <Inline gap="sm">
            <Field.Control>
              <Checkbox defaultChecked name="updates" value="yes" />
            </Field.Control>
            <Field.Label>Release updates</Field.Label>
          </Inline>
          <Field.Description>
            An uncontrolled checkbox; reset restores its initial selection.
          </Field.Description>
        </Field.Root>

        <Fieldset>
          <Fieldset.Legend>Delivery channels</Fieldset.Legend>
          <Stack gap="md">
            <Field.Root controlId="checkbox-demo-all">
              <Inline gap="sm">
                <Field.Control>
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onCheckedChange={(checked) => {
                      setChannels({ email: checked, push: checked });
                    }}
                  />
                </Field.Control>
                <Field.Label>All channels</Field.Label>
              </Inline>
              <Field.Description>
                Mixed while only some channels are selected.
              </Field.Description>
            </Field.Root>
            <Field.Root controlId="checkbox-demo-email">
              <Inline gap="sm">
                <Field.Control>
                  <Checkbox
                    checked={channels.email}
                    name="channel"
                    onCheckedChange={(checked) => {
                      setChannels((current) => ({
                        ...current,
                        email: checked,
                      }));
                    }}
                    value="email"
                  />
                </Field.Control>
                <Field.Label>Email notifications</Field.Label>
              </Inline>
            </Field.Root>
            <Field.Root controlId="checkbox-demo-push">
              <Inline gap="sm">
                <Field.Control>
                  <Checkbox
                    checked={channels.push}
                    name="channel"
                    onCheckedChange={(checked) => {
                      setChannels((current) => ({ ...current, push: checked }));
                    }}
                    value="push"
                  />
                </Field.Control>
                <Field.Label>Push notifications</Field.Label>
              </Inline>
            </Field.Root>
          </Stack>
        </Fieldset>

        <Field.Root
          controlId="checkbox-demo-terms"
          invalid={!accepted}
          required
        >
          <Inline gap="sm">
            <Field.Control>
              <Checkbox
                checked={accepted}
                name="terms"
                onCheckedChange={setAccepted}
                value="accepted"
              />
            </Field.Control>
            <Field.Label>Accept the project terms</Field.Label>
          </Inline>
          <Field.Error>Accept the terms to complete this example.</Field.Error>
        </Field.Root>

        <Field.Root controlId="checkbox-demo-managed" disabled>
          <Inline gap="sm">
            <Field.Control>
              <Checkbox defaultChecked name="managed" value="yes" />
            </Field.Control>
            <Field.Label>Managed by your organization</Field.Label>
          </Inline>
        </Field.Root>

        <Inline gap="sm" wrap>
          <Button type="reset" variant="outline">
            Reset preferences
          </Button>
        </Inline>
      </Stack>
    </Box>
  );
}
