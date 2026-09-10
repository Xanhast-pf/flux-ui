import type { ComponentPropsWithRef } from "react";
/** Text-only content. Do not hide focusable controls inside this primitive. */
export type VisuallyHiddenProps = Omit<
  ComponentPropsWithRef<"span">,
  "tabIndex"
>;
