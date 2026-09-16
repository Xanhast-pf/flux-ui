import { joinClassNames } from "../../internal/joinClassNames.js";
import { Slider } from "../Slider/Slider.js";
import { fader } from "./Fader.css.js";
import type { FaderProps } from "./Fader.types.js";
/** @deprecated Use Slider with orientation="vertical". Existing imports remain supported. */
export function Fader({ className, ...props }: FaderProps) {
  return (
    <Slider
      {...props}
      orientation="vertical"
      className={joinClassNames(fader, className)}
    />
  );
}
