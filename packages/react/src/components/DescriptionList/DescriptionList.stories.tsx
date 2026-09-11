import type { Meta, StoryObj } from "@storybook/react-vite";
import { DescriptionList } from "./DescriptionList.js";
const meta = {
  title: "Typography/DescriptionList",
  component: DescriptionList,
} satisfies Meta<typeof DescriptionList>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    children: (
      <>
        <DescriptionList.Term>Status</DescriptionList.Term>
        <DescriptionList.Details>Draft</DescriptionList.Details>
      </>
    ),
  },
};
