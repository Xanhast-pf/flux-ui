import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./Text.js";
const meta = { title: "Typography/Text", component: Text } satisfies Meta<
  typeof Text
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: { as: "p", variant: "body", children: "A clear body paragraph." },
};
