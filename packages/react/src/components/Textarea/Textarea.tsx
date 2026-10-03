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
  if (!autoSize) {
    if (minRows !== undefined || maxRows !== undefined) {
      throw new TypeError("Textarea minRows/maxRows require autoSize={true}.");
    }
    return (
      <textarea
        {...textareaProps}
        className={joinClassNames(textarea, className)}
        rows={rows}
        style={style}
      />
    );
  }

  if (rows !== undefined) {
    throw new TypeError("Textarea rows cannot be used with autoSize={true}.");
  }

  validRowCount("minRows", minRows);
  validRowCount("maxRows", maxRows);
  if (minRows !== undefined && maxRows !== undefined && maxRows < minRows) {
    throw new RangeError(
      "Textarea maxRows must be greater than or equal to minRows.",
    );
  }

  const autoSizeStyle: AutoSizeStyle = {
    "--flux-textarea-min-row-size": `${minRows ?? 1}lh`,
    ...(maxRows === undefined
      ? {}
      : { "--flux-textarea-max-row-size": `${maxRows}lh` }),
    ...style,
  };

  return (
    <textarea
      {...textareaProps}
      className={joinClassNames(textarea, className)}
      data-auto-size="true"
      data-has-max-rows={maxRows === undefined ? undefined : "true"}
      style={autoSizeStyle}
    />
  );
}
