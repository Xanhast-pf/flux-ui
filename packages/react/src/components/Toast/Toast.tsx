import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { joinClassNames } from "../../internal/joinClassNames.js";
import { Button } from "../Button/Button.js";
import * as styles from "./Toast.css.js";
import type {
  ToastController,
  ToastOptions,
  ToastProviderProps,
  ToastViewportProps,
} from "./Toast.types.js";
interface Notice extends ToastOptions {
  id: string;
  duration: number;
}
interface ToastState extends ToastController {
  notices: readonly Notice[];
  maxVisible: number;
  dismissLabel: string;
}
const Context = createContext<ToastState | null>(null);
function useContextValue(): ToastState {
  const context = useContext(Context);
  if (context === null)
    throw new Error(
      "Toast.Viewport and useToast must be used inside Toast.Provider.",
    );
  return context;
}
export function useToast(): ToastController {
  return useContextValue();
}
function Provider({
  children,
  duration = 6000,
  maxVisible = 3,
  dismissLabel = "Dismiss notification",
}: ToastProviderProps) {
  const prefix = useId();
  const sequence = useRef(0);
  const origins = useRef(new Map<string, HTMLElement>());
  const [notices, setNotices] = useState<Notice[]>([]);
  const notify = useCallback(
    (options: ToastOptions): string => {
      sequence.current += 1;
      const id = `${prefix}-toast-${sequence.current}`;
      if (
        typeof document !== "undefined" &&
        document.activeElement instanceof HTMLElement
      )
        origins.current.set(id, document.activeElement);
      const requested = options.duration ?? duration;
      const timeout = Number.isFinite(requested)
        ? Math.max(0, Math.min(2147483647, requested))
        : 6000;
      setNotices((current) => [
        ...current,
        { ...options, duration: timeout, id },
      ]);
      return id;
    },
    [prefix, duration],
  );
  const dismiss = useCallback((id: string) => {
    const node =
      typeof document === "undefined" ? null : document.getElementById(id);
    const focused = node?.contains(node.ownerDocument.activeElement);
    const origin = origins.current.get(id);
    origins.current.delete(id);
    setNotices((current) => current.filter((notice) => notice.id !== id));
    if (focused && origin !== undefined)
      queueMicrotask(() => {
        if (
          origin.isConnected &&
          origin.ownerDocument.activeElement === origin.ownerDocument.body
        )
          origin.focus({ preventScroll: true });
      });
  }, []);
  const count = Number.isFinite(maxVisible)
    ? Math.max(1, Math.trunc(maxVisible))
    : 3;
  return (
    <Context
      value={{ notices, notify, dismiss, maxVisible: count, dismissLabel }}
    >
      {children}
    </Context>
  );
}
function subscribeVisibility(listener: () => void) {
  document.addEventListener("visibilitychange", listener);
  return () => document.removeEventListener("visibilitychange", listener);
}
function hiddenSnapshot() {
  return document.hidden;
}
function serverHiddenSnapshot() {
  return false;
}
function Item({ notice }: { notice: Notice }) {
  const { dismiss, dismissLabel } = useContextValue();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const hidden = useSyncExternalStore(
    subscribeVisibility,
    hiddenSnapshot,
    serverHiddenSnapshot,
  );
  const remaining = useRef(notice.duration);
  const paused = hovered || focused || hidden;
  useEffect(() => {
    if (paused || notice.duration === 0) return;
    const started = Date.now();
    const timer = setTimeout(() => dismiss(notice.id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(
        0,
        remaining.current - Math.max(0, Date.now() - started),
      );
    };
  }, [paused, notice.duration, notice.id, dismiss]);
  return (
    <li
      id={notice.id}
      className={styles.item}
      data-tone={notice.tone ?? "neutral"}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <div
        role={notice.tone === "danger" ? "alert" : "status"}
        aria-atomic="true"
      >
        <strong className={styles.title}>{notice.title}</strong>
        {notice.description !== undefined ? (
          <p className={styles.description}>{notice.description}</p>
        ) : null}
      </div>
      <div className={styles.actions}>
        {notice.action !== undefined ? (
          <Button
            size="sm"
            variant="outline"
            tone="neutral"
            onClick={() => {
              notice.action?.onClick();
              dismiss(notice.id);
            }}
          >
            {notice.action.label}
          </Button>
        ) : null}
        <Button
          size="sm"
          variant="ghost"
          tone="neutral"
          aria-label={dismissLabel}
          onClick={() => dismiss(notice.id)}
        >
          Dismiss
        </Button>
      </div>
    </li>
  );
}
function Viewport({
  className,
  placement = "fixed",
  "aria-label": label = "Notifications",
  ...props
}: ToastViewportProps) {
  const { notices, maxVisible } = useContextValue();
  return (
    <ol
      {...props}
      aria-label={label}
      className={joinClassNames(styles.viewport, className)}
      data-placement={placement}
    >
      {notices.slice(0, maxVisible).map((notice) => (
        <Item key={notice.id} notice={notice} />
      ))}
    </ol>
  );
}
export const Toast = { Provider, Viewport } as const;
