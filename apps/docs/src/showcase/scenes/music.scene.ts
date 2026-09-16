import { SlidersIcon } from "@flux-ui/icons";
import type { SceneDefinition } from "../types.js";
export default {
  order: 3,
  label: "Music / DAW",
  brand: "afterhours",
  headline: "Find your flow. Then turn it up.",
  description:
    "A focused creative workspace with independent track settings, session notes and local checkpoints.",
  prompt:
    "Inspect a track. Adjust its gain or pan. Save a checkpoint, then compare, restore or export UI settings.",
  components: [
    "alert-dialog",
    "badge",
    "box",
    "button",
    "card",
    "dropdown-menu",
    "field",
    "grid",
    "heading",
    "inline",
    "knob",
    "level-meter",
    "number-field",
    "slider",
    "stack",
    "tabs",
    "text",
    "textarea",
    "toast",
    "toggle",
    "tooltip",
  ],
  custom:
    "Knob, vertical Slider, NumberField and LevelMeter are public controls. The sequencer, clip waveforms and playhead remain original visual artwork. This is not an audio engine: playback is silent, and no microphone or audio file is accessed.",
  Icon: SlidersIcon,
} satisfies SceneDefinition;
