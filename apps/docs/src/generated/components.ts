// GENERATED FILE. Run `pnpm generate`; do not edit manually.
export const components = [
  {
    name: "Button",
    slug: "button",
    category: "Actions",
    status: "alpha",
    description:
      "Triggers an immediate action with predictable states and native button semantics.",
    sizeClass: "interactive",
  },
  {
    name: "Container",
    slug: "container",
    category: "Layout",
    status: "alpha",
    description:
      "Centered page-width primitive with consistent responsive gutters.",
    sizeClass: "primitive",
  },
  {
    name: "Grid",
    slug: "grid",
    category: "Layout",
    status: "alpha",
    description:
      "Native CSS Grid layout with responsive tracks, auto-fit sizing, placement, and subgrid support.",
    sizeClass: "interactive",
  },
  {
    name: "Inline",
    slug: "inline",
    category: "Layout",
    status: "alpha",
    description:
      "Token-driven horizontal layout for toolbars, actions, and inline groups.",
    sizeClass: "primitive",
  },
  {
    name: "Stack",
    slug: "stack",
    category: "Layout",
    status: "alpha",
    description: "Token-driven vertical layout with responsive spacing.",
    sizeClass: "primitive",
  },
] as const;

export type ComponentMeta = (typeof components)[number];
