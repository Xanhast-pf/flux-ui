import { UsersIcon } from "@flux-ui/icons";
import type { SceneDefinition } from "../types.js";
export default {
  order: 2,
  label: "Social",
  brand: "gather",
  headline: "A little less noise. A little more connection.",
  description:
    "A home for good work, unfinished ideas, and the people making them.",
  prompt: "Like a post. Follow a creator. Add your own note to the demo feed.",
  components: [
    "avatar",
    "box",
    "button",
    "card",
    "field",
    "grid",
    "heading",
    "inline",
    "stack",
    "text",
    "textarea",
    "toggle",
  ],
  custom:
    "The feed and editorial artwork are docs-only layouts, not a public Feed component. All profiles are fictional. Posts stay in memory and are discarded when the scene changes.",
  Icon: UsersIcon,
} satisfies SceneDefinition;
