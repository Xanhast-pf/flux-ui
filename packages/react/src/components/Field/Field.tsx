import {
  Children,
  cloneElement,
  createContext,
  useCallback,
  isValidElement,
  useContext,
  useId,
  useLayoutEffect,
  useState,
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
  id: string;
  disabled: boolean;
  description: boolean;
  error: boolean;
  invalid: boolean;
  required: boolean;
  register: (part: "description" | "error") => () => void;
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
    if (child.type === FieldRoot) return false;

    const childProps = child.props as { children?: ReactNode | undefined };
    return childProps.children !== undefined
      ? containsPart(childProps.children, part)
      : false;
  });
}

function joinIdReferences(
  ...values: Array<string | undefined>
): string | undefined {
  return (
    [...new Set(values.join(" ").split(/\s+/).filter(Boolean))].join(" ") ||
    undefined
  );
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
      context.description ? `${context.id}-description` : undefined,
      context.invalid && context.error ? `${context.id}-error` : undefined,
    ),
    "aria-invalid": context.invalid ? "true" : childProps["aria-invalid"],
    "data-invalid": context.invalid ? "true" : childProps["data-invalid"],
    disabled: context.disabled || childProps.disabled || undefined,
    id: context.controlId,
    required: context.required || childProps.required || undefined,
  });
}

/** Both parts share registration and React 19 ref cleanup. */
function fieldPart(part: "description" | "error", style: string) {
  return function Part({
    className,
    ...props
  }: FieldDescriptionProps | FieldErrorProps) {
    const context = useFieldContext(part);
    const { register } = context;
    const visible = part !== "error" || context.invalid;
    useLayoutEffect(() => {
      return visible ? register(part) : undefined;
    }, [register, visible]);
    if (!visible) return null;
    return (
      <p
        {...props}
        className={joinClassNames(style, className)}
        id={`${context.id}-${part}`}
      />
    );
  };
}
const FieldDescription = fieldPart("description", description);
const FieldError = fieldPart("error", error);

function hasContent(value: ReactNode): boolean {
  return value !== undefined && value !== null && value !== false;
}

function FieldRoot({
  density = "comfortable",
  children,
  className,
  controlId,
  description: descriptionContent,
  error: errorContent,
  disabled = false,
  id,
  invalid = false,
  required = false,
  ...rootProps
}: FieldRootProps) {
  const generatedId = useId();
  const [parts, setParts] = useState({ description: 0, error: 0 });
  const register = useCallback((part: "description" | "error") => {
    setParts((current) => ({ ...current, [part]: current[part] + 1 }));
    return () =>
      setParts((current) => ({ ...current, [part]: current[part] - 1 }));
  }, []);
  const descriptionSlot = hasContent(descriptionContent);
  const errorSlot = hasContent(errorContent);
  const baseId = id ?? controlId ?? generatedId;
  const context: FieldContextValue = {
    controlId: controlId ?? `${baseId}-control`,
    id: baseId,
    disabled,
    description:
      descriptionSlot ||
      parts.description > 0 ||
      containsPart(children, FieldDescription),
    error: errorSlot || parts.error > 0 || containsPart(children, FieldError),
    invalid,
    required,
    register,
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
        {descriptionSlot ? (
          <FieldDescription>{descriptionContent}</FieldDescription>
        ) : null}
        {errorSlot ? <FieldError>{errorContent}</FieldError> : null}
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
