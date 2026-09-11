import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useId,
  type AriaAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  description,
  error,
  label,
  requiredIndicator,
  root,
} from "./Field.css.js";
import type {
  FieldControlProps,
  FieldDescriptionProps,
  FieldErrorProps,
  FieldLabelProps,
  FieldRootProps,
} from "./Field.types.js";

type FieldContextValue = {
  controlId: string;
  descriptionId: string;
  disabled: boolean;
  errorId: string;
  hasDescription: boolean;
  hasError: boolean;
  invalid: boolean;
  required: boolean;
};

type FieldControlChildProps = {
  "aria-describedby"?: string | undefined;
  "aria-invalid"?: AriaAttributes["aria-invalid"];
  "data-invalid"?: string | undefined;
  disabled?: boolean | undefined;
  id?: string | undefined;
  required?: boolean | undefined;
};

const FieldContext = createContext<FieldContextValue | null>(null);

function useFieldContext(part: string): FieldContextValue {
  const context = useContext(FieldContext);
  if (context === null) {
    throw new Error(`Field.${part} must be rendered inside Field.Root.`);
  }
  return context;
}

function containsPart(children: ReactNode, part: unknown): boolean {
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) return false;
    if (child.type === part) return true;

    const childProps = child.props as { children?: ReactNode | undefined };
    return childProps.children !== undefined
      ? containsPart(childProps.children, part)
      : false;
  });
}

function joinIdReferences(
  ...values: Array<string | undefined>
): string | undefined {
  const ids = new Set<string>();
  for (const value of values) {
    for (const id of value?.split(/\s+/) ?? []) {
      if (id) ids.add(id);
    }
  }
  return ids.size > 0 ? [...ids].join(" ") : undefined;
}

function FieldLabel({ children, className, ...labelProps }: FieldLabelProps) {
  const context = useFieldContext("Label");

  return (
    <label
      {...labelProps}
      className={joinClassNames(label, className)}
      htmlFor={context.controlId}
    >
      {children}
      {context.required ? (
        <span aria-hidden="true" className={requiredIndicator}>
          {" *"}
        </span>
      ) : null}
    </label>
  );
}

function FieldControl({ children }: FieldControlProps) {
  const context = useFieldContext("Control");
  const child = children as ReactElement<FieldControlChildProps>;
  const childProps = child.props;

  return cloneElement(child, {
    "aria-describedby": joinIdReferences(
      childProps["aria-describedby"],
      context.hasDescription ? context.descriptionId : undefined,
      context.invalid && context.hasError ? context.errorId : undefined,
    ),
    "aria-invalid": context.invalid ? "true" : childProps["aria-invalid"],
    "data-invalid": context.invalid ? "true" : childProps["data-invalid"],
    disabled: context.disabled || childProps.disabled || undefined,
    id: context.controlId,
    required: context.required || childProps.required || undefined,
  });
}

function FieldDescription({
  className,
  ...descriptionProps
}: FieldDescriptionProps) {
  const context = useFieldContext("Description");

  return (
    <p
      {...descriptionProps}
      className={joinClassNames(description, className)}
      id={context.descriptionId}
    />
  );
}

function FieldError({ className, ...errorProps }: FieldErrorProps) {
  const context = useFieldContext("Error");
  if (!context.invalid) return null;

  return (
    <p
      {...errorProps}
      className={joinClassNames(error, className)}
      id={context.errorId}
    />
  );
}

function FieldRoot({
  density = "comfortable",
  children,
  className,
  controlId,
  disabled = false,
  id,
  invalid = false,
  required = false,
  ...rootProps
}: FieldRootProps) {
  const generatedId = useId();
  const baseId = id ?? controlId ?? generatedId;
  const context: FieldContextValue = {
    controlId: controlId ?? `${baseId}-control`,
    descriptionId: `${baseId}-description`,
    disabled,
    errorId: `${baseId}-error`,
    hasDescription: containsPart(children, FieldDescription),
    hasError: containsPart(children, FieldError),
    invalid,
    required,
  };

  return (
    <FieldContext value={context}>
      <div
        {...rootProps}
        className={joinClassNames(root, className)}
        data-d={density === "comfortable" ? undefined : density}
        data-x={disabled || undefined}
        id={id}
      >
        {children}
      </div>
    </FieldContext>
  );
}

export const Field = {
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
  Label: FieldLabel,
  Root: FieldRoot,
} as const;
