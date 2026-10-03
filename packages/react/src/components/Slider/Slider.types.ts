import type { ChangeEvent, ComponentPropsWithRef, CSSProperties } from "react";

export type SliderMark =
  | number
  | {
      value: number;
      label?: string | undefined;
    };

export interface SliderProps extends Omit<
  ComponentPropsWithRef<"input">,
  "type" | "children" | "style" | "readOnly"
> {
  orientation?: "horizontal" | "vertical" | undefined;
  /** Native appearance by default; custom exposes the track/thumb CSS variables. */
  appearance?: "native" | "custom" | undefined;
  /** Double-click target. Controlled sliders do not reset without this value. */
  resetValue?: number | undefined;
  /** Native datalist ticks generated for the range input. Cannot combine with list. */
  marks?: readonly SliderMark[] | undefined;
  /** Renders a visual output mirroring the native range value. */
  showValue?: boolean | undefined;
  /** Formats the optional visual output. */
  formatValue?: ((value: number) => string) | undefined;
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
