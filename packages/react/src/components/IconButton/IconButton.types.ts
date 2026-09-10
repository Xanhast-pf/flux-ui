import type { ReactNode } from "react";
import type { AccessibleName } from "../../internal/accessibility.types.js";
import type { ButtonProps } from "../Button/Button.types.js";
export type IconButtonProps = Omit<
  ButtonProps,
  "children" | "startIcon" | "endIcon" | "aria-label" | "aria-labelledby"
> &
  AccessibleName & {
    children: ReactNode;
  };
