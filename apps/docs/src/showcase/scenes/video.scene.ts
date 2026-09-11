import { LayersIcon } from "@flux-ui/icons";
import type { SceneDefinition } from "../types.js";
export default {
  order: 4,
  label: "Video",
  brand: "cutroom",
  headline: "Every great story starts with a cut.",
  description:
    "A focused editing surface that gives the picture room to breathe.",
  prompt: "Select a clip. Scrub the storyboard. Export the edit notes.",
  components: [
    "aspect-ratio",
    "box",
    "button",
    "card",
    "field",
    "grid",
    "heading",
    "inline",
    "select",
    "slider",
    "stack",
    "switch",
    "text",
    "toggle-group",
  ],
  custom:
    "The preview frames and timeline are illustrated, docs-only prototypes. There is no video decoder or rendering engine. Export downloads JSON edit notes, never a rendered video.",
  Icon: LayersIcon,
} satisfies SceneDefinition;
