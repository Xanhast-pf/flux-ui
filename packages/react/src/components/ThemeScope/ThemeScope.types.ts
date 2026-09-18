import type {
  LayoutElement,
  SemanticProps,
} from "../../internal/semantic.types.js";
import type { SurfaceOptions } from "../../internal/surface.js";

export type ThemeScopeProps = SemanticProps<
  LayoutElement,
  "div",
  SurfaceOptions & {
    /** A data-flux-theme selector. Import optional preset CSS only when using it. */
    theme: string;
    query?: boolean | undefined;
  }
>;
