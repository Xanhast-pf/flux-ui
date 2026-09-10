import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../Input/Input.js";
import { Field } from "./Field.js";

const meta = {
  title: "Inputs/Field",
  component: Field.Root,
} satisfies Meta<typeof Field.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Field.Root>
      <Field.Label>Email address</Field.Label>
      <Field.Control>
        <Input type="email" placeholder="jo@example.com" />
      </Field.Control>
      <Field.Description>Used for account notifications.</Field.Description>
    </Field.Root>
  ),
};

export const Required: Story = {
  render: () => (
    <Field.Root required>
      <Field.Label>Display name</Field.Label>
      <Field.Control>
        <Input />
      </Field.Control>
    </Field.Root>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field.Root invalid>
      <Field.Label>Email address</Field.Label>
      <Field.Control>
        <Input defaultValue="not-an-email" type="email" />
      </Field.Control>
      <Field.Error>Enter a valid email address.</Field.Error>
    </Field.Root>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Field.Root disabled>
      <Field.Label>Organization</Field.Label>
      <Field.Control>
        <Input defaultValue="Flux UI" />
      </Field.Control>
      <Field.Description>
        This field is currently unavailable.
      </Field.Description>
    </Field.Root>
  ),
};
