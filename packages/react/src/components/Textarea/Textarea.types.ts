import type { ComponentPropsWithRef } from "react";

type NativeTextareaProps = ComponentPropsWithRef<"textarea">;

export type TextareaProps =
  | (NativeTextareaProps & {
      autoSize?: false | undefined;
      minRows?: never;
      maxRows?: never;
    })
  | (Omit<NativeTextareaProps, "rows"> & {
      /** Grow with content using the platform field-sizing implementation. */
      autoSize: true;
      /** Minimum visible content rows. Defaults to 1 in autosize mode. */
      minRows?: number | undefined;
      /** Optional maximum visible content rows before vertical overflow. */
      maxRows?: number | undefined;
      rows?: never;
    });
