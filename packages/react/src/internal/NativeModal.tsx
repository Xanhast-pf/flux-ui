import {
  createContext,
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
import { attachRef } from "./attachRef.js";
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
  descriptionIds: string;
  setDialogNode: (node: HTMLDialogElement | null) => void;
  open: boolean;
  requestClose: () => void;
  requestOpen: (returnFocusTarget?: HTMLElement) => void;
  styles: NativeModalStyles;
  titleIds: string;
  registerPart: (kind: "title" | "description", id: string) => () => void;
};

type NativeModalInternalRootProps = NativeModalRootProps & {
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

function usePartRef<T>(
  kind: "title" | "description",
  id: string,
  ref: Ref<T> | undefined,
) {
  const { registerPart } = useNativeModalContext(kind);
  return useCallback(
    (node: T | null) => {
      if (node === null) return;
      const unregister = registerPart(kind, id);
      const cleanup = attachRef(ref, node);
      return () => {
        cleanup?.();
        unregister();
      };
    },
    [id, kind, ref, registerPart],
  );
}

function NativeModalTitle({
  ref,
  children,
  className,
  ...props
}: NativeModalTitleProps) {
  const context = useNativeModalContext("Title");
  const id = useId();
  const setNode = usePartRef("title", id, ref);
  return (
    <h2
      {...props}
      className={joinClassNames(context.styles.title, className)}
      id={id}
      ref={setNode}
    >
      {children}
    </h2>
  );
}

function NativeModalDescription({
  ref,
  children,
  className,
  ...props
}: NativeModalDescriptionProps) {
  const context = useNativeModalContext("Description");
  const id = useId();
  const setNode = usePartRef("description", id, ref);
  return (
    <p
      {...props}
      className={joinClassNames(context.styles.description, className)}
      id={id}
      ref={setNode}
    >
      {children}
    </p>
  );
}

function NativeModalRoot({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  styles,
}: NativeModalInternalRootProps) {
  const [parts, setParts] = useState<{
    title: string[];
    description: string[];
  }>({ title: [], description: [] });
  const registerPart = useCallback(
    (kind: "title" | "description", id: string) => {
      setParts((previous) => ({
        ...previous,
        [kind]: [...previous[kind], id],
      }));
      return () =>
        setParts((previous) => ({
          ...previous,
          [kind]: previous[kind].filter((value) => value !== id),
        }));
    },
    [],
  );
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [nativeCloseRevision, setNativeCloseRevision] = useState(0);
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
      dialogNode?.ownerDocument.defaultView?.cancelAnimationFrame(
        restoreFocusFrameRef.current,
      );
      restoreFocusFrameRef.current = null;
    }
    if (returnFocusTarget !== undefined) {
      previousFocusRef.current = returnFocusTarget;
    }
    setOpen(true);
  }

  function requestClose(): void {
    // Native close()/method="dialog" can close the DOM before a controlled
    // owner accepts the request. Reconcile even when its open prop stays true.
    if (controlledOpen === true && dialogNode !== null && !dialogNode.open)
      setNativeCloseRevision((revision) => revision + 1);
    setOpen(false);
  }

  useEffect(() => {
    if (dialogNode === null) return;
    const document = dialogNode.ownerDocument;
    const view = document.defaultView;
    if (view === null) return;

    const compatibleDialog = dialogNode as HTMLDialogElement & {
      close?: () => void;
      showModal?: () => void;
    };

    if (open) {
      if (restoreFocusFrameRef.current !== null) {
        view.cancelAnimationFrame(restoreFocusFrameRef.current);
        restoreFocusFrameRef.current = null;
      }
      if (!dialogNode.open) {
        if (previousFocusRef.current === null) {
          previousFocusRef.current =
            document.activeElement instanceof view.HTMLElement
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

    restoreFocusFrameRef.current = view.requestAnimationFrame(() => {
      restoreFocusFrameRef.current = null;
      if (!returnFocusTarget.isConnected) return;

      const activeElement = document.activeElement;
      const focusStillBelongsToModal =
        activeElement === null ||
        activeElement === document.body ||
        dialogNode.contains(activeElement);

      if (focusStillBelongsToModal) {
        returnFocusTarget.focus({ preventScroll: true });
      }
    });

    return () => {
      if (restoreFocusFrameRef.current !== null) {
        view.cancelAnimationFrame(restoreFocusFrameRef.current);
        restoreFocusFrameRef.current = null;
      }
    };
  }, [dialogNode, nativeCloseRevision, open]);

  const context: NativeModalContextValue = {
    descriptionIds: parts.description.join(" "),
    registerPart,
    open,
    requestClose,
    requestOpen,
    setDialogNode,
    styles,
    titleIds: parts.title.join(" "),
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
  "aria-label": ariaLabel,
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
    if (!event.defaultPrevented && event.target === event.currentTarget) {
      event.preventDefault();
      context.requestClose();
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDialogElement>): void {
    onPointerDown?.(event);
    if (
      closeOnBackdrop &&
      !event.defaultPrevented &&
      event.button === 0 &&
      event.isPrimary !== false &&
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
    // A queued close event from an earlier close must not dismiss a reopened
    // dialog. Nested modal events must not close their ancestor either.
    if (
      !event.defaultPrevented &&
      event.target === event.currentTarget &&
      !event.currentTarget.open &&
      context.open
    )
      context.requestClose();
  }

  const setPopupRef = useCallback(
    (node: HTMLDialogElement | null) => {
      setDialogNode(node);
      if (node === null) return;
      const cleanup = attachRef(ref, node);
      return () => {
        cleanup?.();
        setDialogNode(null);
      };
    },
    [ref, setDialogNode],
  );

  return (
    <dialog
      {...props}
      aria-label={ariaLabel}
      aria-describedby={
        ariaDescribedBy ?? (context.descriptionIds || undefined)
      }
      aria-labelledby={
        ariaLabelledBy ??
        (ariaLabel ? undefined : context.titleIds || undefined)
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
