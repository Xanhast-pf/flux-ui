import type { ComponentType } from "react";
import type { IconProps } from "@flux-ui/icons";
import type { ComponentMeta } from "../generated/components.js";
export interface SceneDefinition {
  order: number;
  label: string;
  brand: string;
  headline: string;
  description: string;
  prompt: string;
  Icon: ComponentType<IconProps>;
  components: readonly ComponentMeta["slug"][];
  custom: string;
}
