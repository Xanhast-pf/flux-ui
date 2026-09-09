import type { Meta, StoryObj } from "@storybook/react-vite";
import { Container } from "./Container.js";

const meta = {
  title: "Layout/Container",
  component: Container,
  args: { size: "xl" },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Container {...args}>
      <div
        style={{
          border: "1px solid var(--flux-color-border)",
          padding: "1rem",
        }}
      >
        Container content
      </div>
    </Container>
  ),
};
