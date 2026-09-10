import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collapsible } from "./Collapsible.js";
const meta = {
  title: "Disclosure/Collapsible",
  component: Collapsible.Root,
} satisfies Meta<typeof Collapsible.Root>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {},
  render: () => (
    <Collapsible.Root>
      <Collapsible.Trigger>How does this work?</Collapsible.Trigger>
      <Collapsible.Content>The browser handles disclosure.</Collapsible.Content>
    </Collapsible.Root>
  ),
};
