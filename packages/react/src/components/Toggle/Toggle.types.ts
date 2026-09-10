import type { ComponentPropsWithRef, MouseEvent } from "react";
export type ToggleProps = Omit<
  ComponentPropsWithRef<"button">,
  "aria-pressed"
> & {
  onPressedChange?:
    | ((pressed: boolean, event: MouseEvent<HTMLButtonElement>) => void)
    | undefined;
} & (
    | { pressed: boolean; defaultPressed?: never }
    | { pressed?: undefined; defaultPressed?: boolean | undefined }
  );
