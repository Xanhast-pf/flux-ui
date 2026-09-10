import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toolbar } from "./Toolbar.js";
const meta = {
  title: "Actions/Toolbar",
  component: Toolbar.Root,
  args: { "aria-label": "Document actions" },
} satisfies Meta<typeof Toolbar.Root>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { "aria-label": "Document actions" },
  render: (args) => (
    <Toolbar.Root {...args}>
      <Toolbar.Button>Copy</Toolbar.Button>
      <Toolbar.Button disabled>Cut</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button>Reset</Toolbar.Button>
      <Toolbar.Link href="#help">Help</Toolbar.Link>
    </Toolbar.Root>
  ),
};
export const Vertical: Story = {
  args: { "aria-label": "Document actions", orientation: "vertical" },
  render: (args) => (
    <Toolbar.Root {...args}>
      <Toolbar.Button>Copy</Toolbar.Button>
      <Toolbar.Button disabled>Cut</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button>Reset</Toolbar.Button>
      <Toolbar.Link href="#help">Help</Toolbar.Link>
    </Toolbar.Root>
  ),
};
export const NoWrap: Story = {
  args: { "aria-label": "Document actions", loopFocus: false },
  render: (args) => (
    <Toolbar.Root {...args}>
      <Toolbar.Button>Copy</Toolbar.Button>
      <Toolbar.Button disabled>Cut</Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.Button>Reset</Toolbar.Button>
      <Toolbar.Link href="#help">Help</Toolbar.Link>
    </Toolbar.Root>
  ),
};
