import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";

export interface FieldRootProps extends ComponentPropsWithRef<"div"> {
  /** Root-owned description, associated in server HTML even when its content is a component. */
  description?: ReactNode;
  /** Root-owned validation message. Rendered and associated only while invalid. */
  error?: ReactNode;
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
