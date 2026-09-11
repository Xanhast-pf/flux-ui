import type { ComponentPropsWithRef, ReactElement } from "react";

export interface FieldRootProps extends ComponentPropsWithRef<"div"> {
  density?: "comfortable" | "compact" | undefined;
  /** Stable id for the form control associated with this field. */
  controlId?: string | undefined;
  disabled?: boolean | undefined;
  invalid?: boolean | undefined;
  required?: boolean | undefined;
}

export type FieldLabelProps = Omit<ComponentPropsWithRef<"label">, "htmlFor">;

export interface FieldControlProps {
  children: ReactElement;
}

export type FieldDescriptionProps = Omit<ComponentPropsWithRef<"p">, "id">;
export type FieldErrorProps = Omit<ComponentPropsWithRef<"p">, "id">;
