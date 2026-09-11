import { joinClassNames } from "../../internal/joinClassNames.js";
import { fieldset, legend } from "./Fieldset.css.js";
import type { FieldsetLegendProps, FieldsetProps } from "./Fieldset.types.js";
export function Fieldset({ className, ...props }: FieldsetProps) {
  return (
    <fieldset {...props} className={joinClassNames(fieldset, className)} />
  );
}
function Legend({ className, ...props }: FieldsetLegendProps) {
  return <legend {...props} className={joinClassNames(legend, className)} />;
}
Fieldset.Legend = Legend;
