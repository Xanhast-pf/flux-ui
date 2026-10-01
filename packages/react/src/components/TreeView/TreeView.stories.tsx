import type { Meta, StoryObj } from "@storybook/react-vite";
import { TreeView } from "./TreeView.js";

const meta = {
  title: "Navigation/TreeView",
  component: TreeView.Root,
  args: {
    "aria-label": "Project files",
    defaultValue: ["src"],
  },
} satisfies Meta<typeof TreeView.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function ProjectTree() {
  return (
    <>
      <TreeView.Item value="src" label="src">
        <TreeView.Item value="src/components" label="components">
          <TreeView.Item value="src/components/button" label="Button.tsx" />
          <TreeView.Item value="src/components/input" label="Input.tsx" />
        </TreeView.Item>
        <TreeView.Item value="src/index" label="index.ts" />
      </TreeView.Item>
      <TreeView.Item value="package" label="package.json" />
      <TreeView.Item value="readme" label="README.md" />
    </>
  );
}

export const Default: Story = {
  render: (args) => (
    <TreeView.Root {...args}>
      <ProjectTree />
    </TreeView.Root>
  ),
};

export const FullyExpanded: Story = {
  args: {
    "aria-label": "Expanded project files",
    defaultValue: ["src", "src/components"],
  },
  render: (args) => (
    <TreeView.Root {...args}>
      <ProjectTree />
    </TreeView.Root>
  ),
};

export const DisabledItem: Story = {
  render: (args) => (
    <TreeView.Root {...args}>
      <TreeView.Item value="available" label="Available" />
      <TreeView.Item value="locked" label="Locked" aria-disabled="true" />
    </TreeView.Root>
  ),
};
