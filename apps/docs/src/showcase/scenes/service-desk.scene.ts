import { UsersIcon } from "@flux-ui/icons";
import type { SceneDefinition } from "../types.js";

export default {
  order: 3,
  label: "Service",
  brand: "Relay",
  headline:
    "A support command center that feels calm even when the queue is not.",
  description:
    "A customer-service workspace with queue navigation, ticket context, SLA progress, structured triage, reply composition, and incident workflow.",
  prompt:
    "Navigate the queue, expand context, change priority, schedule follow-up, send a local reply, or close the demo ticket.",
  components: [
    "accordion",
    "alert-dialog",
    "avatar",
    "button",
    "card",
    "collapsible",
    "date-time-picker",
    "field",
    "grid",
    "heading",
    "indicator",
    "inline",
    "progress",
    "radio-group",
    "stack",
    "status-badge",
    "stepper",
    "tag",
    "text",
    "textarea",
    "time-picker",
    "toast",
    "toolbar",
    "tree-view",
  ],
  custom:
    "Only fictional ticket data and local state. The queue, ticket surface, triage form, overlays, and notifications are all public Flux components with no scene-specific stylesheet.",
  Icon: UsersIcon,
} satisfies SceneDefinition;
