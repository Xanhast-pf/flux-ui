import type { Meta, StoryObj } from "@storybook/react-vite";
import { Code } from "./Code.js";
const meta = { title: "Typography/Code", component: Code } satisfies Meta<
  typeof Code
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { children: "pnpm add @flux-ui/react" } };
