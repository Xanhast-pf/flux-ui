import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Field } from "../Field/Field.js";
import { Inline } from "../Inline/Inline.js";
import { Stack } from "../Stack/Stack.js";
import { RadioGroup } from "./RadioGroup.js";
import type { RadioGroupValue } from "./RadioGroup.types.js";

const meta = {
  title: "Inputs/RadioGroup",
  component: RadioGroup.Root,
  args: {
    name: "release-channel",
  },
} satisfies Meta<typeof RadioGroup.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

const OPTIONS = [
  ["stable", "Stable"],
  ["beta", "Beta"],
  ["canary", "Canary"],
] as const;

function Options() {
  return (
    <Stack gap="sm">
      {OPTIONS.map(([value, label]) => (
        <Field.Root controlId={`radio-story-${value}`} key={value}>
          <Inline gap="sm">
            <Field.Control>
              <RadioGroup.Item value={value} />
            </Field.Control>
            <Field.Label>{label}</Field.Label>
          </Inline>
        </Field.Root>
      ))}
    </Stack>
  );
}

export const Default: Story = {
  args: {
    defaultValue: "stable",
    name: "release-channel",
  },
  render: (args) => (
    <RadioGroup.Root {...args}>
      <RadioGroup.Legend>Release channel</RadioGroup.Legend>
      <Options />
    </RadioGroup.Root>
  ),
};

export const Required: Story = {
  args: {
    name: "required-channel",
    required: true,
  },
  render: (args) => (
    <RadioGroup.Root {...args}>
      <RadioGroup.Legend>Release channel</RadioGroup.Legend>
      <Options />
    </RadioGroup.Root>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: "stable",
    disabled: true,
    name: "disabled-channel",
  },
  render: (args) => (
    <RadioGroup.Root {...args}>
      <RadioGroup.Legend>Release channel</RadioGroup.Legend>
      <Options />
    </RadioGroup.Root>
  ),
};

function ControlledExample() {
  const [value, setValue] = useState<RadioGroupValue>("stable");
  return (
    <RadioGroup.Root
      name="controlled-channel"
      value={value}
      onValueChange={setValue}
    >
      <RadioGroup.Legend>Release channel</RadioGroup.Legend>
      <Options />
    </RadioGroup.Root>
  );
}

export const Controlled: Story = {
  args: {
    name: "controlled-channel",
  },
  render: () => <ControlledExample />,
};
