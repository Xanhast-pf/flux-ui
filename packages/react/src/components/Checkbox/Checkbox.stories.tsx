import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Field } from "../Field/Field.js";
import { Inline } from "../Inline/Inline.js";
import { Checkbox } from "./Checkbox.js";
import type { CheckboxProps } from "./Checkbox.types.js";

const meta = {
  title: "Inputs/Checkbox",
  component: Checkbox,
  args: { "aria-label": "Release updates" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Checked: Story = { args: { defaultChecked: true } };
export const Indeterminate: Story = {
  args: { indeterminate: true },
};
export const Disabled: Story = { args: { disabled: true } };
export const DisabledChecked: Story = {
  args: { defaultChecked: true, disabled: true },
};
export const Invalid: Story = { args: { "aria-invalid": "true" } };

function ControlledExample({ onCheckedChange, ...args }: CheckboxProps) {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      {...args}
      checked={checked}
      onCheckedChange={(nextChecked, event) => {
        setChecked(nextChecked);
        onCheckedChange?.(nextChecked, event);
      }}
    />
  );
}

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
};

export const WithField: Story = {
  args: { "aria-label": undefined },
  render: (args) => (
    <Field.Root required>
      <Inline gap="sm">
        <Field.Control>
          <Checkbox {...args} name="terms" value="accepted" />
        </Field.Control>
        <Field.Label>Accept the project terms</Field.Label>
      </Inline>
      <Field.Description>
        Required before joining the project.
      </Field.Description>
    </Field.Root>
  ),
};
