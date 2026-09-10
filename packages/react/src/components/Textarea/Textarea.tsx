import { joinClassNames } from "../../internal/joinClassNames.js";
import { textarea } from "./Textarea.css.js";
import type { TextareaProps } from "./Textarea.types.js";

export function Textarea({ className, ...textareaProps }: TextareaProps) {
  return (
    <textarea
      {...textareaProps}
      className={joinClassNames(textarea, className)}
    />
  );
}
