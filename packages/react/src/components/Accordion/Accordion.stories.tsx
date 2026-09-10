import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "./Accordion.js";
const meta = {
  title: "Disclosure/Accordion",
  component: Accordion.Root,
  args: { type: "single" },
} satisfies Meta<typeof Accordion.Root>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { type: "single" },
  render: (args) => (
    <Accordion.Root {...args}>
      <Accordion.Item open>
        <Accordion.Trigger>Native behavior</Accordion.Trigger>
        <Accordion.Content>
          Details and summary own expansion.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Trigger>Multiple mode</Accordion.Trigger>
        <Accordion.Content>
          Set type to multiple to leave several open.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};
export const Multiple: Story = {
  args: { type: "multiple" },
  render: (args) => (
    <Accordion.Root {...args}>
      <Accordion.Item open>
        <Accordion.Trigger>Native behavior</Accordion.Trigger>
        <Accordion.Content>
          Details and summary own expansion.
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item>
        <Accordion.Trigger>Multiple mode</Accordion.Trigger>
        <Accordion.Content>
          Set type to multiple to leave several open.
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  ),
};
