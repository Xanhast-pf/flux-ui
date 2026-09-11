import { joinClassNames } from "../../internal/joinClassNames.js";
import type { CSSVariableStyle } from "../../internal/layout.js";
import { check, colorSwatch } from "./ColorSwatch.css.js";
import type { ColorSwatchProps } from "./ColorSwatch.types.js";
/** Decorative sample; the enclosing control/text owns its accessible name and selection state. */
export function ColorSwatch({
  color,
  selected = false,
  size = "md",
  className,
  style,
  ...props
}: ColorSwatchProps) {
  const variables: CSSVariableStyle = {
    "--flux-swatch-color": color,
    ...style,
  };
  return (
    <span
      {...props}
      aria-hidden="true"
      data-size={size}
      data-selected={selected || undefined}
      className={joinClassNames(colorSwatch, className)}
      style={variables}
    >
      {selected ? <span className={check}>✓</span> : null}
    </span>
  );
}
