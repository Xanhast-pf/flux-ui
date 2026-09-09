import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid } from "./Grid.js";

const meta = {
  title: "Layout/Grid",
  component: Grid,
  args: { gap: "md" },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const cellStyle = {
  border: "1px solid var(--flux-color-border)",
  borderRadius: "var(--flux-radius-md)",
  minHeight: "5rem",
  padding: "1rem",
} as const;

export const ResponsiveCount: Story = {
  render: ({ gap }) => (
    <Grid gap={gap} columns={{ base: 1, md: 2, xl: 4 }}>
      {Array.from({ length: 8 }, (_, index) => `item-${index + 1}`).map(
        (id) => (
          <div key={id} style={cellStyle}>
            {id}
          </div>
        ),
      )}
    </Grid>
  ),
};

export const AutoFit: Story = {
  render: ({ gap }) => (
    <Grid gap={gap} minColumnWidth="14rem">
      {Array.from({ length: 6 }, (_, index) => `auto-${index + 1}`).map(
        (id) => (
          <div key={id} style={cellStyle}>
            {id}
          </div>
        ),
      )}
    </Grid>
  ),
};

export const Spans: Story = {
  render: ({ gap }) => (
    <Grid gap={gap} columns={12}>
      <Grid.Item colSpan={8} style={cellStyle}>
        8 columns
      </Grid.Item>
      <Grid.Item colSpan={4} style={cellStyle}>
        4 columns
      </Grid.Item>
      <Grid.Item colSpan="full" style={cellStyle}>
        Full row
      </Grid.Item>
    </Grid>
  ),
};
