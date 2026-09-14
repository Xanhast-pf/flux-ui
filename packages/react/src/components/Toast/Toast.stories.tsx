import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toast } from "./Toast.js";
const meta = {
  title: "Feedback/Toast",
  render: () => (
    <>
      <Toast.Provider>
        <Toast.Viewport placement="inline" />
      </Toast.Provider>
    </>
  ),
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
