import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./Separator.js";
const meta = { title: "Layout/Separator", component: Separator } satisfies Meta<
  typeof Separator
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: {}, render: () => <Separator /> };
