import { HomeIcon, SearchIcon, UserIcon } from "@varua/icons";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BottomNavigation } from "./BottomNavigation.js";

const meta = {
  title: "Navigation/BottomNavigation",
  component: BottomNavigation,
  args: {
    "aria-label": "Primary destinations",
  },
} satisfies Meta<typeof BottomNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Destinations: Story = {
  render: (args) => (
    <BottomNavigation {...args}>
      <BottomNavigation.Item href="#home" current icon={<HomeIcon size={20} />}>
        Home
      </BottomNavigation.Item>
      <BottomNavigation.Item href="#search" icon={<SearchIcon size={20} />}>
        Search
      </BottomNavigation.Item>
      <BottomNavigation.Item href="#profile" icon={<UserIcon size={20} />}>
        Profile
      </BottomNavigation.Item>
    </BottomNavigation>
  ),
};
