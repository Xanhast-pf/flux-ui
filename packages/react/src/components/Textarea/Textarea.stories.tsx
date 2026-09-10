import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "../Field/Field.js";
import { Textarea } from "./Textarea.js";

const meta = {
  title: "Inputs/Textarea",
  component: Textarea,
  args: {
    "aria-label": "Project notes",
    placeholder: "Add context for the team...",
    rows: 4,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithField: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Project notes</Field.Label>
      <Field.Control>
        <Textarea placeholder="Add context for the team..." rows={4} />
      </Field.Control>
      <Field.Description>
        Keep this concise enough for teammates to scan quickly.
      </Field.Description>
    </Field.Root>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field.Root invalid>
      <Field.Label>Release notes</Field.Label>
      <Field.Control>
        <Textarea defaultValue="Too short" rows={4} />
      </Field.Control>
      <Field.Error>
        Add enough detail for consumers to understand the change.
      </Field.Error>
    </Field.Root>
  ),
};

export const ReadOnly: Story = {
  args: { defaultValue: "Read-only notes", readOnly: true },
};

export const Disabled: Story = {
  args: { defaultValue: "Unavailable notes", disabled: true },
};
