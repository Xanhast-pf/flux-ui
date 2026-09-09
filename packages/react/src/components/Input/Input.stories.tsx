import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input.js";

const meta = {
  title: "Inputs/Input",
  component: Input,
  args: {
    "aria-label": "Email address",
    placeholder: "jo@example.com",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Search: Story = {
  args: { type: "search", placeholder: "Search projects" },
};
export const Invalid: Story = {
  args: { "aria-invalid": "true", defaultValue: "not-an-email", type: "email" },
  render: (args) => (
    <div>
      <Input {...args} aria-describedby="storybook-input-error" />
      <p id="storybook-input-error">Enter a valid email address.</p>
    </div>
  ),
};
export const ReadOnly: Story = {
  args: { defaultValue: "Read-only value", readOnly: true },
};
export const Disabled: Story = {
  args: { defaultValue: "Disabled value", disabled: true },
};
