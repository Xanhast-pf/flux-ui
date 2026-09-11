import { PackageIcon } from "@flux-ui/icons";
import type { SceneDefinition } from "../types.js";
export default {
  order: 5,
  label: "Commerce",
  brand: "objects",
  headline: "Made for the things people love.",
  description:
    "A small storefront with a point of view, from the first look to the bag.",
  prompt: "Pick a finish. Change the quantity. Build a local shopping bag.",
  components: [
    "box",
    "button",
    "card",
    "color-swatch",
    "field",
    "grid",
    "heading",
    "inline",
    "select",
    "stack",
    "text",
    "toggle-group",
  ],
  custom:
    "The product illustration, storefront, and bag are docs-only compositions. This is a fictional product with sample pricing. There is no payment, checkout, or stock service.",
  Icon: PackageIcon,
} satisfies SceneDefinition;
