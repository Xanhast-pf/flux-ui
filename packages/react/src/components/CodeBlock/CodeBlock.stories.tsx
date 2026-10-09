import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "./CodeBlock.js";
const meta = {
  title: "Typography/CodeBlock",
  component: CodeBlock,
} satisfies Meta<typeof CodeBlock>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    label: "Install Flux UI",
    code: "pnpm add @varua/flux-ui @varua/tokens",
  },
};
