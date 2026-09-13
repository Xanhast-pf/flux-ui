import type {
  LayoutElement,
  SemanticProps,
} from "../../internal/semantic.types.js";
import type { LayoutGap } from "../../internal/spacing.js";
import type { SurfaceOptions } from "../../internal/surface.js";

type BoxSpacingOptions = {
  paddingBlockStart?: LayoutGap | undefined;
  paddingBlockEnd?: LayoutGap | undefined;
  paddingInlineStart?: LayoutGap | undefined;
  paddingInlineEnd?: LayoutGap | undefined;
};

export type BoxProps = SemanticProps<
  LayoutElement,
  "div",
  SurfaceOptions & BoxSpacingOptions
>;
