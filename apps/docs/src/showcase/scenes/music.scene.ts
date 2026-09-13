import { SlidersIcon } from "@flux-ui/icons";
import type { SceneDefinition } from "../types.js";
export default {
  order: 3,
  label: "Music / DAW",
  brand: "afterhours",
  headline: "Find your flow. Then turn it up.",
  description:
    "A compact music workspace for the moment an idea becomes a track.",
  prompt: "Start the visual loop. Mute a track. Change the tempo.",
  components: [
    "box",
    "button",
    "card",
    "field",
    "grid",
    "heading",
    "inline",
    "fader",
    "knob",
    "level-meter",
    "number-field",
    "slider",
    "stack",
    "text",
    "toggle",
  ],
  custom:
    "Knob, Fader, NumberField and LevelMeter are public controls. The sequencer, clip waveforms and playhead remain original visual artwork. This is not an audio engine: playback is silent, and no microphone or audio file is accessed.",
  Icon: SlidersIcon,
} satisfies SceneDefinition;
