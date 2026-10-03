import type { Meta, StoryObj } from "@storybook/react-vite";
import { Combobox } from "./Combobox.js";
const meta = {
  title: "Inputs/Combobox",
  render: () => (
    <>
      <Combobox
        aria-label="Workspace role"
        options={[
          { value: "member", label: "Member", group: "Active roles" },
          { value: "viewer", label: "Viewer", group: "Active roles" },
        ]}
        defaultValue="member"
      />
    </>
  ),
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

export const Loading: Story = {
  render: () => (
    <Combobox
      aria-label="Workspace role"
      options={[
        { value: "member", label: "Member", group: "Active roles" },
        { value: "viewer", label: "Viewer", group: "Active roles" },
      ]}
      loading
      loadingMessage="Refreshing roles."
    />
  ),
};
