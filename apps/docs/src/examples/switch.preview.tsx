import { Field, Inline, Switch } from "@flux-ui/react";
import { useState } from "react";

export default function Example() {
  const [enabled, setEnabled] = useState(true);
  return (
    <Field.Root>
      <Inline justify="between">
        <Field.Label>Activity notifications</Field.Label>
        <Field.Control>
          <Switch
            defaultChecked
            onCheckedChange={setEnabled}
            name="notifications"
            value="on"
          />
        </Field.Control>
      </Inline>
      <Field.Description>
        Notifications are {enabled ? "on" : "off"}. The label stays the same.
      </Field.Description>
    </Field.Root>
  );
}
