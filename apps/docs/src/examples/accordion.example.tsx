import Preview from "./accordion.preview.js";
import code from "./accordion.preview.tsx?raw";
import type { ComponentExample } from "../lib/examples.js";
export default {
  Preview,
  previewLayout: "fill",
  code,
  props: [
    [
      "Root.type",
      "single | multiple",
      "Single assigns a shared native details name. Defaults to single.",
    ],
    [
      "Root.name",
      "string",
      "Optional deterministic group name. Otherwise useId keeps groups isolated.",
    ],
    [
      "Item / Trigger / Content",
      "details / summary / div",
      "Keep Trigger first and directly inside Item. Item accepts open and onToggle.",
    ],
  ],
  notes: [
    "Native disclosures, not a simulated ARIA accordion. No extra arrow-key navigation is added.",
    "Browsers supporting named details enforce exclusivity; older browsers still expose independent disclosures.",
    "open and onToggle are native details APIs, not a Flux controlled-state engine. For initial single mode, open at most one item.",
    "Do not put another button or link inside the summary.",
  ],
} satisfies ComponentExample;
