import { SparkIcon } from "@flux-ui/icons";
import type { SceneDefinition } from "../types.js";
export default {
  order: 1,
  label: "Marketing",
  brand: "signal",
  headline: "Good ideas deserve a great launch.",
  description:
    "A campaign workspace with enough structure to ship and enough room to play.",
  prompt: "Rewrite the headline. Pick an audience. Launch your local campaign.",
  components: [
    "avatar",
    "badge",
    "box",
    "button",
    "card",
    "field",
    "grid",
    "heading",
    "inline",
    "input",
    "select",
    "stack",
    "stat",
    "text",
  ],
  custom:
    "The campaign canvas and audience summary are custom HTML/CSS compositions. Launching only changes local demo state; no campaign or message is sent.",
  Icon: SparkIcon,
} satisfies SceneDefinition;
