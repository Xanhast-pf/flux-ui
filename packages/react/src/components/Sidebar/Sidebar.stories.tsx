import type { Meta, StoryObj } from "@storybook/react-vite";
import { Sidebar } from "./Sidebar.js";
const meta = {
  title: "Layout/Sidebar",
  component: Sidebar.Root,
} satisfies Meta<typeof Sidebar.Root>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <Sidebar.Root defaultOpen>
      <Sidebar.Toggle>Toggle navigation</Sidebar.Toggle>
      <Sidebar.Layout>
        <Sidebar.Panel aria-label="Workspace navigation">
          Navigation
        </Sidebar.Panel>
        <Sidebar.Content>Content remains interactive.</Sidebar.Content>
      </Sidebar.Layout>
    </Sidebar.Root>
  ),
};
