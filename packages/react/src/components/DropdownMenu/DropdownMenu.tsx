import { useRef } from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { isRovingItemAvailable } from "../../internal/rovingFocusPolicy.js";
import { Popover, usePopover } from "../Popover/Popover.js";
import { item, label, menu, separator } from "./DropdownMenu.css.js";
import type {
  DropdownMenuItemProps,
  DropdownMenuLabelProps,
  DropdownMenuPopupProps,
  DropdownMenuSeparatorProps,
  DropdownMenuTriggerProps,
} from "./DropdownMenu.types.js";
function Trigger({ onKeyDown, ...props }: DropdownMenuTriggerProps) {
  const context = usePopover("DropdownMenu.Trigger");
  return (
    <Popover.Trigger
      {...props}
      aria-haspopup="menu"
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (
          event.defaultPrevented ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey
        )
          return;
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          context.request(
            true,
            event.currentTarget,
            event.key === "ArrowUp" ? "last" : "first",
          );
        }
      }}
    />
  );
}
function Popup({
  className,
  onKeyDown,
  onBlurCapture,
  ...props
}: DropdownMenuPopupProps) {
  const search = useRef({ text: "", at: 0 });
  const context = usePopover("DropdownMenu.Popup");
  return (
    <Popover.Popup
      {...props}
      className={joinClassNames(menu, className)}
      role="menu"
      onBlurCapture={(event) => {
        onBlurCapture?.(event);
        if (
          event.relatedTarget instanceof Node &&
          !event.currentTarget.contains(event.relatedTarget)
        )
          context.request(false);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (
          event.defaultPrevented ||
          event.altKey ||
          event.ctrlKey ||
          event.metaKey ||
          event.nativeEvent.isComposing
        )
          return;
        const scope = event.currentTarget;
        if (
          !(event.target instanceof Element) ||
          event.target.closest('[role="menu"]') !== scope
        )
          return;
        const items = Array.from(
          scope.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'),
        ).filter(
          (node) =>
            node.closest('[role="menu"]') === scope &&
            isRovingItemAvailable(node, scope),
        );
        if (items.length === 0) return;
        const index = items.findIndex((node) => node === event.target);
        let next: HTMLButtonElement | undefined;
        if (event.key === "ArrowDown") next = items[(index + 1) % items.length];
        else if (event.key === "ArrowUp")
          next = items[index <= 0 ? items.length - 1 : index - 1];
        else if (event.key === "Home") next = items[0];
        else if (event.key === "End") next = items.at(-1);
        else if (event.key.length === 1 && event.key !== " ") {
          const now = Date.now();
          const prefix =
            now - search.current.at > 700 ? "" : search.current.text;
          const text = prefix + event.key.toLocaleLowerCase();
          search.current = { text, at: now };
          const query = [...text].every((character) => character === text[0])
            ? (text[0] ?? "")
            : text;
          const ordered = [
            ...items.slice(index + 1),
            ...items.slice(0, index + 1),
          ];
          next = ordered.find((node) =>
            node.textContent.trim().toLocaleLowerCase().startsWith(query),
          );
        }
        if (next !== undefined) {
          event.preventDefault();
          next.focus();
        }
      }}
    />
  );
}
function Item({
  onClick,
  onSelect,
  disabled,
  "aria-disabled": ariaDisabled,
  className,
  tone = "neutral",
  ...props
}: DropdownMenuItemProps) {
  const context = usePopover("DropdownMenu.Item");
  const unavailable =
    disabled || ariaDisabled === true || ariaDisabled === "true";
  return (
    <button
      {...props}
      type="button"
      role="menuitem"
      tabIndex={-1}
      disabled={unavailable}
      aria-disabled={ariaDisabled}
      className={joinClassNames(item, className)}
      data-tone={tone}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !unavailable) {
          onSelect?.();
          context.request(false);
        }
      }}
    />
  );
}
function Label({ className, ...props }: DropdownMenuLabelProps) {
  return <div {...props} className={joinClassNames(label, className)} />;
}
function Separator({ className, ...props }: DropdownMenuSeparatorProps) {
  return <hr {...props} className={joinClassNames(separator, className)} />;
}
export const DropdownMenu = {
  Root: Popover.Root,
  Trigger,
  Popup,
  Item,
  Label,
  Separator,
} as const;
