import type { Meta, StoryObj } from "@storybook/react-vite";
import { Fieldset } from "./Fieldset.js";
const meta = { title: "Forms/Fieldset", component: Fieldset } satisfies Meta<
  typeof Fieldset
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <Fieldset.Legend>Archived workspace</Fieldset.Legend>
        <input aria-label="Project name" defaultValue="Archived project" />
      </>
    ),
  },
};
