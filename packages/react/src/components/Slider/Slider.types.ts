import type { ChangeEvent, ComponentPropsWithRef, CSSProperties } from "react";
export interface SliderProps extends Omit<
  ComponentPropsWithRef<"input">,
  "type" | "children" | "style"
> {
  orientation?: "horizontal" | "vertical" | undefined;
  /** Native appearance by default; custom exposes the track/thumb CSS variables. */
  appearance?: "native" | "custom" | undefined;
  /** Double-click target. Controlled sliders do not reset without this value. */
  resetValue?: number | undefined;
  onValueChange?:
    ((value: number, event: ChangeEvent<HTMLInputElement>) => void) | undefined;
  style?:
    | (CSSProperties & {
        "--flux-slider-length"?: string | undefined;
        "--flux-slider-track-size"?: string | undefined;
        "--flux-slider-thumb-size"?: string | undefined;
        "--flux-slider-thumb-inline-size"?: string | undefined;
        "--flux-slider-thumb-block-size"?: string | undefined;
        "--flux-slider-thumb-radius"?: string | undefined;
      })
    | undefined;
}
