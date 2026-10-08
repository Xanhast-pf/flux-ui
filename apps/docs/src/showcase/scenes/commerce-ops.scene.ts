import { ShoppingBagIcon } from "@flux-ui/icons";
import type { SceneDefinition } from "../types.js";

export default {
  order: 2,
  label: "Commerce",
  brand: "Mercantile",
  headline:
    "Orders, inventory, and customer quality in one operations cockpit.",
  description:
    "A commerce-operations dashboard with an editable grid, bulk selection, fulfillment detail, restock controls, and customer-quality signals.",
  prompt:
    "Search inventory, edit a quantity, open order details, page the queue, and change local fulfillment settings.",
  components: [
    "alert-dialog",
    "avatar",
    "button",
    "button-group",
    "card",
    "checkbox",
    "color-swatch",
    "data-grid",
    "drawer",
    "field",
    "grid",
    "heading",
    "inline",
    "input",
    "input-group",
    "number-field",
    "pagination",
    "rating",
    "select",
    "stack",
    "status-badge",
    "switch",
    "text",
  ],
  custom:
    "Only fictional order and inventory data plus local state. Every visible application surface and control is a public Flux component; there is no custom scene stylesheet.",
  Icon: ShoppingBagIcon,
} satisfies SceneDefinition;
