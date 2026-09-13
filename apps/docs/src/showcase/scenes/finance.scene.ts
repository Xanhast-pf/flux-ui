import { GaugeIcon } from "@flux-ui/icons";
import type { SceneDefinition } from "../types.js";
export default {
  order: 0,
  label: "Finance",
  brand: "folio",
  headline: "A clearer view of the bigger picture.",
  description:
    "Balances, cash flow, and the little details that make money feel manageable.",
  prompt: "Change the date range. Freeze the card. Record a demo payout.",
  components: [
    "avatar",
    "box",
    "button",
    "card",
    "chart",
    "grid",
    "heading",
    "inline",
    "scroll-area",
    "stack",
    "stat",
    "table",
    "text",
    "toggle",
    "toggle-group",
  ],
  custom:
    "Cash flow uses the public Chart. The payment-card illustration remains original artwork, not a PaymentCard API. All amounts, samples and transactions are fictional.",
  Icon: GaugeIcon,
} satisfies SceneDefinition;
