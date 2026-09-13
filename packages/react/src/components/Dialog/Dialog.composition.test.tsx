import { StrictMode, useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Dialog } from "./Dialog.js";
import { Drawer } from "../Drawer/Drawer.js";
import { Stack } from "../Stack/Stack.js";
for (const [name, Modal] of [
  ["Dialog", Dialog],
  ["Drawer", Drawer],
] as const) {
  describe(`${name} composition`, () => {
    function WrappedHeading() {
      return (
        <Stack>
          <Modal.Title>Wrapped settings</Modal.Title>
          <Modal.Description>Change preferences.</Modal.Description>
        </Stack>
      );
    }
    it("names and describes the modal through public and extracted wrappers", () => {
      render(
        <Modal.Root defaultOpen>
          <Modal.Popup>
            <WrappedHeading />
          </Modal.Popup>
        </Modal.Root>,
      );
      expect(
        screen.getByRole("dialog", { name: "Wrapped settings" }),
      ).toHaveAccessibleDescription("Change preferences.");
    });
    it("registers conditional parts without claiming another nested root", () => {
      function Example() {
        const [visible, setVisible] = useState(false);
        return (
          <Modal.Root defaultOpen>
            <Modal.Popup>
              <button type="button" onClick={() => setVisible(true)}>
                Show title
              </button>
              {visible ? <WrappedHeading /> : null}
              <Dialog.Root>
                <Dialog.Popup>
                  <Dialog.Title>Nested title</Dialog.Title>
                </Dialog.Popup>
              </Dialog.Root>
            </Modal.Popup>
          </Modal.Root>
        );
      }
      render(<Example />);
      fireEvent.click(screen.getByRole("button", { name: "Show title" }));
      const popup = screen.getByRole("dialog", { name: "Wrapped settings" });
      expect(popup.getAttribute("aria-labelledby")).not.toContain(
        screen.getByText("Nested title").id,
      );
    });
    it("honors explicit labeling and composes React 19 ref cleanup in Strict Mode", () => {
      const cleanup = vi.fn();
      const ref = vi.fn((node: HTMLDialogElement | null) => {
        if (node) return cleanup;
        return undefined;
      });
      const view = render(
        <StrictMode>
          <Modal.Root defaultOpen>
            <Modal.Popup aria-label="Explicit name" ref={ref}>
              <WrappedHeading />
            </Modal.Popup>
          </Modal.Root>
        </StrictMode>,
      );
      expect(
        screen.getByRole("dialog", { name: "Explicit name" }),
      ).not.toHaveAttribute("aria-labelledby");
      view.unmount();
      expect(cleanup).toHaveBeenCalledTimes(
        ref.mock.calls.filter(([node]) => node !== null).length,
      );
      expect(cleanup).toHaveBeenCalled();
    });
  });
}
