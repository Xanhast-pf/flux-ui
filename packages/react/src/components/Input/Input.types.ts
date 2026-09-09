import type { ComponentPropsWithRef } from "react";

export type InputType =
  | "date"
  | "datetime-local"
  | "email"
  | "month"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week";

export interface InputProps extends Omit<
  ComponentPropsWithRef<"input">,
  "type"
> {
  type?: InputType | undefined;
}
