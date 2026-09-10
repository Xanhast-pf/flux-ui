import type { MouseEvent } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import {
  RovingFocus,
  useRovingContext,
  useRovingItem,
} from "../../internal/RovingFocus.js";
import { root, link, divider, action } from "./Toolbar.css.js";
import type {
  ToolbarRootProps,
  ToolbarButtonProps,
  ToolbarLinkProps,
  ToolbarSeparatorProps,
} from "./Toolbar.types.js";

function ToolbarRoot({
  children,
  className,
  orientation = "horizontal",
  loopFocus = true,
  ...props
}: ToolbarRootProps) {
  return (
    <RovingFocus orientation={orientation} loopFocus={loopFocus}>
      <div
        {...props}
        data-flux-roving-root=""
        role="toolbar"
        aria-orientation={orientation}
        data-orientation={orientation}
        className={joinClassNames(root, className)}
      >
        {children}
      </div>
    </RovingFocus>
  );
}

function ToolbarButton({
  className,
  disabled,
  loading = false,
  onFocus,
  onKeyDown,
  ref,
  type = "button",
  ...props
}: ToolbarButtonProps) {
  const isDisabled =
    disabled ||
    loading ||
    props["aria-disabled"] === true ||
    props["aria-disabled"] === "true";
  const roving = useRovingItem({
    ref,
    onFocus,
    onKeyDown,
    disabled: isDisabled,
    hidden: props.hidden,
  });

  return (
    <button
      {...props}
      {...roving}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={joinClassNames(action, className)}
    />
  );
}

function ToolbarLink({
  children,
  className,
  href,
  onClick,
  onFocus,
  onKeyDown,
  ref,
  ...props
}: ToolbarLinkProps) {
  const disabled =
    props["aria-disabled"] === true || props["aria-disabled"] === "true";
  const roving = useRovingItem({
    ref,
    onFocus,
    onKeyDown,
    disabled,
    hidden: props.hidden,
  });

  function handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <a
      {...props}
      {...roving}
      href={href}
      onClick={handleClick}
      className={joinClassNames(link, className)}
    >
      {children}
    </a>
  );
}

function ToolbarSeparator({ className, ...props }: ToolbarSeparatorProps) {
  const { orientation } = useRovingContext();
  return (
    <hr
      {...props}
      role="none"
      data-orientation={
        orientation === "horizontal" ? "vertical" : "horizontal"
      }
      className={joinClassNames(divider, className)}
    />
  );
}

export const Toolbar = {
  Root: ToolbarRoot,
  Button: ToolbarButton,
  Link: ToolbarLink,
  Separator: ToolbarSeparator,
} as const;
