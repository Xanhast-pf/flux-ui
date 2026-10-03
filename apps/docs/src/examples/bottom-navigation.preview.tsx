import { HomeIcon, SearchIcon, UserIcon } from "@flux-ui/icons";
import { BottomNavigation } from "@flux-ui/react";

export default function Example() {
  return (
    <BottomNavigation aria-label="Primary destinations">
      <BottomNavigation.Item
        href="#components/bottom-navigation?destination=home"
        current
        icon={<HomeIcon size={20} />}
      >
        Home
      </BottomNavigation.Item>
      <BottomNavigation.Item
        href="#components/bottom-navigation?destination=search"
        icon={<SearchIcon size={20} />}
      >
        Search
      </BottomNavigation.Item>
      <BottomNavigation.Item
        href="#components/bottom-navigation?destination=profile"
        icon={<UserIcon size={20} />}
      >
        Profile
      </BottomNavigation.Item>
    </BottomNavigation>
  );
}
