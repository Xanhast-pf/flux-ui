import type { Ref } from "react";

/** Preserve React 19 cleanup refs, legacy callbacks and object refs. */
export function attachRef<T>(
  ref: Ref<T> | undefined,
  node: T,
): (() => void) | undefined {
  if (typeof ref === "function") {
    const cleanup = ref(node);
    return typeof cleanup === "function"
      ? cleanup
      : () => {
          ref(null);
        };
  }
  if (ref) {
    ref.current = node;
    return () => {
      ref.current = null;
    };
  }
  return undefined;
}
