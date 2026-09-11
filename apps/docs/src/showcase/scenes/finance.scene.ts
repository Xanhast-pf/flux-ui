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
  components: ["button", "toggle", "toggle-group", "table"],
  custom:
    "The cash-flow chart and payment-card artwork are docs-only compositions, not public Chart or PaymentCard APIs. All amounts and transactions are fictional.",
  Icon: GaugeIcon,
} satisfies SceneDefinition;
