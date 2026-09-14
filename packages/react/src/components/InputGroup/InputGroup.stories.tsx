import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputGroup } from "./InputGroup.js";
const meta = {
  title: "Inputs/InputGroup",
  render: () => (
    <>
      <InputGroup.Root>
        <InputGroup.Addon aria-hidden="true">USD</InputGroup.Addon>
        <InputGroup.Input
          aria-label="Amount in US dollars"
          type="number"
          defaultValue="120"
        />
      </InputGroup.Root>
    </>
  ),
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
