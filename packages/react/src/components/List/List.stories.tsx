import type { Meta, StoryObj } from "@storybook/react-vite";
import { List } from "./List.js";
const meta = { title: "Typography/List", component: List } satisfies Meta<
  typeof List
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    as: "ul",
    variant: "marker",
    children: (
      <>
        <List.Item>Native semantics</List.Item>
        <List.Item>Public composition</List.Item>
      </>
    ),
  },
};
