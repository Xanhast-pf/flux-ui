import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  button,
  content,
  indicator,
  item,
  link,
  root,
  visuallyHidden,
} from "./Stepper.css.js";
import type {
  StepperButtonProps,
  StepperItemProps,
  StepperLinkProps,
  StepperRootProps,
} from "./Stepper.types.js";

function StepperRoot({
  orientation = "horizontal",
  className,
  "aria-label": label = "Progress",
  ...props
}: StepperRootProps) {
  return (
    <ol
      {...props}
      aria-label={label}
      className={joinClassNames(root, className)}
      data-orientation={orientation}
    />
  );
}

function StepperItem({
  status = "pending",
  statusLabel,
  className,
  children,
  ...props
}: StepperItemProps) {
  const accessibleStatus =
    statusLabel ??
    (status === "complete"
      ? "Completed"
      : status === "error"
        ? "Error"
        : undefined);

  return (
    <li
      {...props}
      aria-current={status === "current" ? "step" : undefined}
      className={joinClassNames(item, className)}
      data-status={status}
    >
      <span aria-hidden="true" className={indicator} />
      <div className={content}>
        {accessibleStatus ? (
          <span className={visuallyHidden}>{accessibleStatus}: </span>
        ) : null}
        {children}
      </div>
    </li>
  );
}

function StepperLink({ className, children, ...props }: StepperLinkProps) {
  return (
    <a {...props} className={joinClassNames(link, className)}>
      {children}
    </a>
  );
}

function StepperButton({
  className,
  children,
  type = "button",
  ...props
}: StepperButtonProps) {
  return (
    <button
      {...props}
      className={joinClassNames(button, className)}
      type={type}
    >
      {children}
    </button>
  );
}

export const Stepper = {
  Root: StepperRoot,
  Item: StepperItem,
  Link: StepperLink,
  Button: StepperButton,
} as const;
