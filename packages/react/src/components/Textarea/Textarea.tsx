import type { CSSProperties } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { textarea } from "./Textarea.css.js";
import type { TextareaProps } from "./Textarea.types.js";

type AutoSizeStyle = CSSProperties & {
  "--flux-textarea-min-row-size"?: string | undefined;
  "--flux-textarea-max-row-size"?: string | undefined;
};

function validRowCount(name: string, value: number | undefined): void {
  if (value !== undefined && (!Number.isSafeInteger(value) || value < 1)) {
    throw new RangeError(`Textarea.${name} must be a positive integer.`);
  }
}

export function Textarea({
  autoSize = false,
  className,
  maxRows,
  minRows,
  rows,
  style,
  ...textareaProps
}: TextareaProps) {
  if (!autoSize && (minRows !== undefined || maxRows !== undefined)) {
    throw new TypeError("Textarea minRows/maxRows require autoSize={true}.");
  }
  if (autoSize && rows !== undefined) {
    throw new TypeError("Textarea rows cannot be used with autoSize={true}.");
  }
  if (autoSize) {
    validRowCount("minRows", minRows);
    validRowCount("maxRows", maxRows);
    if (minRows !== undefined && maxRows !== undefined && maxRows < minRows) {
      throw new RangeError(
        "Textarea maxRows must be greater than or equal to minRows.",
      );
    }
  }

  const resolvedStyle: AutoSizeStyle | undefined = autoSize
    ? {
        "--flux-textarea-min-row-size": `${minRows ?? 1}lh`,
        ...(maxRows === undefined
          ? {}
          : { "--flux-textarea-max-row-size": `${maxRows}lh` }),
        ...style,
      }
    : style;

  return (
    <textarea
      {...textareaProps}
      className={joinClassNames(textarea, className)}
      data-auto-size={autoSize ? "true" : undefined}
      data-has-max-rows={autoSize && maxRows !== undefined ? "true" : undefined}
      data-invalid={textareaProps["aria-invalid"]}
      rows={autoSize ? undefined : rows}
      style={resolvedStyle}
    />
  );
}
