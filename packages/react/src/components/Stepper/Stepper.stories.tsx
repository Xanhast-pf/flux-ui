import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "./Stepper.js";

const meta = {
  title: "Navigation/Stepper",
  component: Stepper.Root,
} satisfies Meta<typeof Stepper.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checkout: Story = {
  render: () => (
    <Stepper.Root aria-label="Checkout progress">
      <Stepper.Item status="complete">
        <Stepper.Link href="#account">Account</Stepper.Link>
      </Stepper.Item>
      <Stepper.Item status="current">Shipping</Stepper.Item>
      <Stepper.Item>Payment</Stepper.Item>
      <Stepper.Item>Review</Stepper.Item>
    </Stepper.Root>
  ),
};

export const VerticalWithError: Story = {
  render: () => (
    <Stepper.Root orientation="vertical" aria-label="Deployment progress">
      <Stepper.Item status="complete">Build</Stepper.Item>
      <Stepper.Item status="error">Deploy</Stepper.Item>
      <Stepper.Item>Verify</Stepper.Item>
    </Stepper.Root>
  ),
};
