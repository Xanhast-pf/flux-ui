import {
  Children,
  Fragment,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
  type SyntheticEvent,
} from "react";
import { joinClassNames } from "./joinClassNames.js";

export type NativeModalSide = "top" | "right" | "bottom" | "left";

type NativeModalRootBaseProps = {
  children?: ReactNode;
  onOpenChange?: (open: boolean) => void;
};

export type NativeModalRootProps = NativeModalRootBaseProps &
  (
    | { defaultOpen?: boolean; open?: never }
    | { defaultOpen?: never; open: boolean }
  );

export type NativeModalTriggerProps = ComponentPropsWithRef<"button">;
export type NativeModalCloseProps = ComponentPropsWithRef<"button">;
export type NativeModalTitleProps = Omit<ComponentPropsWithRef<"h2">, "id">;
export type NativeModalDescriptionProps = Omit<
  ComponentPropsWithRef<"p">,
  "id"
>;
export interface NativeModalPopupProps extends Omit<
  ComponentPropsWithRef<"dialog">,
  "open"
> {
  closeOnBackdrop?: boolean;
}

export type NativeModalStyles = {
  close?: string;
  description?: string;
  popup: string;
  title?: string;
  trigger?: string;
};

type NativeModalContextValue = {
  descriptionId: string;
  setDialogNode: (node: HTMLDialogElement | null) => void;
  hasDescription: boolean;
  hasTitle: boolean;
  open: boolean;
  requestClose: () => void;
  requestOpen: (returnFocusTarget?: HTMLElement) => void;
  styles: NativeModalStyles;
  titleId: string;
};

type NativeModalInternalRootProps = NativeModalRootProps & {
  hasDescription: boolean;
  hasTitle: boolean;
  styles: NativeModalStyles;
};

const NativeModalContext = createContext<NativeModalContextValue | null>(null);

function useNativeModalContext(part: string): NativeModalContextValue {
  const context = useContext(NativeModalContext);
  if (context === null) {
    throw new Error(`${part} must be rendered inside its Root.`);
  }
  return context;
}

export function containsNativeModalPart(
  children: ReactNode,
  part: unknown,
  popupPart: unknown,
): boolean {
  return Children.toArray(children).some((child) => {
    if (!isValidElement(child)) return false;
    if (child.type === part) return true;

    const mayContainOwnPart =
      child.type === popupPart ||
      child.type === Fragment ||
      typeof child.type === "string";
    if (!mayContainOwnPart) return false;

    const childProps = child.props as { children?: ReactNode | undefined };
    return childProps.children !== undefined
      ? containsNativeModalPart(childProps.children, part, popupPart)
      : false;
  });
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as { current: T | null }).current = value;
  }
}

function NativeModalTitle({
  children,
  className,
  ...props
}: NativeModalTitleProps) {
  const context = useNativeModalContext("Title");
  return (
    <h2
      {...props}
      className={joinClassNames(context.styles.title, className)}
      id={context.titleId}
    >
      {children}
    </h2>
  );
}

function NativeModalDescription({
  children,
  className,
  ...props
}: NativeModalDescriptionProps) {
  const context = useNativeModalContext("Description");
  return (
    <p
      {...props}
      className={joinClassNames(context.styles.description, className)}
      id={context.descriptionId}
    >
      {children}
    </p>
  );
}

function NativeModalRoot({
  children,
  defaultOpen = false,
  hasDescription,
  hasTitle,
  open: controlledOpen,
  onOpenChange,
  styles,
}: NativeModalInternalRootProps) {
  const generatedId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [dialogNode, setDialogNode] = useState<HTMLDialogElement | null>(null);
  const restoreFocusFrameRef = useRef<number | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const open = controlledOpen ?? uncontrolledOpen;

  function setOpen(nextOpen: boolean): void {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
    if (nextOpen !== open) onOpenChange?.(nextOpen);
  }

  function requestOpen(returnFocusTarget?: HTMLElement): void {
    if (restoreFocusFrameRef.current !== null) {
      window.cancelAnimationFrame(restoreFocusFrameRef.current);
      restoreFocusFrameRef.current = null;
    }
    if (returnFocusTarget !== undefined) {
      previousFocusRef.current = returnFocusTarget;
    }
    setOpen(true);
  }

  function requestClose(): void {
    setOpen(false);
  }

  useEffect(() => {
    if (dialogNode === null) return;

    const compatibleDialog = dialogNode as HTMLDialogElement & {
      close?: () => void;
      showModal?: () => void;
    };

    if (open) {
      if (restoreFocusFrameRef.current !== null) {
        window.cancelAnimationFrame(restoreFocusFrameRef.current);
        restoreFocusFrameRef.current = null;
      }
      if (!dialogNode.open) {
        if (previousFocusRef.current === null) {
          previousFocusRef.current =
            document.activeElement instanceof HTMLElement
              ? document.activeElement
              : null;
        }

        if (typeof compatibleDialog.showModal === "function") {
          compatibleDialog.showModal();
        } else {
          dialogNode.setAttribute("open", "");
        }
      }
      return;
    }

    if (dialogNode.open) {
      if (typeof compatibleDialog.close === "function") {
        compatibleDialog.close();
      } else {
        dialogNode.removeAttribute("open");
      }
    }
    const returnFocusTarget = previousFocusRef.current;
    previousFocusRef.current = null;
    if (returnFocusTarget === null) return;

    restoreFocusFrameRef.current = window.requestAnimationFrame(() => {
      restoreFocusFrameRef.current = null;
      if (!returnFocusTarget.isConnected) return;

      const activeElement = document.activeElement;
      const focusStillBelongsToModal =
        activeElement === null ||
        activeElement === document.body ||
        activeElement === dialogNode ||
        (activeElement instanceof Node && dialogNode.contains(activeElement));

      if (focusStillBelongsToModal) {
        returnFocusTarget.focus({ preventScroll: true });
      }
    });

    return () => {
      if (restoreFocusFrameRef.current !== null) {
        window.cancelAnimationFrame(restoreFocusFrameRef.current);
        restoreFocusFrameRef.current = null;
      }
    };
  }, [dialogNode, open]);

  const context: NativeModalContextValue = {
    descriptionId: `${generatedId}-description`,
    hasDescription,
    hasTitle,
    open,
    requestClose,
    requestOpen,
    setDialogNode,
    styles,
    titleId: `${generatedId}-title`,
  };

  return <NativeModalContext value={context}>{children}</NativeModalContext>;
}

function NativeModalTrigger({
  className,
  onClick,
  ref,
  type = "button",
  ...props
}: NativeModalTriggerProps) {
  const context = useNativeModalContext("Trigger");

  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    onClick?.(event);
    if (!event.defaultPrevented) context.requestOpen(event.currentTarget);
  }

  return (
    <button
      {...props}
      aria-expanded={context.open}
      aria-haspopup="dialog"
      className={joinClassNames(context.styles.trigger, className)}
      data-state={context.open ? "open" : "closed"}
      onClick={handleClick}
      ref={ref}
      type={type}
    />
  );
}

function NativeModalClose({
  className,
  onClick,
  type = "button",
  ...props
}: NativeModalCloseProps) {
  const context = useNativeModalContext("Close");

  function handleClick(event: MouseEvent<HTMLButtonElement>): void {
    onClick?.(event);
    if (!event.defaultPrevented) context.requestClose();
  }

  return (
    <button
      {...props}
      className={joinClassNames(context.styles.close, className)}
      onClick={handleClick}
      type={type}
    />
  );
}

function NativeModalPopup({
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
  children,
  className,
  closeOnBackdrop = true,
  onCancel,
  onClose,
  onPointerDown,
  ref,
  ...props
}: NativeModalPopupProps) {
  const context = useNativeModalContext("Popup");
  const { setDialogNode } = context;

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>): void {
    onCancel?.(event);
    if (!event.defaultPrevented) {
      event.preventDefault();
      context.requestClose();
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDialogElement>): void {
    onPointerDown?.(event);
    if (
      closeOnBackdrop &&
      !event.defaultPrevented &&
      event.target === event.currentTarget
    ) {
      const bounds = event.currentTarget.getBoundingClientRect();
      const outsidePopup =
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom;
      if (outsidePopup) context.requestClose();
    }
  }

  function handleClose(event: SyntheticEvent<HTMLDialogElement>): void {
    onClose?.(event);
    if (!event.defaultPrevented && context.open) context.requestClose();
  }

  const setPopupRef = useCallback(
    (node: HTMLDialogElement | null): void => {
      setDialogNode(node);
      assignRef(ref, node);
    },
    [ref, setDialogNode],
  );

  return (
    <dialog
      {...props}
      aria-describedby={
        ariaDescribedBy ??
        (context.hasDescription ? context.descriptionId : undefined)
      }
      aria-labelledby={
        ariaLabelledBy ?? (context.hasTitle ? context.titleId : undefined)
      }
      className={joinClassNames(context.styles.popup, className)}
      data-state={context.open ? "open" : "closed"}
      onCancel={handleCancel}
      onClose={handleClose}
      onPointerDown={handlePointerDown}
      ref={setPopupRef}
    >
      {children}
    </dialog>
  );
}

export const NativeModal = {
  Close: NativeModalClose,
  Description: NativeModalDescription,
  Popup: NativeModalPopup,
  Root: NativeModalRoot,
  Title: NativeModalTitle,
  Trigger: NativeModalTrigger,
} as const;
