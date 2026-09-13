import { joinClassNames } from "../../internal/joinClassNames.js";
import { Slider } from "../Slider/Slider.js";
import { fader } from "./Fader.css.js";
import type { FaderProps } from "./Fader.types.js";
/** A native vertical range: minimum at the bottom, no wheel hijacking or audio engine. */
export function Fader({ className, ...props }: FaderProps) {
  return (
    <Slider
      {...props}
      aria-orientation="vertical"
      className={joinClassNames(fader, className)}
    />
  );
}
