import Preview from "./stepper.preview.js";
import code from "./stepper.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";

export default {
  Preview,
  code,
  props: [
    [
      "Root.orientation",
      '"horizontal" | "vertical"',
      "Controls visual flow only. The ordered-list semantics stay the same.",
    ],
    [
      "Item.status",
      '"pending" | "current" | "complete" | "error"',
      'Current adds aria-current="step"; complete/error also use distinct markers and accessible status text.',
    ],
    [
      "Item.statusLabel",
      "string",
      'Localizes the default "Completed" or "Error" assistive status text.',
    ],
    [
      "Link / Button",
      "native anchor / button props",
      "Optional navigation uses platform focus and activation behavior; Stepper does not own routing or wizard state.",
    ],
  ],
  notes: [
    "The application owns workflow state, routing, validation and persistence. Stepper reflects that state instead of duplicating it.",
    "Links and buttons remain in normal Tab order. No arrow-key or roving-focus model is introduced because Stepper is an ordered progress list, not a tablist.",
    "Horizontal steppers preserve sequence with overflow instead of wrapping; use vertical orientation when long labels or narrow layouts need more room.",
    "Completed and error status text defaults to English and should be localized with statusLabel in localized products.",
  ],
} satisfies ComponentExample;
