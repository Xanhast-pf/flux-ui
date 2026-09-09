import { joinClassNames } from "../../internal/joinClassNames.js";
import { input } from "./Input.css.js";
import type { InputProps } from "./Input.types.js";

export function Input({ className, type = "text", ...inputProps }: InputProps) {
  return (
    <input
      {...inputProps}
      className={joinClassNames(input, className)}
      type={type}
    />
  );
}
