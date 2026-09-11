import type { BoxProps } from "../Box/Box.types.js";
export type ThemeScopeProps = BoxProps & {
  /** A data-flux-theme selector. Import optional preset CSS only when using it. */
  theme: string;
  query?: boolean | undefined;
};
