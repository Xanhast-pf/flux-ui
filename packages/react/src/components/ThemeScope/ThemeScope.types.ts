import type { cssVars } from "@flux-ui/tokens";
import type {
  LayoutElement,
  SemanticProps,
} from "../../internal/semantic.types.js";
import type { SurfaceOptions } from "../../internal/surface.js";

export type ThemeScopeColorVariable =
  (typeof cssVars.color)[keyof typeof cssVars.color];
export type ThemeScopeColorOverrides = Partial<
  Record<ThemeScopeColorVariable, string>
>;

export type ThemeScopeProps = SemanticProps<
  LayoutElement,
  "div",
  SurfaceOptions & {
    /** A data-flux-theme selector. Import optional preset CSS only when using it. */
    theme: string;
    query?: boolean | undefined;
    /** Scoped public --flux-color-* variable overrides. Consumer style remains the final escape hatch. */
    colorOverrides?: ThemeScopeColorOverrides | undefined;
  }
>;
