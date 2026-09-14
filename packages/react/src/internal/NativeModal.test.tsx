import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NativeModal } from "./NativeModal.js";

for (const realm of ["main", "iframe"] as const) {
  describe(`NativeModal ${realm} focus restoration`, () => {
    it.each(["null", "body", "dialog", "child", "outside"] as const)(
      "restores only modal-owned focus when activeElement is %s",
      (destination) => {
        const iframe = document.createElement("iframe");
        if (realm === "iframe") document.body.append(iframe);
        const ownerDocument =
          realm === "iframe" ? iframe.contentDocument : document;
        if (!ownerDocument?.defaultView) throw new Error("Missing realm");
        const view = ownerDocument.defaultView;
        const target = ownerDocument.createElement("button");
        const outside = ownerDocument.createElement("button");
        const container = ownerDocument.createElement("div");
        ownerDocument.body.append(target, outside, container);
        target.focus();
        let restoreFocus: FrameRequestCallback | undefined;
        const requestFrame = vi
          .spyOn(view, "requestAnimationFrame")
          .mockImplementation((callback) => {
            restoreFocus = callback;
            return 1;
          });
        const cancelFrame = vi.spyOn(view, "cancelAnimationFrame");
        const focus = vi.spyOn(target, "focus");
        const modal = (open: boolean) => (
          <NativeModal.Root open={open} styles={{ popup: "" }}>
            <NativeModal.Popup aria-label="Focus test">
              <button type="button">Inside</button>
            </NativeModal.Popup>
          </NativeModal.Root>
        );
        const rendered = render(modal(true), { container });
        try {
          const dialog = container.querySelector("dialog");
          const child = container.querySelector("button");
          if (!dialog || !child) throw new Error("Missing modal");
          rendered.rerender(modal(false));
          const destinations = {
            null: null,
            body: ownerDocument.body,
            dialog,
            child,
            outside,
          };
          const activeElement = vi
            .spyOn(ownerDocument, "activeElement", "get")
            .mockReturnValue(destinations[destination]);
          try {
            expect(requestFrame).toHaveBeenCalledOnce();
            if (!restoreFocus) throw new Error("Missing restoration frame");
            const callback = restoreFocus;
            act(() => callback(0));
            if (destination === "outside") {
              expect(focus).not.toHaveBeenCalled();
            } else {
              expect(focus).toHaveBeenCalledExactlyOnceWith({
                preventScroll: true,
              });
            }
          } finally {
            activeElement.mockRestore();
          }
        } finally {
          rendered.unmount();
          requestFrame.mockRestore();
          cancelFrame.mockRestore();
          focus.mockRestore();
          target.remove();
          outside.remove();
          container.remove();
          iframe.remove();
        }
      },
    );
  });
}
